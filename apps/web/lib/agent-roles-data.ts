export interface AgentRole {
  role: string;
  compliance: string[];
}

export interface MCPAgentRoles {
  healthcare: AgentRole[];
  legal: AgentRole[];
  defense: AgentRole[];
}

export const agentRolesData: MCPAgentRoles = {
  "healthcare": [
    {
      "role": "Oncologist",
      "compliance": [
        "HIPAA",
        "CPT",
        "ICD-10"
      ]
    },
    {
      "role": "Pathologist",
      "compliance": [
        "HIPAA",
        "CLIA"
      ]
    },
    {
      "role": "Nurse Case Manager",
      "compliance": [
        "HIPAA",
        "CMS"
      ]
    },
    {
      "role": "EHR Interop Agent",
      "compliance": [
        "HIPAA",
        "FHIR",
        "HITECH"
      ]
    },
    {
      "role": "Clinical Research Coordinator",
      "compliance": [
        "IRB",
        "HIPAA"
      ]
    },
    {
      "role": "Ethics Review Board Agent",
      "compliance": [
        "IRB",
        "OHRP"
      ]
    },
    {
      "role": "Prior Authorization Agent",
      "compliance": [
        "HIPAA",
        "CMS"
      ]
    },
    {
      "role": "Medical Auditor",
      "compliance": [
        "HIPAA",
        "OIG"
      ]
    },
    {
      "role": "Triage Telemetry Agent",
      "compliance": [
        "HIPAA",
        "MDR"
      ]
    },
    {
      "role": "Clinical Genomics Agent",
      "compliance": [
        "HIPAA",
        "GINA"
      ]
    },
    {
      "role": "Hospital CISO Agent",
      "compliance": [
        "HIPAA",
        "SOC2",
        "NIST"
      ]
    }
  ],
  "legal": [
    {
      "role": "Litigator AI Agent",
      "compliance": [
        "ABA",
        "FRCP"
      ]
    },
    {
      "role": "Paralegal Assistant",
      "compliance": [
        "ABA"
      ]
    },
    {
      "role": "eDiscovery Filter",
      "compliance": [
        "FRCP",
        "ESI"
      ]
    },
    {
      "role": "Chain-of-Custody Validator",
      "compliance": [
        "DOJ",
        "ISO 27001"
      ]
    },
    {
      "role": "Regulatory Compliance Agent",
      "compliance": [
        "HIPAA",
        "GDPR",
        "CCPA"
      ]
    },
    {
      "role": "Contract Analyst",
      "compliance": [
        "DFARS",
        "FAR"
      ]
    },
    {
      "role": "IP Protection Agent",
      "compliance": [
        "USPTO",
        "NDA"
      ]
    },
    {
      "role": "Privacy Rights Agent",
      "compliance": [
        "GDPR",
        "CCPA"
      ]
    },
    {
      "role": "Litigation Support Bot",
      "compliance": [
        "FRCP"
      ]
    },
    {
      "role": "Whistleblower Case Validator",
      "compliance": [
        "OSHA",
        "FCA",
        "HIPAA"
      ]
    }
  ],
  "defense": [
    {
      "role": "Contracting Officer (KO)",
      "compliance": [
        "FAR",
        "DFARS"
      ]
    },
    {
      "role": "Acquisition AI Agent",
      "compliance": [
        "FAR",
        "CMMC"
      ]
    },
    {
      "role": "JAG Officer Agent",
      "compliance": [
        "UCMJ",
        "DoDI"
      ]
    },
    {
      "role": "Intel Fusion Analyst",
      "compliance": [
        "DoDI",
        "TS/SCI"
      ]
    },
    {
      "role": "Ops Planner AI",
      "compliance": [
        "DoDI",
        "NIPR/SIPR"
      ]
    },
    {
      "role": "Telehealth Battlefield Medic",
      "compliance": [
        "HIPAA",
        "MDR"
      ]
    },
    {
      "role": "Cyber Defense Watcher",
      "compliance": [
        "NIST 800-171",
        "CMMC"
      ]
    },
    {
      "role": "Logistics Officer Assistant",
      "compliance": [
        "MILSTRIP",
        "FAR"
      ]
    },
    {
      "role": "Weapons Systems Validator",
      "compliance": [
        "MIL-STD-882E"
      ]
    },
    {
      "role": "Classified Info Sentinel",
      "compliance": [
        "DoDI",
        "SCG"
      ]
    },
    {
      "role": "Training Compliance Agent",
      "compliance": [
        "DoDI 8140",
        "DoD IAM"
      ]
    }
  ]
};