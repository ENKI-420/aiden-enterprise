import { NextRequest, NextResponse } from 'next/server';

// EPIC FHIR API Integration
// Baptist Health would provide actual EPIC credentials and endpoints
const EPIC_FHIR_BASE = process.env.EPIC_FHIR_URL || 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';
const EPIC_CLIENT_ID = process.env.EPIC_CLIENT_ID;
const EPIC_PRIVATE_KEY = process.env.EPIC_PRIVATE_KEY;

interface PatientData {
  id: string;
  mrn: string;
  name: string;
  birthDate: string;
  gender: string;
  diagnoses: Diagnosis[];
  medications: Medication[];
  labs: LabResult[];
  imaging: ImagingStudy[];
  encounters: Encounter[];
}

interface Diagnosis {
  code: string;
  display: string;
  date: string;
  status: string;
}

interface Medication {
  name: string;
  dosage: string;
  startDate: string;
  status: string;
}

interface LabResult {
  name: string;
  value: string;
  unit: string;
  date: string;
  flag: string;
}

interface ImagingStudy {
  modality: string;
  bodyPart: string;
  date: string;
  accession: string;
}

interface Encounter {
  type: string;
  date: string;
  provider: string;
  department: string;
}

// OAuth2 token exchange for EPIC
async function getEpicAccessToken(): Promise<string> {
  // In production, implement JWT assertion OAuth2 flow
  // For demo, return mock token
  if (!EPIC_CLIENT_ID || !EPIC_PRIVATE_KEY) {
    return 'demo-token';
  }

  // Real implementation would:
  // 1. Create JWT with private key
  // 2. Exchange for access token
  // 3. Cache token until expiry

  return 'demo-token';
}

// Fetch patient data from EPIC FHIR
async function fetchPatientFromEpic(patientId: string): Promise<PatientData> {
  const token = await getEpicAccessToken();

  // In production, make actual FHIR API calls
  // For demo, return realistic oncology patient data
  if (token === 'demo-token') {
    return generateDemoPatientData(patientId);
  }

  // Real FHIR queries would be:
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/fhir+json'
  };

  // Parallel fetch all resources
  const [patient, conditions, medications, observations, imaging] = await Promise.all([
    fetch(`${EPIC_FHIR_BASE}/Patient/${patientId}`, { headers }),
    fetch(`${EPIC_FHIR_BASE}/Condition?patient=${patientId}`, { headers }),
    fetch(`${EPIC_FHIR_BASE}/MedicationRequest?patient=${patientId}`, { headers }),
    fetch(`${EPIC_FHIR_BASE}/Observation?patient=${patientId}&category=laboratory`, { headers }),
    fetch(`${EPIC_FHIR_BASE}/ImagingStudy?patient=${patientId}`, { headers })
  ]);

  // Parse and transform FHIR resources to our format
  return transformFhirToPatientData(
    await patient.json(),
    await conditions.json(),
    await medications.json(),
    await observations.json(),
    await imaging.json()
  );
}

function generateDemoPatientData(patientId: string): PatientData {
  return {
    id: patientId,
    mrn: '1234567',
    name: 'John Smith',
    birthDate: '1955-03-15',
    gender: 'male',
    diagnoses: [
      {
        code: 'C78.00',
        display: 'Secondary malignant neoplasm of lung',
        date: '2023-08-15',
        status: 'active'
      },
      {
        code: 'C25.9',
        display: 'Malignant neoplasm of pancreas, unspecified',
        date: '2023-06-01',
        status: 'active'
      }
    ],
    medications: [
      {
        name: 'FOLFIRINOX (5-FU, Leucovorin, Irinotecan, Oxaliplatin)',
        dosage: 'Per protocol',
        startDate: '2023-09-01',
        status: 'active'
      },
      {
        name: 'Ondansetron',
        dosage: '8mg PO q8h PRN',
        startDate: '2023-09-01',
        status: 'active'
      },
      {
        name: 'Dexamethasone',
        dosage: '4mg PO daily',
        startDate: '2023-09-01',
        status: 'active'
      }
    ],
    labs: [
      {
        name: 'CA 19-9',
        value: '156',
        unit: 'U/mL',
        date: '2024-01-15',
        flag: 'H'
      },
      {
        name: 'CEA',
        value: '8.2',
        unit: 'ng/mL',
        date: '2024-01-15',
        flag: 'H'
      },
      {
        name: 'Absolute Neutrophil Count',
        value: '1.8',
        unit: 'K/uL',
        date: '2024-01-18',
        flag: 'N'
      },
      {
        name: 'Platelet Count',
        value: '95',
        unit: 'K/uL',
        date: '2024-01-18',
        flag: 'L'
      }
    ],
    imaging: [
      {
        modality: 'CT',
        bodyPart: 'Chest/Abdomen/Pelvis',
        date: '2024-01-10',
        accession: 'ACC123456'
      },
      {
        modality: 'PET',
        bodyPart: 'Whole Body',
        date: '2023-12-15',
        accession: 'ACC123455'
      }
    ],
    encounters: [
      {
        type: 'Office Visit',
        date: '2024-01-18',
        provider: 'Dr. Mounika Mandadi',
        department: 'Oncology'
      },
      {
        type: 'Chemotherapy',
        date: '2024-01-16',
        provider: 'Stacie Cheney, APRN',
        department: 'Infusion Center'
      }
    ]
  };
}

function transformFhirToPatientData(...resources: any[]): PatientData {
  // Transform FHIR Bundle responses to our simplified format
  // This would parse the complex FHIR structure
  throw new Error('Not implemented for demo');
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get('id');
    const mrn = searchParams.get('mrn');

    if (!patientId && !mrn) {
      return NextResponse.json(
        { error: 'Patient ID or MRN required' },
        { status: 400 }
      );
    }

    // Fetch patient data
    const patient = await fetchPatientFromEpic(patientId || mrn || 'demo');

    // Add computed fields useful for oncology
    const enhancedData = {
      ...patient,
      computed: {
        daysOnTreatment: calculateDaysOnTreatment(patient.medications),
        tumorMarkerTrend: analyzeTumorMarkerTrend(patient.labs),
        nextAppointment: findNextAppointment(patient.encounters),
        activeProtocol: identifyActiveProtocol(patient.medications)
      }
    };

    return NextResponse.json(enhancedData);

  } catch (error) {
    console.error('EPIC integration error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient data' },
      { status: 500 }
    );
  }
}

function calculateDaysOnTreatment(medications: Medication[]): number {
  const activeMed = medications.find(m => m.status === 'active' && m.name.includes('FOLFIRINOX'));
  if (!activeMed) return 0;

  const start = new Date(activeMed.startDate);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function analyzeTumorMarkerTrend(labs: LabResult[]): string {
  const ca199Values = labs
    .filter(l => l.name === 'CA 19-9')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (ca199Values.length < 2) return 'insufficient data';

  const latest = parseFloat(ca199Values[0].value);
  const previous = parseFloat(ca199Values[1].value);

  if (latest < previous * 0.8) return 'decreasing';
  if (latest > previous * 1.2) return 'increasing';
  return 'stable';
}

function findNextAppointment(encounters: Encounter[]): string | null {
  const future = encounters
    .filter(e => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return future[0]?.date || null;
}

function identifyActiveProtocol(medications: Medication[]): string {
  const chemoMeds = medications.filter(m =>
    m.status === 'active' &&
    (m.name.includes('FOLFIRINOX') || m.name.includes('Gemcitabine'))
  );

  return chemoMeds[0]?.name.split(' ')[0] || 'None';
}