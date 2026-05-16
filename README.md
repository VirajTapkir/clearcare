# ClearCare

**Know what you'll pay before you go.**

ClearCare is a healthcare cost-transparency web app built for international students (F-1, J-1, and other non-immigrant visa holders) in the United States. It checks whether a hospital accepts your specific insurance plan, estimates your real out-of-pocket cost *before* you walk in, and tracks your entire care journey through to the final bill — so a routine visit never turns into a surprise four-figure bill.

🔗 **Live demo:** [clearcare.vercel.app](https://clearcare.vercel.app) *(replace with your actual Vercel URL)*

---

## The Problem

An international student arrives in the US with a mandatory, school-issued health insurance plan they don't fully understand. When they need care, they face three compounding problems:

- **No price visibility.** The same procedure can cost 3–8x more at one facility than another, with no way to know beforehand.
- **Opaque coverage.** Plan documents are dozens of pages of legalese. "Is this covered? What's my copay? Is this hospital in-network?" takes hours to answer.
- **Surprise bills.** They pay what the front desk asks, then receive an explanation-of-benefits weeks later showing they were overcharged or billed out-of-network.

The result: students either avoid care entirely or overpay by hundreds to thousands of dollars on routine visits — a tax on simply being new to the country.

## What ClearCare Does

ClearCare turns insurance from a black box into a transparent, step-by-step tool:

1. **Onboarding** — Capture the student's ZIP code, visa status, university, insurance carrier, and plan.
2. **Symptom triage** — The student selects symptoms; the app suggests a likely condition (preliminary screening, *not* a diagnosis) with severity and urgency.
3. **Diagnosis result** — Shows the most likely condition with an ICD-10 code, typical cost breakdown, and other possible matches.
4. **Hospital ranking** — Lists nearby hospitals sorted in-network first, each with a personalized estimated total cost *and* out-of-pocket cost based on the student's actual plan — not a generic average.
5. **Side-by-side comparison** — Compare up to 3 hospitals across cost, wait times, quality/safety, services, and languages spoken.
6. **Treatment timeline** — An Amazon-style order tracker for the care journey: Hospital Selected → Appointment Booked → Pre-Visit Check-in → Consultation → Tests & Treatment → Prescription → Claim Filed & Audited → Follow-up. Each stage shows estimated timing and cost.

The throughline: the student always knows what's next and what it costs, and the final bill is checked against the estimate.

## Key Features

- **Insurance-first** — Every cost shown is specific to the user's plan, not a national average. In-network status is checked before anything else.
- **Triage, not diagnosis** — Helps the user judge urgency and pick the right care setting; clearly framed as preliminary, not a substitute for a clinician.
- **Real cost ranges** — Estimated total, estimated out-of-pocket, and per-visit copays surfaced on every hospital.
- **Care-journey timeline** — A familiar package-tracking metaphor applied to a process that is normally a complete black box.
- **No-surprise framing** — The final timeline stage explicitly covers claim auditing and the right to appeal overcharges.

## Tech Stack

- **React 19** — UI, component-driven architecture
- **Vite 8** — build tooling and dev server
- **Vanilla CSS** — custom design system in `App.css` and `TreatmentTimeline.css` (no UI framework)
- **Static data layer** — curated mock dataset (`src/data/`) for symptoms, diagnoses, hospitals, carriers, and plan logic
- **Vercel** — hosting and continuous deployment from `main`

There is no backend; all logic runs client-side against the static data layer, which keeps the app fast, dependency-light, and free to host. This is a deliberate MVP choice — the architecture is structured so the static data layer can later be swapped for live pricing APIs (e.g. CMS Hospital Price Transparency, Turquoise Health) without changing the UI.

## Project Structure

```
clearcare/
├── public/                  # favicon, icons
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── LandingPage.jsx
│   │   ├── OnboardingFlow.jsx
│   │   ├── SymptomChecker.jsx
│   │   ├── DiagnosisResult.jsx
│   │   ├── HospitalList.jsx
│   │   ├── HospitalComparison.jsx
│   │   └── TreatmentTimeline.jsx
│   ├── data/
│   │   ├── medicalData.js    # symptoms, diagnoses, hospitals, cost logic
│   │   └── userProfile.js    # carriers, plans, in-network logic
│   ├── App.jsx               # step state machine + routing
│   ├── App.css               # global design system
│   ├── TreatmentTimeline.css # timeline-specific styles
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Running Locally

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Clone
git clone https://github.com/VirajTapkir/clearcare.git
cd clearcare

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

**Other commands:**

```bash
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

## Deployment

The app auto-deploys to Vercel on every push to `main`. Vercel detects the Vite framework automatically; default settings work (build command `npm run build`, output directory `dist`).

## Disclaimer

ClearCare is an informational and educational tool built for a hackathon. It does **not** provide medical diagnoses and is **not** a substitute for professional medical advice. Cost estimates use representative sample data and may not reflect actual prices or coverage. Always confirm coverage with your insurer and consult a licensed clinician for medical concerns.

## Team

Built at QuackHacks 2026.

## License

MIT
