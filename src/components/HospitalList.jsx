import { hospitals, getHospitalCost } from '../data/medicalData.js';
import { isHospitalInNetwork } from '../data/userProfile.js';

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? 'star filled' : (i === full && half ? 'star half' : 'star empty')}>
          ★
        </span>
      ))}
      <span className="rating-num">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function HospitalList({
  diagnosis,
  selectedHospitals,
  onToggleHospital,
  onCompare,
  onBack,
  userProfile,
}) {
  const maxSelect = 3;
  const plan = userProfile?.plan;

  function isSelected(id) {
    return selectedHospitals.includes(id);
  }
  function canSelect(id) {
    return isSelected(id) || selectedHospitals.length < maxSelect;
  }

  // Sort hospitals: in-network first, then by distance
  const sortedHospitals = [...hospitals].sort((a, b) => {
    const aIn = plan ? isHospitalInNetwork(a, plan) : false;
    const bIn = plan ? isHospitalInNetwork(b, plan) : false;
    if (aIn !== bIn) return aIn ? -1 : 1;
    return a.distance - b.distance;
  });

  // Compute filtered radius info — hospitals near user's ZIP
  const userZip = userProfile?.zip;

  return (
    <div className="page-container">
      <button className="back-btn" onClick={onBack}>&#8592; Back</button>

      <div className="page-header">
        <h2>
          {diagnosis ? `Hospitals for ${diagnosis.shortName}` : 'All Nearby Hospitals'}
        </h2>
        <p className="page-subtitle">
          {diagnosis
            ? `Estimated costs based on average treatment for ${diagnosis.name}.`
            : 'Browse hospitals and select up to 3 to compare.'}
          {userZip && <> Showing results near <strong>ZIP {userZip}</strong>.</>}
          {' '}You can select up to <strong>3 hospitals</strong>.
        </p>
      </div>

      {plan && (
        <div className="plan-banner">
          <div className="plan-banner-icon" style={{ background: userProfile.carrier?.color || '#555' }}>
            {userProfile.carrier?.logoText || '?'}
          </div>
          <div className="plan-banner-text">
            <div className="plan-banner-title">Your plan: {plan.name}</div>
            <div className="plan-banner-sub">
              Network: {plan.network} · Urgent care copay ${plan.copayUrgentCare} · ER ${plan.copayEr}
            </div>
          </div>
        </div>
      )}

      {selectedHospitals.length > 0 && (
        <div className="compare-bar">
          <span>{selectedHospitals.length} hospital{selectedHospitals.length > 1 ? 's' : ''} selected</span>
          <button
            className="btn-primary"
            onClick={onCompare}
            disabled={selectedHospitals.length < 2}
          >
            Compare {selectedHospitals.length} Hospitals
          </button>
        </div>
      )}

      <div className="hospital-list">
        {sortedHospitals.map(h => {
          const cost = diagnosis ? getHospitalCost(h, diagnosis) : null;
          const selected = isSelected(h.id);
          const disabled = !canSelect(h.id);
          const inNetwork = plan ? isHospitalInNetwork(h, plan) : null;

          return (
            <div
              key={h.id}
              className={`hospital-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${inNetwork === false ? 'out-of-network' : ''}`}
            >
              <div className="hospital-card-top">
                <div className="hospital-info">
                  <div className="hospital-name-row">
                    <div className="hospital-name">{h.name}</div>
                    {inNetwork === true && (
                      <span className="network-badge in-network">✓ In-Network</span>
                    )}
                    {inNetwork === false && (
                      <span className="network-badge out-net">✗ Out-of-Network</span>
                    )}
                  </div>
                  <div className="hospital-tier">{h.tier}</div>
                  <div className="hospital-meta">
                    <StarRating rating={h.rating} />
                    <span className="dot">·</span>
                    <span>{h.reviewCount.toLocaleString()} reviews</span>
                    <span className="dot">·</span>
                    <span>{h.distance} mi away</span>
                  </div>
                  <div className="hospital-address">{h.address}</div>
                </div>

                <div className="hospital-right">
                  {cost ? (
                    <div className="cost-badge-group">
                      <div className="cost-badge">
                        <div className="cb-amount">${cost.estimated.toLocaleString()}</div>
                        <div className="cb-label">Est. Total</div>
                      </div>
                      <div className={`cost-badge ${inNetwork === false ? 'warn' : 'highlight'}`}>
                        <div className="cb-amount">
                          {inNetwork === false
                            ? `$${Math.round(cost.estimated * 0.5).toLocaleString()}+`
                            : `$${cost.outOfPocket.toLocaleString()}`}
                        </div>
                        <div className="cb-label">
                          {inNetwork === false ? 'Your cost (est.)' : 'Out-of-Pocket'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="copay-preview">
                      {plan ? (
                        <>
                          <div className="cp-row"><span>Your urgent care</span><span>${plan.copayUrgentCare}</span></div>
                          <div className="cp-row"><span>Your ER copay</span><span>${plan.copayEr}</span></div>
                          <div className="cp-row"><span>Your specialist</span><span>${plan.copaySpecialist}</span></div>
                        </>
                      ) : (
                        <>
                          <div className="cp-row"><span>Primary Care</span><span>${h.copay.primaryCare}</span></div>
                          <div className="cp-row"><span>Specialist</span><span>${h.copay.specialist}</span></div>
                          <div className="cp-row"><span>ER</span><span>${h.copay.er}</span></div>
                        </>
                      )}
                    </div>
                  )}
                  <button
                    className={`select-btn ${selected ? 'selected' : ''}`}
                    onClick={() => onToggleHospital(h.id)}
                    disabled={disabled}
                  >
                    {selected ? '✓ Selected' : disabled ? 'Max 3 Selected' : 'Select'}
                  </button>
                </div>
              </div>

              {/* Covered services block */}
              {h.coveredServices && h.coveredServices.length > 0 && (
                <div className="covered-services">
                  <div className="cs-title">Services covered at this hospital</div>
                  <div className="cs-grid">
                    {h.coveredServices.map(s => (
                      <span key={s} className="cs-pill">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="hospital-card-bottom">
                <div className="facilities-row">
                  {h.facilities.slice(0, 5).map(f => (
                    <span key={f} className="facility-tag">{f}</span>
                  ))}
                  {h.facilities.length > 5 && (
                    <span className="facility-tag more">+{h.facilities.length - 5} more</span>
                  )}
                </div>
                <div className="hospital-badges">
                  <span className={`quality-badge safety-${h.quality.safety.replace('+', 'plus')}`}>
                    Safety: {h.quality.safety}
                  </span>
                  <span className="quality-badge">
                    {h.quality.patientSatisfaction}% Satisfaction
                  </span>
                  <span className="wait-badge">
                    ER Wait: ~{h.waitTime.er} min
                  </span>
                  {h.telehealth && <span className="telehealth-badge">Telehealth</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
