// Non-immigrant visa types commonly held by international students & scholars
export const visaTypes = [
  { id: 'f1', label: 'F-1 (Student)', description: 'Academic student visa' },
  { id: 'f2', label: 'F-2 (Dependent of F-1)', description: 'Spouse/child of F-1' },
  { id: 'j1', label: 'J-1 (Exchange Visitor)', description: 'Scholar, researcher, intern' },
  { id: 'j2', label: 'J-2 (Dependent of J-1)', description: 'Spouse/child of J-1' },
  { id: 'm1', label: 'M-1 (Vocational Student)', description: 'Non-academic or vocational' },
  { id: 'opt', label: 'F-1 OPT / STEM OPT', description: 'Post-completion work auth' },
  { id: 'h1b', label: 'H-1B (Specialty Occupation)', description: 'Post-graduation work visa' },
  { id: 'other', label: 'Other / Prefer not to say', description: '' },
];

// Universities pre-mapped to their student health plans
export const universities = [
  {
    id: 'stevens',
    name: 'Stevens Institute of Technology',
    city: 'Hoboken',
    state: 'NJ',
    zipPrefix: '07030',
    defaultInsurance: 'aetna',
    defaultPlan: 'aetna-student-health',
    studentCount: '8,200',
  },
  {
    id: 'nyu',
    name: 'New York University',
    city: 'New York',
    state: 'NY',
    zipPrefix: '10012',
    defaultInsurance: 'uhc',
    defaultPlan: 'uhc-student-resources',
    studentCount: '59,000',
  },
  {
    id: 'columbia',
    name: 'Columbia University',
    city: 'New York',
    state: 'NY',
    zipPrefix: '10027',
    defaultInsurance: 'aetna',
    defaultPlan: 'aetna-student-health',
    studentCount: '36,000',
  },
  {
    id: 'njit',
    name: 'New Jersey Institute of Technology',
    city: 'Newark',
    state: 'NJ',
    zipPrefix: '07102',
    defaultInsurance: 'uhc',
    defaultPlan: 'uhc-student-resources',
    studentCount: '12,000',
  },
  {
    id: 'rutgers',
    name: 'Rutgers University',
    city: 'New Brunswick',
    state: 'NJ',
    zipPrefix: '08901',
    defaultInsurance: 'aetna',
    defaultPlan: 'aetna-student-health',
    studentCount: '50,000',
  },
  {
    id: 'cuny',
    name: 'CUNY (City University of New York)',
    city: 'New York',
    state: 'NY',
    zipPrefix: '10021',
    defaultInsurance: 'uhc',
    defaultPlan: 'uhc-student-resources',
    studentCount: '25,000',
  },
  {
    id: 'fordham',
    name: 'Fordham University',
    city: 'New York',
    state: 'NY',
    zipPrefix: '10458',
    defaultInsurance: 'aetna',
    defaultPlan: 'aetna-student-health',
    studentCount: '16,000',
  },
  {
    id: 'other',
    name: 'Other / Not listed',
    city: '',
    state: '',
    zipPrefix: '',
    defaultInsurance: null,
    defaultPlan: null,
    studentCount: '',
  },
];

// Insurance carriers
export const insuranceCarriers = [
  { id: 'aetna', name: 'Aetna', logoText: 'A', color: '#7D3CA3' },
  { id: 'uhc', name: 'UnitedHealthcare', logoText: 'U', color: '#002677' },
  { id: 'bluecross', name: 'Blue Cross Blue Shield', logoText: 'BC', color: '#0057A8' },
  { id: 'cigna', name: 'Cigna', logoText: 'C', color: '#00A9E0' },
  { id: 'kaiser', name: 'Kaiser Permanente', logoText: 'K', color: '#006BA6' },
  { id: 'medicaid', name: 'Medicaid', logoText: 'M', color: '#2E7D32' },
  { id: 'other', name: 'Other / Not listed', logoText: '?', color: '#777' },
];

// Specific plans under each carrier — with benefit details
export const insurancePlans = {
  aetna: [
    {
      id: 'aetna-student-health',
      name: 'Aetna Student Health',
      network: 'Aetna Open Choice PPO',
      type: 'PPO',
      copayPrimaryCare: 30,
      copayUrgentCare: 30,
      copayEr: 150,
      copaySpecialist: 50,
      deductible: 500,
      coinsurance: 20,
      outOfPocketMax: 6000,
      acceptedByNetworks: ['Aetna', 'Aetna Student Health'],
    },
    {
      id: 'aetna-ppo',
      name: 'Aetna Open Access PPO',
      network: 'Aetna PPO',
      type: 'PPO',
      copayPrimaryCare: 25,
      copayUrgentCare: 50,
      copayEr: 250,
      copaySpecialist: 60,
      deductible: 1500,
      coinsurance: 20,
      outOfPocketMax: 7500,
      acceptedByNetworks: ['Aetna'],
    },
    {
      id: 'aetna-hmo',
      name: 'Aetna HMO',
      network: 'Aetna HMO',
      type: 'HMO',
      copayPrimaryCare: 20,
      copayUrgentCare: 40,
      copayEr: 200,
      copaySpecialist: 45,
      deductible: 1000,
      coinsurance: 15,
      outOfPocketMax: 6500,
      acceptedByNetworks: ['Aetna'],
    },
  ],
  uhc: [
    {
      id: 'uhc-student-resources',
      name: 'UHC StudentResources',
      network: 'UnitedHealthcare Choice Plus',
      type: 'PPO',
      copayPrimaryCare: 25,
      copayUrgentCare: 50,
      copayEr: 200,
      copaySpecialist: 45,
      deductible: 750,
      coinsurance: 20,
      outOfPocketMax: 6350,
      acceptedByNetworks: ['United Health', 'UnitedHealthcare'],
    },
    {
      id: 'uhc-choice-plus',
      name: 'UHC Choice Plus PPO',
      network: 'UnitedHealthcare Choice Plus',
      type: 'PPO',
      copayPrimaryCare: 30,
      copayUrgentCare: 60,
      copayEr: 300,
      copaySpecialist: 70,
      deductible: 2000,
      coinsurance: 25,
      outOfPocketMax: 8000,
      acceptedByNetworks: ['United Health', 'UnitedHealthcare'],
    },
  ],
  bluecross: [
    {
      id: 'bcbs-ppo',
      name: 'Blue Cross Blue Shield PPO',
      network: 'BCBS PPO Network',
      type: 'PPO',
      copayPrimaryCare: 25,
      copayUrgentCare: 45,
      copayEr: 250,
      copaySpecialist: 55,
      deductible: 1500,
      coinsurance: 20,
      outOfPocketMax: 7000,
      acceptedByNetworks: ['Blue Cross'],
    },
  ],
  cigna: [
    {
      id: 'cigna-open-access',
      name: 'Cigna Open Access Plus',
      network: 'Cigna OAP',
      type: 'PPO',
      copayPrimaryCare: 30,
      copayUrgentCare: 50,
      copayEr: 250,
      copaySpecialist: 60,
      deductible: 1250,
      coinsurance: 20,
      outOfPocketMax: 7350,
      acceptedByNetworks: ['Cigna'],
    },
  ],
  kaiser: [
    {
      id: 'kaiser-hmo',
      name: 'Kaiser Permanente HMO',
      network: 'Kaiser',
      type: 'HMO',
      copayPrimaryCare: 20,
      copayUrgentCare: 20,
      copayEr: 200,
      copaySpecialist: 40,
      deductible: 500,
      coinsurance: 10,
      outOfPocketMax: 6500,
      acceptedByNetworks: ['Kaiser'],
    },
  ],
  medicaid: [
    {
      id: 'medicaid-standard',
      name: 'Medicaid',
      network: 'Medicaid',
      type: 'Government',
      copayPrimaryCare: 0,
      copayUrgentCare: 0,
      copayEr: 5,
      copaySpecialist: 0,
      deductible: 0,
      coinsurance: 0,
      outOfPocketMax: 0,
      acceptedByNetworks: ['Medicaid'],
    },
  ],
  other: [
    {
      id: 'other-plan',
      name: 'Other / Manual entry',
      network: 'Unknown',
      type: 'Unknown',
      copayPrimaryCare: 30,
      copayUrgentCare: 50,
      copayEr: 250,
      copaySpecialist: 60,
      deductible: 1500,
      coinsurance: 20,
      outOfPocketMax: 7500,
      acceptedByNetworks: [],
    },
  ],
};

// Helper: get plan by ID across all carriers
export function getPlanById(planId) {
  for (const carrier of Object.keys(insurancePlans)) {
    const found = insurancePlans[carrier].find(p => p.id === planId);
    if (found) return { ...found, carrierId: carrier };
  }
  return null;
}

export function getCarrierById(carrierId) {
  return insuranceCarriers.find(c => c.id === carrierId);
}

export function getUniversityById(uniId) {
  return universities.find(u => u.id === uniId);
}

export function getVisaById(visaId) {
  return visaTypes.find(v => v.id === visaId);
}

// Determine if a hospital is in-network for the user's plan
export function isHospitalInNetwork(hospital, plan) {
  if (!plan || !hospital) return false;
  if (!plan.acceptedByNetworks || plan.acceptedByNetworks.length === 0) return false;
  return hospital.insurance.some(ins =>
    plan.acceptedByNetworks.some(
      accepted => accepted.toLowerCase() === ins.toLowerCase()
    )
  );
}
