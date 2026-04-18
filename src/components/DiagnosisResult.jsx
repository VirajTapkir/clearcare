import { diagnoses, getDiagnosis } from '../data/medicalData.js';

function severityClass(color) {
  return `severity-badge severity-${color || 'green'}`;
}

export default function DiagnosisResult({
  selectedSymptoms,
  onFindHospitals,
  onNotSure,
  onBack,
}) {
  const results = getDiagnosis(selectedSymptoms) || [];
  const primary = results[0]?.diagnosis || null;
  const others = results.slice(1).map(r => r.diagnosis);

  // Fallback if the symptom set didn't match anything in our diagnosis database
  if (!primary) {
    return (
      <div className="page-container">
        <button className="back-btn" onClick={onBack}>&#8592; Back</button>
        <div className="page-header">
          <h2>We couldn't match your symptoms to a specific condition</h2>
          <p className="page-subtitle">
            Don't worry — you can still see nearby hospitals and get a general
            cost range. For a proper diagnosis, consult with a clinician.
          </p>
        </div>
        <div className="diagnosis-actions">
          <button className="btn-outline" onClick={onNotSure}>
            Show All Hospitals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button className="back-btn" onClick={onBack}>&#8592; Back</button>

      <div className="page-header">
        <h2>Most likely condition</h2>
        <p className="page-subtitle">
          Based on your symptoms. This is a preliminary screening — not a
          medical diagnosis. Always confirm with a clinician.
        </p>
      </div>

      {/* Primary diagnosis card */}
      <div className="diagnosis-card primary-diagnosis">
        <div className="diagnosis-header">
          <div>
            <div className="diagnosis-name">{primary.name}</div>
            <div className="diagnosis-icd">ICD-10: {primary.icdCode}</div>
          </div>
          <span className={severityClass(primary.severityColor)}>
            {primary.severity}
          </span>
        </div>

        <p className="diagnosis-description">{primary.description}</p>

        <div className="urgency-row">
          <span className="urgency-label">Urgency</span>
          <span className="urgency-value">{primary.urgency}</span>
        </div>
        <div className="urgency-row">
          <span className="urgency-label">Typical specialist</span>
          <span className="urgency-value">{primary.specialist}</span>
        </div>

        {/* Cost section */}
        <div className="cost-section">
          <div className="cost-title">Typical cost for this condition</div>

          <div className="cost-summary">
            <div className="cost-stat">
              <div className="cost-amount">
                ${primary.avgTotalCost.toLocaleString()}
              </div>
              <div className="cost-label">Avg. total cost</div>
            </div>
            <div className="cost-divider" />
            <div className="cost-stat highlight">
              <div className="cost-amount">
                ${primary.avgOutOfPocket.toLocaleString()}
              </div>
              <div className="cost-label">Avg. out-of-pocket</div>
            </div>
          </div>

          {primary.costBreakdown && (
            <div className="cost-breakdown">
              {Object.entries(primary.costBreakdown).map(([item, cost]) => (
                <div key={item} className="breakdown-row">
                  <span className="breakdown-item">{item}</span>
                  <span className="breakdown-cost">${cost.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          <div className="cost-note">
            Actual cost depends on your insurance plan and the hospital you
            choose. See hospital-by-hospital estimates next.
          </div>
        </div>

        <div className="diagnosis-actions">
          <button className="btn-outline" onClick={onNotSure}>
            Not this — show all hospitals
          </button>
          <button
            className="btn-primary"
            onClick={() => onFindHospitals(primary)}
          >
            Find hospitals for this condition &rarr;
          </button>
        </div>
      </div>

      {/* Other possibilities */}
      {others.length > 0 && (
        <div className="other-diagnoses">
          <h3>Other possible matches</h3>
          <div className="other-list">
            {others.map(d => (
              <div
                key={d.id}
                className="other-card"
                onClick={() => onFindHospitals(d)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onFindHospitals(d);
                }}
              >
                <div>
                  <div className="other-name">{d.name}</div>
                  <div className="other-meta">
                    <span className={severityClass(d.severityColor)}>
                      {d.severity}
                    </span>
                    <span className="dot">·</span>
                    <span className="other-cost">
                      ~${d.avgOutOfPocket} out-of-pocket
                    </span>
                  </div>
                </div>
                <span className="other-arrow">&rarr;</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
