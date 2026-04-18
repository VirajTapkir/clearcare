export default function LandingPage({ onStart, onBrowseHospitals, userProfile }) {
  const isOnboarded = !!userProfile;

  return (
    <div className="landing">
      <div className="landing-hero">
        <div className="landing-badge">
          {isOnboarded ? 'Welcome back' : 'Healthcare clarity for international students'}
        </div>
        <h1 className="landing-title">
          Know What You'll Pay<br />
          <span className="landing-title-accent">Before You Go</span>
        </h1>
        <p className="landing-subtitle">
          {isOnboarded
            ? `Hi! We have your ${userProfile.carrier?.name} info saved. Check symptoms or browse hospitals near ZIP ${userProfile.zip}.`
            : 'ClearCare checks if the hospital takes your insurance and shows what you will actually pay — before you walk in. Built for F-1, J-1, and other international students.'}
        </p>
        <div className="landing-ctas">
          <button className="btn-primary btn-large" onClick={onStart}>
            {isOnboarded ? 'Check Your Symptoms' : 'Get Started'}
          </button>
          <button className="btn-outline btn-large" onClick={onBrowseHospitals}>
            Browse Hospitals
          </button>
        </div>
      </div>

      <div className="landing-features">
        <div className="feature-card">
          <div className="feature-icon">&#x1F6E1;&#xFE0F;</div>
          <h3>Insurance-First</h3>
          <p>We check if the hospital takes your plan before anything else. No surprise "out-of-network" bills.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#x1F4CB;</div>
          <h3>Triage, Not Diagnosis</h3>
          <p>Tell us your symptoms — we help you decide how urgent it is. Not a replacement for a doctor.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#x1F4B0;</div>
          <h3>Real Cost Ranges</h3>
          <p>See copay, estimated total, and out-of-pocket costs — specific to your plan, not generic averages.</p>
        </div>
      </div>

      <div className="landing-disclaimer">
        <strong>Medical Disclaimer:</strong> ClearCare provides estimated cost information for reference only.
        Cost estimates are averages and may vary based on your insurance plan, specific treatment, and location.
        Always consult a qualified healthcare provider for medical advice. For emergencies, call 911.
      </div>
    </div>
  );
}
