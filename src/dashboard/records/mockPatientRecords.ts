export interface PatientRecord {
  id: string;
  type: string;
  issuedBy: string;
  issuedDate: string; // ISO date
  summary: string;
  details: string;
  receivedAt: string; // ISO datetime
}

export const mockPatientRecords: PatientRecord[] = [
  {
    id: "rec1",
    type: "Blood Test Result",
    issuedBy: "Synlab Diagnostics, Lagos",
    issuedDate: "2026-07-14",
    summary: "Full blood count and lipid profile — all markers within normal range.",
    details:
      "Full Blood Count (FBC): Hemoglobin 14.2 g/dL, WBC 6.1 x10^9/L, Platelets 250 x10^9/L — all within normal limits. Lipid Profile: Total Cholesterol 168 mg/dL, LDL 92 mg/dL, HDL 54 mg/dL, Triglycerides 110 mg/dL. Fasting Blood Glucose: 88 mg/dL. No abnormalities detected. Reviewed by Dr. Chidinma Okoye, MBBS.",
    receivedAt: "2026-07-14T11:32:00Z",
  },
  {
    id: "rec2",
    type: "Vaccination History",
    issuedBy: "Gwarinpa Primary Health Centre, Abuja",
    issuedDate: "2026-05-02",
    summary: "Updated immunization record including yellow fever booster.",
    details:
      "Yellow Fever (booster) administered 2026-05-02, batch YF-2291. Hepatitis B (3rd dose) administered 2026-05-02, batch HB-4410. Tetanus Toxoid administered 2026-05-02, batch TT-1187. No adverse reactions observed post-administration. Next recommended review: routine annual check. Recorded by Nurse Amaka Eze.",
    receivedAt: "2026-05-02T09:05:00Z",
  },
];
