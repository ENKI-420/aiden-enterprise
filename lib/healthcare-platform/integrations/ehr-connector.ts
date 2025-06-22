/**
 * EHR Integration Hub
 * Connects to Epic, Cerner, and other EHR systems via FHIR
 */

import { EventEmitter } from 'events';
import {
    DataClassification,
    EHRIntegration,
    FHIRResource
} from '../types';

export class EHRConnector extends EventEmitter {
  private integrations: Map<string, EHRIntegration> = new Map();
  private connectionPool: Map<string, any> = new Map();
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 300000; // 5 minutes

  constructor() {
    super();
    this.initializeDefaultIntegrations();
  }

  private initializeDefaultIntegrations() {
    // Epic Integration
    const epicIntegration: EHRIntegration = {
      type: 'epic',
      version: '2023.1',
      endpoint: 'https://epic-api.hospital.com/fhir/r4',
      authentication: {
        type: 'oauth2',
        credentials: {
          clientId: process.env.EPIC_CLIENT_ID || 'demo-client',
          clientSecret: process.env.EPIC_CLIENT_SECRET || 'demo-secret',
          authUrl: 'https://epic-api.hospital.com/oauth2/authorize',
          tokenUrl: 'https://epic-api.hospital.com/oauth2/token'
        }
      },
      capabilities: [
        'patient-search',
        'patient-read',
        'observation-read',
        'medication-read',
        'allergy-read',
        'appointment-read',
        'document-read'
      ],
      dataMapping: {
        'patient': 'Patient',
        'labs': 'Observation',
        'medications': 'MedicationRequest',
        'allergies': 'AllergyIntolerance',
        'appointments': 'Appointment',
        'documents': 'DocumentReference'
      }
    };

    // Cerner Integration
    const cernerIntegration: EHRIntegration = {
      type: 'cerner',
      version: '4.0.0',
      endpoint: 'https://fhir-myrecord.cerner.com/r4',
      authentication: {
        type: 'oauth2',
        credentials: {
          clientId: process.env.CERNER_CLIENT_ID || 'demo-client',
          clientSecret: process.env.CERNER_CLIENT_SECRET || 'demo-secret',
          authUrl: 'https://authorization.cerner.com/tenants/tenant_id/protocols/oauth2/profiles/smart-v1/personas/patient/authorize',
          tokenUrl: 'https://authorization.cerner.com/tenants/tenant_id/protocols/oauth2/profiles/smart-v1/token'
        }
      },
      capabilities: [
        'patient-search',
        'patient-read',
        'observation-read',
        'condition-read',
        'procedure-read',
        'immunization-read'
      ],
      dataMapping: {
        'patient': 'Patient',
        'labs': 'Observation',
        'conditions': 'Condition',
        'procedures': 'Procedure',
        'immunizations': 'Immunization'
      }
    };

    this.registerIntegration('epic-main', epicIntegration);
    this.registerIntegration('cerner-main', cernerIntegration);
  }

  // Register an EHR integration
  public registerIntegration(id: string, integration: EHRIntegration): void {
    this.integrations.set(id, integration);
    this.emit('integration:registered', { id, type: integration.type });
  }

  // Connect to EHR system
  public async connect(integrationId: string): Promise<void> {
    const integration = this.integrations.get(integrationId);
    if (!integration) {
      throw new Error(`Integration ${integrationId} not found`);
    }

    try {
      // Authenticate based on type
      const token = await this.authenticate(integration);

      // Store connection
      this.connectionPool.set(integrationId, {
        integration,
        token,
        connectedAt: new Date()
      });

      this.emit('integration:connected', { integrationId, type: integration.type });
    } catch (error) {
      this.emit('integration:error', { integrationId, error });
      throw error;
    }
  }

  // Authenticate with EHR system
  private async authenticate(integration: EHRIntegration): Promise<string> {
    // Mock authentication - in production, implement actual OAuth2 flow
    switch (integration.authentication.type) {
      case 'oauth2':
        return `mock-token-${Date.now()}`;

      case 'api-key':
        return integration.authentication.credentials.apiKey;

      case 'saml':
        return `saml-assertion-${Date.now()}`;

      default:
        throw new Error(`Unsupported authentication type: ${integration.authentication.type}`);
    }
  }

  // Search for patients
  public async searchPatients(
    integrationId: string,
    criteria: {
      name?: string;
      mrn?: string;
      birthDate?: string;
      phone?: string;
    }
  ): Promise<FHIRResource[]> {
    const cacheKey = `patients-${JSON.stringify(criteria)}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const connection = this.connectionPool.get(integrationId);
    if (!connection) {
      throw new Error(`Not connected to ${integrationId}`);
    }

    // Mock patient search - in production, make actual FHIR API call
    const patients: FHIRResource[] = [
      {
        resourceType: 'Patient',
        id: '12345',
        meta: {
          versionId: '1',
          lastUpdated: new Date().toISOString()
        },
        identifier: [{
          system: 'http://hospital.com/mrn',
          value: criteria.mrn || 'MRN-001'
        }],
        name: [{
          use: 'official',
          family: 'Smith',
          given: ['John', 'Q']
        }],
        gender: 'male',
        birthDate: '1970-01-01',
        address: [{
          use: 'home',
          line: ['123 Main St'],
          city: 'Louisville',
          state: 'KY',
          postalCode: '40202'
        }],
        telecom: [{
          system: 'phone',
          value: '555-1234',
          use: 'home'
        }]
      }
    ];

    this.setCache(cacheKey, patients);
    this.emit('data:retrieved', {
      integrationId,
      resourceType: 'Patient',
      count: patients.length
    });

    return patients;
  }

  // Get patient by ID
  public async getPatient(
    integrationId: string,
    patientId: string
  ): Promise<FHIRResource | null> {
    const patients = await this.searchPatients(integrationId, { mrn: patientId });
    return patients[0] || null;
  }

  // Get patient observations (labs)
  public async getObservations(
    integrationId: string,
    patientId: string,
    category?: string
  ): Promise<FHIRResource[]> {
    const cacheKey = `observations-${patientId}-${category}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // Mock observations - in production, make actual FHIR API call
    const observations: FHIRResource[] = [
      {
        resourceType: 'Observation',
        id: 'obs-001',
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: category || 'laboratory',
            display: 'Laboratory'
          }]
        }],
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '2160-0',
            display: 'Creatinine'
          }]
        },
        subject: {
          reference: `Patient/${patientId}`
        },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: {
          value: 1.2,
          unit: 'mg/dL',
          system: 'http://unitsofmeasure.org',
          code: 'mg/dL'
        },
        referenceRange: [{
          low: { value: 0.6, unit: 'mg/dL' },
          high: { value: 1.2, unit: 'mg/dL' }
        }]
      },
      {
        resourceType: 'Observation',
        id: 'obs-002',
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'vital-signs',
            display: 'Vital Signs'
          }]
        }],
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '8310-5',
            display: 'Body temperature'
          }]
        },
        subject: {
          reference: `Patient/${patientId}`
        },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: {
          value: 98.6,
          unit: 'degF',
          system: 'http://unitsofmeasure.org',
          code: '[degF]'
        }
      }
    ];

    this.setCache(cacheKey, observations);
    this.emit('data:retrieved', {
      integrationId,
      resourceType: 'Observation',
      count: observations.length
    });

    return observations;
  }

  // Get patient medications
  public async getMedications(
    integrationId: string,
    patientId: string
  ): Promise<FHIRResource[]> {
    const cacheKey = `medications-${patientId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // Mock medications - in production, make actual FHIR API call
    const medications: FHIRResource[] = [
      {
        resourceType: 'MedicationRequest',
        id: 'med-001',
        status: 'active',
        intent: 'order',
        medicationCodeableConcept: {
          coding: [{
            system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
            code: '860975',
            display: 'Pembrolizumab 100 MG Injection'
          }]
        },
        subject: {
          reference: `Patient/${patientId}`
        },
        authoredOn: new Date().toISOString(),
        requester: {
          display: 'Dr. Oncologist'
        },
        dosageInstruction: [{
          text: '200mg IV every 3 weeks',
          timing: {
            repeat: {
              frequency: 1,
              period: 3,
              periodUnit: 'wk'
            }
          },
          route: {
            coding: [{
              system: 'http://snomed.info/sct',
              code: '47625008',
              display: 'Intravenous route'
            }]
          }
        }]
      }
    ];

    this.setCache(cacheKey, medications);
    this.emit('data:retrieved', {
      integrationId,
      resourceType: 'MedicationRequest',
      count: medications.length
    });

    return medications;
  }

  // Get patient allergies
  public async getAllergies(
    integrationId: string,
    patientId: string
  ): Promise<FHIRResource[]> {
    const cacheKey = `allergies-${patientId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // Mock allergies - in production, make actual FHIR API call
    const allergies: FHIRResource[] = [
      {
        resourceType: 'AllergyIntolerance',
        id: 'allergy-001',
        clinicalStatus: {
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
            code: 'active',
            display: 'Active'
          }]
        },
        verificationStatus: {
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
            code: 'confirmed',
            display: 'Confirmed'
          }]
        },
        type: 'allergy',
        category: ['medication'],
        criticality: 'high',
        code: {
          coding: [{
            system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
            code: '1191',
            display: 'Aspirin'
          }]
        },
        patient: {
          reference: `Patient/${patientId}`
        },
        reaction: [{
          manifestation: [{
            coding: [{
              system: 'http://snomed.info/sct',
              code: '39579001',
              display: 'Anaphylaxis'
            }]
          }],
          severity: 'severe'
        }]
      }
    ];

    this.setCache(cacheKey, allergies);
    this.emit('data:retrieved', {
      integrationId,
      resourceType: 'AllergyIntolerance',
      count: allergies.length
    });

    return allergies;
  }

  // Get patient summary
  public async getPatientSummary(
    integrationId: string,
    patientId: string
  ): Promise<{
    patient: FHIRResource | null;
    recentLabs: FHIRResource[];
    activeMedications: FHIRResource[];
    allergies: FHIRResource[];
    classification: DataClassification;
  }> {
    // Fetch all data in parallel
    const [patient, observations, medications, allergies] = await Promise.all([
      this.getPatient(integrationId, patientId),
      this.getObservations(integrationId, patientId, 'laboratory'),
      this.getMedications(integrationId, patientId),
      this.getAllergies(integrationId, patientId)
    ]);

    // Sort labs by date
    const recentLabs = observations
      .sort((a, b) => {
        const dateA = new Date(a.effectiveDateTime || 0).getTime();
        const dateB = new Date(b.effectiveDateTime || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 10);

    return {
      patient,
      recentLabs,
      activeMedications: medications.filter(m => m.status === 'active'),
      allergies,
      classification: 'PHI' // Patient data is always PHI
    };
  }

  // Subscribe to real-time updates
  public subscribeToPatientUpdates(
    integrationId: string,
    patientId: string,
    callback: (update: any) => void
  ): () => void {
    // Mock subscription - in production, use WebSocket or SSE
    const interval = setInterval(() => {
      const update = {
        type: 'observation',
        resource: {
          resourceType: 'Observation',
          id: `obs-${Date.now()}`,
          status: 'preliminary',
          code: {
            coding: [{
              system: 'http://loinc.org',
              code: '8867-4',
              display: 'Heart rate'
            }]
          },
          subject: {
            reference: `Patient/${patientId}`
          },
          effectiveDateTime: new Date().toISOString(),
          valueQuantity: {
            value: Math.floor(Math.random() * 40) + 60,
            unit: 'beats/minute'
          }
        }
      };

      callback(update);
      this.emit('realtime:update', { integrationId, patientId, update });
    }, 5000);

    // Return unsubscribe function
    return () => clearInterval(interval);
  }

  // Batch fetch multiple resources
  public async batchFetch(
    integrationId: string,
    requests: Array<{
      resourceType: string;
      id?: string;
      params?: Record<string, any>;
    }>
  ): Promise<FHIRResource[]> {
    const results: FHIRResource[] = [];

    // Process requests in parallel
    const promises = requests.map(async (request) => {
      switch (request.resourceType) {
        case 'Patient':
          return request.id
            ? this.getPatient(integrationId, request.id)
            : this.searchPatients(integrationId, request.params || {});

        case 'Observation':
          return this.getObservations(
            integrationId,
            request.params?.patient || '',
            request.params?.category
          );

        case 'MedicationRequest':
          return this.getMedications(integrationId, request.params?.patient || '');

        case 'AllergyIntolerance':
          return this.getAllergies(integrationId, request.params?.patient || '');

        default:
          return null;
      }
    });

    const responses = await Promise.all(promises);

    // Flatten results
    responses.forEach(response => {
      if (Array.isArray(response)) {
        results.push(...response);
      } else if (response) {
        results.push(response);
      }
    });

    return results;
  }

  // Cache management
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Clear cache
  public clearCache(): void {
    this.cache.clear();
    this.emit('cache:cleared');
  }

  // Get integration status
  public getIntegrationStatus(integrationId: string): {
    connected: boolean;
    type?: string;
    connectedAt?: Date;
  } {
    const connection = this.connectionPool.get(integrationId);
    return {
      connected: !!connection,
      type: connection?.integration.type,
      connectedAt: connection?.connectedAt
    };
  }

  // Disconnect from EHR
  public disconnect(integrationId: string): void {
    this.connectionPool.delete(integrationId);
    this.emit('integration:disconnected', { integrationId });
  }
}