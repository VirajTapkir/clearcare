import { hospitals, getHospitalCost } from '../data/medicalData.js';
import { isHospitalInNetwork } from '../data/userProfile.js';

// Generate a timeline based on the chosen hospital, diagnosis, and plan.
// Static "current state" — stage 3 (Consultation) is the active step, everything
// before it is complete, everything after is upcoming.
function buildStages(hospital, diagnosis, plan) {
  const cost = diagnosis ? getHospitalCost(hospital, diagnosis) : null;
  const now = new Date();
  const fmt = (d) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const fmtTime = (d) =>
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const today = new Date(now);
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
  const day3 = new Date(now); day3.setDate(now.getDate() + 2);
  const day5 = new Date(now); day5.setDate(now.getDate() + 4);
  const day7 = new Date(now); day7.setDate(now.getDate() + 6);
  const day10 = new Date(now); day10.setDate(now.getDate() + 9);

  return [
    {
      title: 'Hospital Selected',
      desc: `You chose ${hospital.name}. We locked in your in-network estimate so surprise fees don't slip in later.`,
      date: `${fmt(today)} · ${fmtTime(now)}`,
      status: 'complete',
      meta: plan
        ? (isHospitalInNetwork(hospital, plan) ? '✓ In-network confirmed' : '⚠ Out-of-network — higher cost')
        : null,
    },
    {
      title: 'Appointment Booked',
      desc: `Slot reserved at ${hospital.shortName || hospital.name}. Expected wait time ~${hospital.waitTime.urgent} min.`,
      date: `${fmt(tomorrow)} · 10:30 AM`,
      status: 'complete',
      meta: `Confirmation sent to your email`,
    },
    {
      title: 'Pre-Visit Check-in',
      desc: 'Insurance verified, intake forms pre-filled with your profile. Nothing for you to print.',
      date: `${fmt(tomorrow)} · morning of`,
      status: 'current',
      meta: 'In progress — you will get a check-in link 2 hours before your slot',
    },
    {
      title: 'Consultation & Diagnosis',
      desc: diagnosis
        ? `Physician will confirm or adjust the preliminary finding: ${diagnosis.shortName || diagnosis.name}.`
        : 'Physician will evaluate your symptoms and confirm next steps.',
      date: fmt(tomorrow),
      status: 'upcoming',
      meta: diagnosis ? `Specialist typically seen: ${diagnosis.specialist}` : null,
    },
    {
      title: 'Tests & Treatment',
      desc: diagnosis && diagnosis.costBreakdown
        ? `Expected: ${Object.keys(diagnosis.costBreakdown).slice(0, 3).join(', ')}.`
        : 'Any lab work, imaging, or on-site treatment happens here.',
      date: fmt(day3),
      status: 'upcoming',
      meta: cost ? `Estimated portion: $${Math.round(cost.outOfPocket * 0.5).toLocaleString()}` : null,
    },
    {
      title: 'Prescription Filled',
      desc: 'If prescribed, medication is ready at your preferred pharmacy. We surface generic alternatives if they are cheaper.',
      date: fmt(day5),
      status: 'upcoming',
      meta: 'Typical generic savings: 40–70%',
    },
    {
      title: 'Insurance Claim Filed & Audited',
      desc: 'Hospital submits the claim to your insurer. Our audit agent reviews every line for overcharges before you pay.',
      date: fmt(day7),
      status: 'upcoming',
      meta: cost
        ? `Expected your cost: $${cost.outOfPocket.toLocaleString()} (of $${cost.estimated.toLocaleString()} total)`
        : null,
    },
    {
      title: 'Follow-up Complete',
      desc: 'Recovery confirmed. Your treatment history is saved for future visits and insurance appeals.',
      date: fmt(day10),
      status: 'upcoming',
      meta: null,
    },
  ];
}

export default function TreatmentTimeline({
  selectedHospitalIds,
  diagnosis,
  userProfile,
  onBack,
}) {
  const plan = userProfile?.plan;
  const selected = (selectedHospitalIds || [])
    .map(id => hospitals.find(h => h.id === id))
    .filter(Boolean);

  const hospital = selected[0];

  if (!hospital) {
    return (
      <div className="page-container">
        <button className="back-btn" onClick={onBack}>&#8592; Back</button>
        <div className="empty-state">
          <div className="empty-icon">&#9432;</div>
          <p>Select a hospital first to see your treatment timeline.</p>
        </div>
      </div>
    );
  }

  const stages = buildStages(hospital, diagnosis, plan);
  const currentIdx = stages.findIndex(s => s.status === 'current');
  const progressPct = Math.round(((currentIdx + 0.5) / stages.length) * 100);
  const cost = diagnosis ? getHospitalCost(hospital, diagnosis) : null;

  return (
    <div className="page-container">
      <button className="back-btn" onClick={onBack}>&#8592; Back</button>

      <div className="page-header">
        <h2>Your care journey</h2>
        <p className="page-subtitle">
          Tracking every step — from booking to final bill audit. No surprise
          fees, no guesswork.
        </p>
      </div>

      {/* Summary banner */}
      <div className="tt-summary">
        <div className="tt-summary-main">
          <div className="tt-summary-label">Care with</div>
          <div className="tt-summary-title">{hospital.name}</div>
          {diagnosis && (
            <div className="tt-summary-sub">
              for <strong>{diagnosis.shortName || diagnosis.name}</strong>
            </div>
          )}
        </div>
        {cost && (
          <div className="tt-summary-cost">
            <div className="tt-summary-cost-label">Estimated out-of-pocket</div>
            <div className="tt-summary-cost-amount">
              ${cost.outOfPocket.toLocaleString()}
            </div>
            <div className="tt-summary-cost-sub">
              of ${cost.estimated.toLocaleString()} total
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="tt-progress-wrapper">
        <div className="tt-progress-header">
          <span>Step {currentIdx + 1} of {stages.length}</span>
          <span className="tt-progress-current">{stages[currentIdx]?.title}</span>
        </div>
        <div className="tt-progress-bar">
          <div className="tt-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Timeline */}
      <div className="tt-timeline">
        {stages.map((s, i) => (
          <div key={i} className={`tt-stage tt-${s.status}`}>
            <div className="tt-marker-col">
              <div className="tt-marker">
                {s.status === 'complete' && <span className="tt-check">&#10003;</span>}
                {s.status === 'current' && <span className="tt-pulse" />}
                {s.status === 'upcoming' && <span className="tt-dot-inner" />}
              </div>
              {i < stages.length - 1 && <div className="tt-line" />}
            </div>
            <div className="tt-content">
              <div className="tt-stage-head">
                <div className="tt-stage-title">{s.title}</div>
                <div className="tt-stage-date">{s.date}</div>
              </div>
              <div className="tt-stage-desc">{s.desc}</div>
              {s.meta && (
                <div className={`tt-stage-meta tt-meta-${s.status}`}>{s.meta}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Guarantee footer */}
      <div className="tt-guarantee">
        <div className="tt-guarantee-icon">🛡️</div>
        <div>
          <div className="tt-guarantee-title">No-surprise guarantee</div>
          <div className="tt-guarantee-sub">
            If your final bill exceeds ${cost ? cost.outOfPocket.toLocaleString() : 'the estimate'},
            our audit agent will flag every discrepancy and draft an appeal
            letter — citing plan language and federal law.
          </div>
        </div>
      </div>
    </div>
  );
}
