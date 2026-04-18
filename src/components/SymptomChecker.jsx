import { useState } from 'react';
import { symptoms } from '../data/medicalData.js';

export default function SymptomChecker({ onSubmit, onBack }) {
  const [selected, setSelected] = useState([]);
  const [customSymptoms, setCustomSymptoms] = useState([]);
  const [customInput, setCustomInput] = useState('');
  const [customError, setCustomError] = useState('');

  function toggle(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }

  function addCustom() {
    const val = customInput.trim();
    if (!val) return;
    if (val.length < 2) {
      setCustomError('Please enter a more descriptive symptom.');
      return;
    }
    if (val.length > 60) {
      setCustomError('Symptom is too long — keep it short.');
      return;
    }
    const exists =
      customSymptoms.some(s => s.label.toLowerCase() === val.toLowerCase()) ||
      symptoms.some(s => s.label.toLowerCase() === val.toLowerCase());
    if (exists) {
      setCustomError('That symptom is already on your list.');
      return;
    }
    const id = `custom_${Date.now()}`;
    const newSymptom = { id, label: val, custom: true };
    setCustomSymptoms(prev => [...prev, newSymptom]);
    setSelected(prev => [...prev, id]);
    setCustomInput('');
    setCustomError('');
  }

  function removeCustom(id) {
    setCustomSymptoms(prev => prev.filter(s => s.id !== id));
    setSelected(prev => prev.filter(s => s !== id));
  }

  function handleKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustom();
    }
  }

  const totalSelected = selected.length;
  // Pass a combined list of symptoms back — built-in ids + custom symptom labels
  function handleSubmit() {
    const builtInIds = selected.filter(id => !id.startsWith('custom_'));
    const customLabels = customSymptoms
      .filter(s => selected.includes(s.id))
      .map(s => s.label);
    onSubmit(builtInIds, customLabels);
  }

  return (
    <div className="page-container">
      <button className="back-btn" onClick={onBack}>&#8592; Back</button>

      <div className="page-header">
        <h2>What symptoms are you experiencing?</h2>
        <p className="page-subtitle">
          Select all that apply. Can't find yours? Add it manually below.
        </p>
      </div>

      <div className="symptom-grid">
        {symptoms.map(s => (
          <button
            key={s.id}
            className={`symptom-chip ${selected.includes(s.id) ? 'selected' : ''}`}
            onClick={() => toggle(s.id)}
          >
            <span className="chip-check">{selected.includes(s.id) ? '✓' : ''}</span>
            {s.label}
          </button>
        ))}

        {customSymptoms.map(s => (
          <button
            key={s.id}
            className={`symptom-chip custom ${selected.includes(s.id) ? 'selected' : ''}`}
            onClick={() => toggle(s.id)}
          >
            <span className="chip-check">{selected.includes(s.id) ? '✓' : ''}</span>
            {s.label}
            <span
              className="chip-remove"
              onClick={(e) => {
                e.stopPropagation();
                removeCustom(s.id);
              }}
              role="button"
              aria-label="Remove"
            >
              ×
            </span>
          </button>
        ))}
      </div>

      <div className="custom-symptom-box">
        <label className="custom-label">
          Don't see your symptom? Add it below:
        </label>
        <div className="custom-input-row">
          <input
            className="custom-input"
            type="text"
            placeholder="e.g. pain when bending knee, blurry vision…"
            value={customInput}
            onChange={(e) => {
              setCustomInput(e.target.value);
              if (customError) setCustomError('');
            }}
            onKeyDown={handleKey}
            maxLength={60}
          />
          <button
            className="btn-outline custom-add-btn"
            onClick={addCustom}
            disabled={!customInput.trim()}
          >
            + Add
          </button>
        </div>
        {customError && <div className="custom-error">{customError}</div>}
      </div>

      <div className="symptom-footer">
        <span className="selected-count">
          {totalSelected === 0
            ? 'No symptoms selected'
            : `${totalSelected} symptom${totalSelected > 1 ? 's' : ''} selected`}
        </span>
        <div className="symptom-actions">
          <button className="btn-outline" onClick={() => onSubmit([], [])}>
            I'm Not Sure — Show All Hospitals
          </button>
          <button
            className="btn-primary"
            disabled={totalSelected === 0}
            onClick={handleSubmit}
          >
            Analyze Symptoms
          </button>
        </div>
      </div>
    </div>
  );
}
