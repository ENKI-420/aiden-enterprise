// IRIS MCP SDK - AGC Compliant Types and Interfaces

export interface GeospatialCoordinate {
    latitude: number;
    longitude: number;
    altitude?: number;
    coordinateSystem?: 'WGS84' | 'MGRS' | 'UTM';
}

export interface RoutePoint extends GeospatialCoordinate {
    id: string;
    name?: string;
    waypoint?: boolean;
    obstacleData?: ObstacleData;
}

export interface ObstacleData {
    type: 'terrain' | 'infrastructure' | 'threat' | 'weather' | 'traffic';
    severity: 'low' | 'medium' | 'high' | 'critical';
    classification: 'UNCLASSIFIED' | 'CUI' | 'SECRET';
    validTime?: {
        start: string;
        end: string;
    };
    geometry?: GeoJSONGeometry;
}

export interface GeoJSONGeometry {
    type: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';
    coordinates: number[] | number[][] | number[][][];
}

export interface RouteExchangeModel {
    id: string;
    name: string;
    classification: 'UNCLASSIFIED' | 'CUI' | 'SECRET';
    releasability: 'FOUO' | 'LIMDIS' | 'COALITION';
    routePoints: RoutePoint[];
    constraints?: RouteConstraints;
    metadata?: {
        createdBy: string;
        createdAt: string;
        purpose: string;
        units: string[];
    };
}

export interface RouteConstraints {
    vehicleType?: 'pedestrian' | 'wheeled' | 'tracked' | 'rotary' | 'fixed-wing';
    maxSpeed?: number;
    avoidObstacles?: string[];
    preferredTerrain?: string[];
    timeWindow?: {
        start: string;
        end: string;
    };
}

export interface MilitarySymbol {
    sidc: string; // Symbol Identification Code (MIL-STD-2525)
    position: GeospatialCoordinate;
    size?: number;
    rotation?: number;
    affiliation?: 'friendly' | 'hostile' | 'neutral' | 'unknown';
    status?: 'present' | 'planned' | 'anticipated';
    metadata?: {
        unitName?: string;
        unitType?: string;
        strength?: number;
        equipment?: string[];
    };
}

export interface VectorTileLayer {
    id: string;
    name: string;
    type: 'background' | 'terrain' | 'transportation' | 'buildings' | 'boundaries' | 'military';
    classification: 'UNCLASSIFIED' | 'CUI' | 'SECRET';
    releasability: 'FOUO' | 'LIMDIS' | 'COALITION';
    style?: MapStyle;
    visibility?: boolean;
    minZoom?: number;
    maxZoom?: number;
}

export interface MapStyle {
    fill?: {
        color: string;
        opacity: number;
    };
    stroke?: {
        color: string;
        width: number;
        opacity: number;
    };
    text?: {
        field: string;
        font: string;
        size: number;
        color: string;
    };
}

export interface TerrainModel {
    id: string;
    name: string;
    type: '3d-mesh' | 'elevation-grid' | 'point-cloud';
    bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
    };
    resolution?: number;
    classification: 'UNCLASSIFIED' | 'CUI' | 'SECRET';
    dataSource?: string;
    lastUpdated?: string;
}

export interface FederatedDataSource {
    id: string;
    name: string;
    type: 'ogc-api' | 'wms' | 'wmts' | 'wfs' | 'rest' | 'database';
    url: string;
    authentication?: {
        type: 'none' | 'basic' | 'oauth' | 'certificate' | 'token';
        credentials?: Record<string, string>;
    };
    compliance: string[];
    capabilities?: string[];
    metadata?: {
        organization: string;
        contact: string;
        description: string;
    };
}

export interface AGCComplianceReport {
    totalModules: number;
    activeModules: number;
    supportedStandards: string[];
    certificationStatus: 'AGC-Ready' | 'In-Progress' | 'Non-Compliant';
    lastUpdated: string;
    detailedReport?: {
        moduleId: string;
        compliance: string[];
        capabilities: string[];
        issues?: string[];
    }[];
}

export interface GeospatialAnalysis {
    id: string;
    type: 'viewshed' | 'line-of-sight' | 'elevation-profile' | 'slope-analysis' | 'watershed';
    parameters: Record<string, any>;
    results?: Record<string, any>;
    status: 'pending' | 'running' | 'completed' | 'failed';
    classification: 'UNCLASSIFIED' | 'CUI' | 'SECRET';
    metadata?: {
        requestedBy: string;
        requestedAt: string;
        completedAt?: string;
        notes?: string;
    };
}

export interface SecurityLabel {
    classification: 'UNCLASSIFIED' | 'CUI' | 'SECRET' | 'TOP SECRET';
    releasability?: 'FOUO' | 'LIMDIS' | 'COALITION' | 'NOFORN';
    caveats?: string[];
    declassificationDate?: string;
    derivedFrom?: string;
    classificationReason?: string;
}

export interface IRISGeospatialEvent {
    id: string;
    type: 'route-updated' | 'obstacle-detected' | 'symbol-added' | 'layer-changed' | 'analysis-complete';
    timestamp: string;
    source: string;
    data: Record<string, any>;
    classification: 'UNCLASSIFIED' | 'CUI' | 'SECRET';
    recipients?: string[];
} 