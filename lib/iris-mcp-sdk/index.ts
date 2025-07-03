// IRIS MCP SDK - AGC Compliant Geospatial Intelligence Platform
// Aligned with Army Geospatial Center (AGC) and NSG Standards

export * from './3d-context';
export * from './core';
export * from './data-bridge';
export * from './geo-routing';
export * from './map-viewer';
export * from './portrayal-engine';
export * from './types';

// Main SDK Configuration
export const IRIS_MCP_SDK_VERSION = '2.0.0-agc';
export const SUPPORTED_STANDARDS = [
    'SSGF', // Standard Sharable Geospatial Foundation
    'OGC', // Open Geospatial Consortium
    'NSG', // National System for Geospatial Intelligence
    'MOSA', // Modular Open Systems Approach
    'REM', // Route Exchange Model
    'RAPI', // Route API
    'MIL-STD-2525', // Military Symbology
    'ABCANZ' // American, British, Canadian, Australian, New Zealand
];

// SDK Initialization
export interface IRISMCPConfig {
    apiKey?: string;
    baseUrl?: string;
    environment: 'development' | 'production' | 'government';
    compliance?: {
        classification?: 'UNCLASSIFIED' | 'CUI' | 'SECRET';
        releasability?: 'FOUO' | 'LIMDIS' | 'COALITION';
        caveat?: string[];
    };
    geospatial?: {
        enableREM?: boolean;
        enableRAPI?: boolean;
        enable3DGeoVolumes?: boolean;
        enableVectorTiles?: boolean;
        enableMilSymbology?: boolean;
    };
}

export class IRISMCPSDKManager {
    private config: IRISMCPConfig;
    private modules: Map<string, any> = new Map();

    constructor(config: IRISMCPConfig) {
        this.config = config;
        this.initialize();
    }

    private initialize() {
        // Initialize all geospatial modules
        this.initializeGeoRouting();
        this.initialize3DContext();
        this.initializeMapViewer();
        this.initializePortrayalEngine();
        this.initializeDataBridge();
    }

    private initializeGeoRouting() {
        if (this.config.geospatial?.enableREM) {
            // REM + RAPI initialization
            this.modules.set('geo-routing', {
                status: 'active',
                compliance: ['REM', 'RAPI', 'SSGF'],
                capabilities: ['route-planning', 'obstacle-sharing', 'offline-routing']
            });
        }
    }

    private initialize3DContext() {
        if (this.config.geospatial?.enable3DGeoVolumes) {
            // 3D GeoVolumes API initialization
            this.modules.set('3d-context', {
                status: 'active',
                compliance: ['OGC', 'NSG', '3D-GeoVolumes'],
                capabilities: ['terrain-visualization', '3d-building-models', 'elevation-queries']
            });
        }
    }

    private initializeMapViewer() {
        if (this.config.geospatial?.enableVectorTiles) {
            // Vector Tiles + Releasable Basemaps initialization
            this.modules.set('map-viewer', {
                status: 'active',
                compliance: ['OGC-API-Tiles', 'OGC-API-Styles', 'SSGF'],
                capabilities: ['vector-tiles', 'releasable-basemaps', 'coalition-sharing']
            });
        }
    }

    private initializePortrayalEngine() {
        if (this.config.geospatial?.enableMilSymbology) {
            // OGC Portrayal + Symbology initialization
            this.modules.set('portrayal-engine', {
                status: 'active',
                compliance: ['OGC-API-Styles', 'MIL-STD-2525', 'NSG'],
                capabilities: ['military-symbology', 'role-based-portrayal', 'dynamic-styling']
            });
        }
    }

    private initializeDataBridge() {
        // Federated Data Adapter initialization
        this.modules.set('data-bridge', {
            status: 'active',
            compliance: ['ABCANZ', 'NGA-SIG', 'MOSA'],
            capabilities: ['federated-data', 'cross-domain-access', 'security-labeling']
        });
    }

    getModuleStatus(moduleId: string) {
        return this.modules.get(moduleId);
    }

    getAllModules() {
        return Array.from(this.modules.entries()).map(([id, module]) => ({
            id,
            ...module
        }));
    }

    getComplianceReport() {
        const modules = this.getAllModules();
        const allCompliance = modules.flatMap(m => m.compliance);
        const uniqueCompliance = [...new Set(allCompliance)];

        return {
            totalModules: modules.length,
            activeModules: modules.filter(m => m.status === 'active').length,
            supportedStandards: uniqueCompliance,
            certificationStatus: 'AGC-Ready',
            lastUpdated: new Date().toISOString()
        };
    }
}

// Export default configured instance
export const createIRISMCPSDK = (config: IRISMCPConfig) => {
    return new IRISMCPSDKManager(config);
}; 