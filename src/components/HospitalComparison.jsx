import { hospitals, getHospitalCost } from '../data/medicalData.js';
import { isHospitalInNetwork } from '../data/userProfile.js';

function Check({ yes }) {
  return yes
    ? <span className="check-yes">&#10003;</span>
    : <span className="check-no">&#10005;</span>;
}

export default function HospitalComparison({
  selectedHospitalIds,
  diagnosis,
  onBack,
  userProfile,
}) {
  const plan = userProfile?.plan;

  const selected = selectedHospitalIds
    .map(id => hospitals.find(h => h.id === id))
    .filter(Boolean);

  // Pad to 3 columns so the comparison table always has a consistent layout
  const columns = [...selected];
  while (columns.length < 3) columns.push(null);

  // Compute "best value" — lowest out-of-pocket among in-network selected hospitals
  let bestId = null;
  if (diagnosis && selected.length >= 2) {
    let bestCost = Infinity;
    for (const h of selected) {
      if (plan && !isHospitalInNetwork(h, plan)) continue;
      const c = getHospitalCost(h, diagnosis).outOfPocket;
      if (c < bestCost) {
        bestCost = c;
        bestId = h.id;
      }
    }
  }

  // Common covered services across all selected hospitals, for quick comparison
  const allServices = Array.from(
    new Set(selected.flatMap(h => h.coveredServices || []))
  ).sort();

  return (
    <div className="page-container">
      <button className="back-btn" onClick={onBack}>&#8592; Back to hospitals</button>

      <div className="page-header">
        <h2>Side-by-side comparison</h2>
        <p className="page-subtitle">
          {diagnosis
            ? <>Cost estimates for <strong>{diagnosis.name}</strong>.</>
            : <>General comparison. Select a condition to see cost estimates.</>
          }
          {plan && <> In-network status shown for <strong>{plan.name}</strong>.</>}
        </p>
      </div>

      {selected.length < 2 && (
        <div className="empty-state">
          <div className="empty-icon">&#9432;</div>
          <p>Select at least 2 hospitals on the previous page to compare.</p>
        </div>
      )}

      {selected.length >= 2 && (
        <div className="comp-wrapper">
          <table className="comp-table">
            <thead>
              <tr>
                <th className="comp-th-label"></th>
                {columns.map((h, i) =>
                  h ? (
                    <th key={h.id} className="comp-th-hospital">
                      <div className="comp-hospital-name">{h.name}</div>
                      <div className="comp-hospital-tier">{h.tier}</div>
                      {bestId === h.id && (
                        <div style={{ marginTop: 6, fontSize: 11, opacity: 0.95 }}>
                          &#9733; Best value
                        </div>
                      )}
                    </th>
                  ) : (
                    <th key={`empty-${i}`} className="comp-th-hospital comp-empty-header"></th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {/* Basics */}
              <tr className="comp-section-header">
                <td colSpan={columns.length + 1}>Basics</td>
              </tr>
              <tr>
                <td className="comp-label">Rating</td>
                {columns.map((h, i) => (
                  <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                    {h ? (
                      <span>
                        <span className="comp-rating">&#9733;</span> {h.rating.toFixed(1)} ({h.reviewCount.toLocaleString()})
                      </span>
                    ) : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="comp-label">Distance</td>
                {columns.map((h, i) => (
                  <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                    {h ? `${h.distance} mi` : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="comp-label">Beds</td>
                {columns.map((h, i) => (
                  <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                    {h ? h.beds.toLocaleString() : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="comp-label">Phone</td>
                {columns.map((h, i) => (
                  <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                    {h ? h.phone : '—'}
                  </td>
                ))}
              </tr>

              {/* Cost */}
              <tr className="comp-section-header">
                <td colSpan={columns.length + 1}>Cost</td>
              </tr>
              {plan && (
                <tr>
                  <td className="comp-label">In-network?</td>
                  {columns.map((h, i) => (
                    <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                      {h ? <Check yes={isHospitalInNetwork(h, plan)} /> : '—'}
                    </td>
                  ))}
                </tr>
              )}
              {diagnosis && (
                <>
                  <tr>
                    <td className="comp-label">Est. total cost</td>
                    {columns.map((h, i) => (
                      <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                        {h ? `$${getHospitalCost(h, diagnosis).estimated.toLocaleString()}` : '—'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="comp-label">Est. out-of-pocket</td>
                    {columns.map((h, i) => (
                      <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                        {h ? (
                          <strong style={{ color: bestId === h.id ? '#15803d' : undefined }}>
                            ${getHospitalCost(h, diagnosis).outOfPocket.toLocaleString()}
                          </strong>
                        ) : '—'}
                      </td>
                    ))}
                  </tr>
                </>
              )}
              <tr>
                <td className="comp-label">Primary care copay</td>
                {columns.map((h, i) => (
                  <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                    {h ? `$${h.copay.primaryCare}` : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="comp-label">Specialist copay</td>
                {columns.map((h, i) => (
                  <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                    {h ? `$${h.copay.specialist}` : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="comp-label">Urgent care copay</td>
                {columns.map((h, i) => (
                  <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                    {h ? `$${h.copay.urgentCare}` : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="comp-label">ER copay</td>
                {columns.map((h, i) => (
                  <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                    {h ? `$${h.copay.er}` : '—'}
                  </td>
                ))}
              </tr>

              {/* Wait times */}
              <tr className="comp-section-header">
                <td colSpan={columns.length + 1}>Wait times</td>
              </tr>
              <tr>
                <td className="comp-label">ER wait</td>
                {columns.map((h, i) => (
                  <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                    {h ? `~${h.waitTime.er} min` : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="comp-label">Urgent care wait</td>
                {columns.map((h, i) => (
                  <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                    {h ? `~${h.waitTime.urgent} min` : '—'}
                  </td>
                ))}
              </tr>

              {/* Quality */}
              <tr className="comp-section-header">
                <td colSpan={columns.length + 1}>Quality & safety</td>
              </tr>
              <tr>
                <td className="comp-label">Safety grade</td>
                {columns.map((h, i) => (
                  <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                    {h ? h.quality.safety : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="comp-label">Patient satisfaction</td>
                {columns.map((h, i) => (
                  <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                    {h ? `${h.quality.patientSatisfaction}%` : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="comp-label">Infection risk</td>
                {columns.map((h, i) => (
                  <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                    {h ? h.quality.infection : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="comp-label">Telehealth available</td>
                {columns.map((h, i) => (
                  <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                    {h ? <Check yes={h.telehealth} /> : '—'}
                  </td>
                ))}
              </tr>

              {/* Services */}
              {allServices.length > 0 && (
                <>
                  <tr className="comp-section-header">
                    <td colSpan={columns.length + 1}>Services covered</td>
                  </tr>
                  {allServices.map(s => (
                    <tr key={s}>
                      <td className="comp-label">{s}</td>
                      {columns.map((h, i) => (
                        <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                          {h ? <Check yes={h.coveredServices?.includes(s)} /> : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}

              {/* Languages */}
              <tr className="comp-section-header">
                <td colSpan={columns.length + 1}>Languages spoken</td>
              </tr>
              <tr>
                <td className="comp-label">Languages</td>
                {columns.map((h, i) => (
                  <td key={i} className={`comp-value ${!h ? 'comp-empty' : ''}`}>
                    {h ? h.languages.join(', ') : '—'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
