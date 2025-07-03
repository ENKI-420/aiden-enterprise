// IRIS MCP SDK - Core Module
// Base functionality for all geospatial modules

import { GeospatialCoordinate, IRISGeospatialEvent, SecurityLabel } from './types';

export class IRISCoreModule {
    protected events: IRISGeospatialEvent[] = [];
    protected listeners: Map<string, Function[]> = new Map();

    // Event handling
    emit(event: IRISGeospatialEvent) {
        this.events.push(event);
        const listeners = this.listeners.get(event.type) || [];
        listeners.forEach(listener => listener(event));
    }

    on(eventType: string, listener: Function) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        this.listeners.get(eventType)?.push(listener);
    }

    off(eventType: string, listener: Function) {
        const listeners = this.listeners.get(eventType) || [];
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    // Security utilities
    static validateSecurityLabel(label: SecurityLabel): boolean {
        const validClassifications = ['UNCLASSIFIED', 'CUI', 'SECRET', 'TOP SECRET'];
        const validReleasability = ['FOUO', 'LIMDIS', 'COALITION', 'NOFORN'];

        if (!validClassifications.includes(label.classification)) {
            return false;
        }

        if (label.releasability && !validReleasability.includes(label.releasability)) {
            return false;
        }

        return true;
    }

    static applySecurityLabel(data: any, label: SecurityLabel): any {
        if (!this.validateSecurityLabel(label)) {
            throw new Error('Invalid security label');
        }

        return {
            ...data,
            securityLabel: label,
            timestamp: new Date().toISOString()
        };
    }

    // Coordinate utilities
    static validateCoordinate(coord: GeospatialCoordinate): boolean {
        return (
            coord.latitude >= -90 && coord.latitude <= 90 &&
            coord.longitude >= -180 && coord.longitude <= 180 &&
            (coord.altitude === undefined || coord.altitude >= -11000)
        );
    }

    static convertCoordinates(
        coord: GeospatialCoordinate,
        targetSystem: 'WGS84' | 'MGRS' | 'UTM'
    ): GeospatialCoordinate {
        // Basic coordinate conversion - in production, use proper projection library
        if (coord.coordinateSystem === targetSystem) {
            return coord;
        }

        // Simplified conversion for demo - actual implementation would use proj4js
        return {
            ...coord,
            coordinateSystem: targetSystem,
            // Note: This is a placeholder - real coordinate transformation needed
            latitude: coord.latitude,
            longitude: coord.longitude
        };
    }

    // Utility functions
    static generateId(): string {
        return `iris-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    static formatTimestamp(date?: Date): string {
        return (date || new Date()).toISOString();
    }

    static calculateDistance(
        coord1: GeospatialCoordinate,
        coord2: GeospatialCoordinate
    ): number {
        // Haversine formula for great-circle distance
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(coord2.latitude - coord1.latitude);
        const dLon = this.toRadians(coord2.longitude - coord1.longitude);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(coord1.latitude)) *
            Math.cos(this.toRadians(coord2.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    static toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    static toDegrees(radians: number): number {
        return radians * (180 / Math.PI);
    }

    // Logging with security classification
    protected log(message: string, classification: 'UNCLASSIFIED' | 'CUI' | 'SECRET' = 'UNCLASSIFIED') {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            classification,
            message,
            module: this.constructor.name
        };

        // In production, this would integrate with DoD logging systems
        console.log(`[${classification}] ${timestamp} - ${this.constructor.name}: ${message}`);

        // Emit logging event
        this.emit({
            id: IRISCoreModule.generateId(),
            type: 'analysis-complete',
            timestamp,
            source: this.constructor.name,
            data: logEntry,
            classification
        });
    }

    // Health check
    getStatus() {
        return {
            module: this.constructor.name,
            status: 'active',
            timestamp: new Date().toISOString(),
            events: this.events.length,
            listeners: this.listeners.size
        };
    }
}

// Export utility functions
export const IRISUtils = {
    generateId: IRISCoreModule.generateId,
    formatTimestamp: IRISCoreModule.formatTimestamp,
    calculateDistance: IRISCoreModule.calculateDistance,
    validateCoordinate: IRISCoreModule.validateCoordinate,
    convertCoordinates: IRISCoreModule.convertCoordinates,
    validateSecurityLabel: IRISCoreModule.validateSecurityLabel,
    applySecurityLabel: IRISCoreModule.applySecurityLabel
};

// Constants
export const IRIS_CONSTANTS = {
    SUPPORTED_COORDINATE_SYSTEMS: ['WGS84', 'MGRS', 'UTM'],
    SUPPORTED_CLASSIFICATIONS: ['UNCLASSIFIED', 'CUI', 'SECRET', 'TOP SECRET'],
    SUPPORTED_RELEASABILITY: ['FOUO', 'LIMDIS', 'COALITION', 'NOFORN'],
    DEFAULT_PROJECTION: 'WGS84',
    MAX_ROUTE_POINTS: 1000,
    MAX_SYMBOLS_PER_LAYER: 10000,
    CACHE_TIMEOUT: 300000, // 5 minutes
    API_VERSION: '2.0.0-agc'
}; 