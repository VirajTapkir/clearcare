import { useState } from 'react';
import './App.css';
import './TreatmentTimeline.css';
import Header from './components/Header.jsx';
import LandingPage from './components/LandingPage.jsx';
import OnboardingFlow from './components/OnboardingFlow.jsx';
import SymptomChecker from './components/SymptomChecker.jsx';
import DiagnosisResult from './components/DiagnosisResult.jsx';
import HospitalList from './components/HospitalList.jsx';
import HospitalComparison from './components/HospitalComparison.jsx';
import TreatmentTimeline from './components/TreatmentTimeline.jsx';

const STEPS = {
  LANDING: 'landing',
  ONBOARDING: 'onboarding',
  SYMPTOMS: 'symptoms',
  DIAGNOSIS: 'diagnosis',
  HOSPITALS: 'hospitals',
  COMPARISON: 'comparison',
  TIMELINE: 'timeline',
};

export default function App() {
  const [step, setStep] = useState(STEPS.LANDING);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptomLabels, setCustomSymptomLabels] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);
  const [selectedHospitals, setSelectedHospitals] = useState([]);
  const [bookedHospitalId, setBookedHospitalId] = useState(null);

  function handleStart() {
    if (userProfile) {
      setStep(STEPS.SYMPTOMS);
    } else {
      setStep(STEPS.ONBOARDING);
    }
  }

  function handleBrowseHospitals() {
    setDiagnosis(null);
    setSelectedHospitals([]);
    if (userProfile) {
      setStep(STEPS.HOSPITALS);
    } else {
      setStep(STEPS.ONBOARDING);
    }
  }

  function handleOnboardingComplete(profile) {
    setUserProfile(profile);
    setStep(STEPS.SYMPTOMS);
  }

  function handleOnboardingBack() {
    setStep(STEPS.LANDING);
  }

  function handleSymptomsSubmit(builtInIds, customLabels = []) {
    setSelectedSymptoms(builtInIds);
    setCustomSymptomLabels(customLabels);
    const totalSymptoms = builtInIds.length + customLabels.length;
    if (totalSymptoms === 0) {
      setDiagnosis(null);
      setSelectedHospitals([]);
      setStep(STEPS.HOSPITALS);
    } else if (builtInIds.length === 0) {
      setDiagnosis(null);
      setSelectedHospitals([]);
      setStep(STEPS.HOSPITALS);
    } else {
      setStep(STEPS.DIAGNOSIS);
    }
  }

  function handleFindHospitals(diag) {
    setDiagnosis(diag);
    setSelectedHospitals([]);
    setStep(STEPS.HOSPITALS);
  }

  function handleNotSure() {
    setDiagnosis(null);
    setSelectedHospitals([]);
    setStep(STEPS.HOSPITALS);
  }

  function handleToggleHospital(id) {
    setSelectedHospitals(prev => {
      if (prev.includes(id)) return prev.filter(h => h !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  function handleCompare() {
    setStep(STEPS.COMPARISON);
  }

  function handleBookHospital(id) {
    setBookedHospitalId(id);
    setStep(STEPS.TIMELINE);
  }

  function handleLogoClick() {
    setStep(STEPS.LANDING);
    setSelectedSymptoms([]);
    setCustomSymptomLabels([]);
    setDiagnosis(null);
    setSelectedHospitals([]);
    setBookedHospitalId(null);
  }

  function goBack() {
    const backMap = {
      [STEPS.ONBOARDING]: STEPS.LANDING,
      [STEPS.SYMPTOMS]: userProfile ? STEPS.LANDING : STEPS.ONBOARDING,
      [STEPS.DIAGNOSIS]: STEPS.SYMPTOMS,
      [STEPS.HOSPITALS]: diagnosis ? STEPS.DIAGNOSIS : STEPS.SYMPTOMS,
      [STEPS.COMPARISON]: STEPS.HOSPITALS,
      [STEPS.TIMELINE]: STEPS.HOSPITALS,
    };
    setStep(backMap[step] || STEPS.LANDING);
  }

  return (
    <div className="app">
      <Header onLogoClick={handleLogoClick} userProfile={userProfile} />

      <main className="main-content">
        {step === STEPS.LANDING && (
          <LandingPage
            onStart={handleStart}
            onBrowseHospitals={handleBrowseHospitals}
            userProfile={userProfile}
          />
        )}

        {step === STEPS.ONBOARDING && (
          <OnboardingFlow
            onComplete={handleOnboardingComplete}
            onBack={handleOnboardingBack}
          />
        )}

        {step === STEPS.SYMPTOMS && (
          <SymptomChecker onSubmit={handleSymptomsSubmit} onBack={goBack} />
        )}

        {step === STEPS.DIAGNOSIS && (
          <DiagnosisResult
            selectedSymptoms={selectedSymptoms}
            onFindHospitals={handleFindHospitals}
            onNotSure={handleNotSure}
            onBack={goBack}
          />
        )}

        {step === STEPS.HOSPITALS && (
          <HospitalList
            diagnosis={diagnosis}
            selectedHospitals={selectedHospitals}
            onToggleHospital={handleToggleHospital}
            onCompare={handleCompare}
            onBook={handleBookHospital}
            onBack={goBack}
            userProfile={userProfile}
          />
        )}

        {step === STEPS.COMPARISON && (
          <HospitalComparison
            selectedHospitalIds={selectedHospitals}
            diagnosis={diagnosis}
            onBack={goBack}
            onBook={handleBookHospital}
            userProfile={userProfile}
          />
        )}

        {step === STEPS.TIMELINE && (
          <TreatmentTimeline
            selectedHospitalIds={bookedHospitalId ? [bookedHospitalId] : selectedHospitals}
            diagnosis={diagnosis}
            userProfile={userProfile}
            onBack={goBack}
          />
        )}
      </main>

      <footer className="footer">
        <p>© 2025 Intra — Healthcare clarity for international students. For informational purposes only.</p>
      </footer>
    </div>
  );
}
