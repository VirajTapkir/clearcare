import { useState } from 'react';
import {
  visaTypes,
  universities,
  insuranceCarriers,
  insurancePlans,
  getUniversityById,
} from '../data/userProfile.js';

const STEPS = ['zip', 'visa', 'university', 'carrier', 'plan', 'review'];

export default function OnboardingFlow({ onComplete, onBack }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [zip, setZip] = useState('');
  const [visa, setVisa] = useState(null);
  const [university, setUniversity] = useState(null);
  const [carrier, setCarrier] = useState(null);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');

  const step = STEPS[stepIdx];

  function next() {
    setError('');
    if (stepIdx < STEPS.length - 1) setStepIdx(stepIdx + 1);
  }

  function back() {
    setError('');
    if (stepIdx === 0) {
      onBack && onBack();
    } else {
      setStepIdx(stepIdx - 1);
    }
  }

  function handleSelectUniversity(uni) {
    setUniversity(uni);
    // Auto-prefill insurance when school has a known default plan
    if (uni.defaultInsurance && uni.defaultPlan) {
      const c = insuranceCarriers.find(x => x.id === uni.defaultInsurance);
      const p = insurancePlans[uni.defaultInsurance]?.find(x => x.id === uni.defaultPlan);
      setCarrier(c || null);
      setPlan(p || null);
    }
  }

  function handleSelectCarrier(c) {
    setCarrier(c);
    // Reset plan if user switches carrier
    if (!plan || plan.carrierId !== c.id) {
      setPlan(null);
    }
  }

  function finish() {
    const profile = {
      zip,
      visa,
      university,
      carrier,
      plan: plan ? { ...plan, carrierId: carrier.id } : null,
    };
    onComplete(profile);
  }

  function validateAndNext() {
    if (step === 'zip') {
      if (!/^\d{5}$/.test(zip.trim())) {
        setError('Please enter a valid 5-digit US ZIP code.');
        return;
      }
    }
    if (step === 'visa' && !visa) {
      setError('Please select your visa status.');
      return;
    }
    if (step === 'university' && !university) {
      setError('Please select your university or choose "Other".');
      return;
    }
    if (step === 'carrier' && !carrier) {
      setError('Please select your insurance carrier.');
      return;
    }
    if (step === 'plan' && !plan) {
      setError('Please select your specific plan.');
      return;
    }
    next();
  }

  return (
    <div className="onboarding">
      <button className="back-btn" onClick={back}>&#8592; Back</button>

      {/* Progress indicator */}
      <div className="onb-progress">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`onb-step-dot ${i <= stepIdx ? 'active' : ''} ${i === stepIdx ? 'current' : ''}`}
          >
            <span className="onb-step-num">{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="onb-step-label">
        Step {stepIdx + 1} of {STEPS.length} — {stepLabel(step)}
      </div>

      <div className="onb-card">

        {step === 'zip' && (
          <>
            <h2 className="onb-title">Where are you located?</h2>
            <p className="onb-subtitle">
              We'll use this to find hospitals near you and show accurate cost estimates.
            </p>
            <label className="onb-label">ZIP Code</label>
            <input
              className="onb-input"
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="e.g. 07030"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
              autoFocus
            />
            <p className="onb-helper">
              Your location is only used locally to find nearby hospitals. We don't track you.
            </p>
          </>
        )}

        {step === 'visa' && (
          <>
            <h2 className="onb-title">What's your visa status?</h2>
            <p className="onb-subtitle">
              This helps us show insurance plans and resources that apply to you.
              We never share this with providers.
            </p>
            <div className="onb-option-list">
              {visaTypes.map(v => (
                <button
                  key={v.id}
                  className={`onb-option ${visa?.id === v.id ? 'selected' : ''}`}
                  onClick={() => setVisa(v)}
                >
                  <div className="onb-option-main">{v.label}</div>
                  {v.description && <div className="onb-option-sub">{v.description}</div>}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'university' && (
          <>
            <h2 className="onb-title">Which university are you at?</h2>
            <p className="onb-subtitle">
              Most international students are on their school's health plan.
              We'll pre-fill your insurance from this.
            </p>
            <div className="onb-option-list">
              {universities.map(u => (
                <button
                  key={u.id}
                  className={`onb-option ${university?.id === u.id ? 'selected' : ''}`}
                  onClick={() => handleSelectUniversity(u)}
                >
                  <div className="onb-option-main">{u.name}</div>
                  {u.city && (
                    <div className="onb-option-sub">
                      {u.city}, {u.state} · {u.studentCount} students
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'carrier' && (
          <>
            <h2 className="onb-title">Who is your insurance with?</h2>
            <p className="onb-subtitle">
              {university?.defaultInsurance
                ? `Based on ${university.name}, we've pre-selected your carrier. You can change it.`
                : 'Pick the company name on your insurance card.'}
            </p>
            <div className="onb-carrier-grid">
              {insuranceCarriers.map(c => (
                <button
                  key={c.id}
                  className={`onb-carrier ${carrier?.id === c.id ? 'selected' : ''}`}
                  onClick={() => handleSelectCarrier(c)}
                >
                  <div className="onb-carrier-logo" style={{ background: c.color }}>
                    {c.logoText}
                  </div>
                  <div className="onb-carrier-name">{c.name}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'plan' && carrier && (
          <>
            <h2 className="onb-title">Which {carrier.name} plan do you have?</h2>
            <p className="onb-subtitle">
              The exact plan matters — it determines which hospitals are in-network and what you pay.
              Check the front of your insurance card.
            </p>
            <div className="onb-option-list">
              {(insurancePlans[carrier.id] || []).map(p => (
                <button
                  key={p.id}
                  className={`onb-option plan-option ${plan?.id === p.id ? 'selected' : ''}`}
                  onClick={() => setPlan(p)}
                >
                  <div className="plan-top">
                    <div>
                      <div className="onb-option-main">{p.name}</div>
                      <div className="onb-option-sub">
                        {p.type} · Network: {p.network}
                      </div>
                    </div>
                    <div className="plan-badge">{p.type}</div>
                  </div>
                  <div className="plan-benefits">
                    <span><b>${p.copayUrgentCare}</b> urgent care</span>
                    <span><b>${p.copayEr}</b> ER copay</span>
                    <span><b>${p.deductible}</b> deductible</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'review' && (
          <>
            <h2 className="onb-title">Confirm your profile</h2>
            <p className="onb-subtitle">
              Review before continuing. You can always edit this later.
            </p>

            {/* Insurance card preview */}
            {plan && carrier && (
              <div className="ins-card" style={{ background: `linear-gradient(135deg, ${carrier.color} 0%, #1a1a1a 100%)` }}>
                <div className="ins-card-top">
                  <div>
                    <div className="ins-card-label">Member</div>
                    <div className="ins-card-value-lg">You</div>
                  </div>
                  <div className="ins-card-logo" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    {carrier.logoText}
                  </div>
                </div>
                <div className="ins-card-rows">
                  <div>
                    <div className="ins-card-label">Carrier</div>
                    <div className="ins-card-value">{carrier.name}</div>
                  </div>
                  <div>
                    <div className="ins-card-label">Plan</div>
                    <div className="ins-card-value">{plan.name}</div>
                  </div>
                  <div>
                    <div className="ins-card-label">Network</div>
                    <div className="ins-card-value-sm">{plan.network}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="review-grid">
              <ReviewRow label="ZIP Code" value={zip} onEdit={() => setStepIdx(0)} />
              <ReviewRow label="Visa Status" value={visa?.label} onEdit={() => setStepIdx(1)} />
              <ReviewRow label="University" value={university?.name} onEdit={() => setStepIdx(2)} />
              <ReviewRow label="Insurance Carrier" value={carrier?.name} onEdit={() => setStepIdx(3)} />
              <ReviewRow label="Plan" value={plan?.name} onEdit={() => setStepIdx(4)} />
            </div>

            {plan && (
              <div className="review-benefits">
                <div className="review-benefits-title">Your plan pays — quick reference</div>
                <div className="review-benefits-grid">
                  <div><span>Urgent care copay</span><b>${plan.copayUrgentCare}</b></div>
                  <div><span>ER copay</span><b>${plan.copayEr}</b></div>
                  <div><span>Primary care</span><b>${plan.copayPrimaryCare}</b></div>
                  <div><span>Specialist</span><b>${plan.copaySpecialist}</b></div>
                  <div><span>Deductible</span><b>${plan.deductible}</b></div>
                  <div><span>Coinsurance</span><b>{plan.coinsurance}%</b></div>
                </div>
              </div>
            )}
          </>
        )}

        {error && <div className="onb-error">{error}</div>}

        <div className="onb-footer">
          {step === 'review' ? (
            <button className="btn-primary btn-large full-width" onClick={finish}>
              Confirm & Continue &rarr;
            </button>
          ) : (
            <button className="btn-primary btn-large full-width" onClick={validateAndNext}>
              Continue &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, onEdit }) {
  return (
    <div className="review-row">
      <div>
        <div className="review-label">{label}</div>
        <div className="review-value">{value || '—'}</div>
      </div>
      <button className="review-edit-btn" onClick={onEdit}>Edit</button>
    </div>
  );
}

function stepLabel(s) {
  return {
    zip: 'Your Location',
    visa: 'Visa Status',
    university: 'University',
    carrier: 'Insurance Carrier',
    plan: 'Your Plan',
    review: 'Review',
  }[s] || '';
}
