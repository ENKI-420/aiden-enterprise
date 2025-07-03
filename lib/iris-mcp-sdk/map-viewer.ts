// IRIS MCP SDK - Map Viewer Module
// Vector Tiles and Releasable Basemaps

import { IRISCoreModule, IRISUtils } from './core';
import {
    FederatedDataSource,
    GeospatialCoordinate,
    MapStyle,
    VectorTileLayer
} from './types';

export class IRISMapViewerModule extends IRISCoreModule {
    private layers: Map<string, VectorTileLayer> = new Map();
    private styles: Map<string, MapStyle> = new Map();
    private dataSources: Map<string, FederatedDataSource> = new Map();
    private ogcEndpoints: Map<string, string> = new Map();

    constructor() {
        super();
        this.initializeOGCEndpoints();
        this.initializeReleasableBasemaps();
        this.log('IRIS Map Viewer Module initialized with OGC API - Tiles compliance', 'UNCLASSIFIED');
    }

    private initializeOGCEndpoints() {
        // Standard OGC API endpoints
        this.ogcEndpoints.set('tiles', '/api/ogc/tiles');
        this.ogcEndpoints.set('styles', '/api/ogc/styles');
        this.ogcEndpoints.set('features', '/api/ogc/features');
        this.ogcEndpoints.set('maps', '/api/ogc/maps');
    }

    private initializeReleasableBasemaps() {
        // Initialize standard releasable basemaps
        const basemaps = [
            {
                id: 'world-releasable',
                name: 'World Releasable Basemap',
                classification: 'UNCLASSIFIED' as const,
                releasability: 'COALITION' as const,
                type: 'background' as const
            },
            {
                id: 'transportation-network',
                name: 'Transportation Network',
                classification: 'UNCLASSIFIED' as const,
                releasability: 'COALITION' as const,
                type: 'transportation' as const
            },
            {
                id: 'boundaries-admin',
                name: 'Administrative Boundaries',
                classification: 'UNCLASSIFIED' as const,
                releasability: 'COALITION' as const,
                type: 'boundaries' as const
            }
        ];

        basemaps.forEach(basemap => {
            const layer: VectorTileLayer = {
                ...basemap,
                visibility: true,
                minZoom: 0,
                maxZoom: 18,
                style: this.createDefaultStyle(basemap.type)
            };

            this.layers.set(basemap.id, layer);
        });
    }

    private createDefaultStyle(layerType: string): MapStyle {
        const defaultStyle: MapStyle = {
            fill: { color: '#f0f0f0', opacity: 1 },
            stroke: { color: '#cccccc', width: 1, opacity: 1 }
        };

        const styles: Record<string, MapStyle> = {
            background: defaultStyle,
            transportation: {
                stroke: { color: '#333333', width: 2, opacity: 0.8 },
                text: { field: 'name', font: 'Arial', size: 12, color: '#333333' }
            },
            boundaries: {
                stroke: { color: '#666666', width: 1, opacity: 0.6 },
                fill: { color: 'transparent', opacity: 0 }
            },
            buildings: {
                fill: { color: '#cccccc', opacity: 0.7 },
                stroke: { color: '#999999', width: 1, opacity: 0.8 }
            },
            terrain: {
                fill: { color: '#8fbc8f', opacity: 0.6 },
                stroke: { color: '#556b2f', width: 1, opacity: 0.4 }
            },
            military: {
                fill: { color: '#ff4444', opacity: 0.5 },
                stroke: { color: '#cc0000', width: 2, opacity: 1 }
            }
        };

        return styles[layerType] || defaultStyle;
    }

    // Vector Tile Management
    async addVectorTileLayer(
        name: string,
        type: VectorTileLayer['type'],
        classification: 'UNCLASSIFIED' | 'CUI' | 'SECRET' = 'UNCLASSIFIED',
        releasability: 'FOUO' | 'LIMDIS' | 'COALITION' = 'COALITION'
    ): Promise<string> {
        const layerId = IRISUtils.generateId();

        const layer: VectorTileLayer = {
            id: layerId,
            name,
            type,
            classification,
            releasability,
            visibility: true,
            minZoom: 0,
            maxZoom: 18,
            style: this.createDefaultStyle(type)
        };

        this.layers.set(layerId, layer);

        this.emit({
            id: IRISUtils.generateId(),
            type: 'layer-changed',
            timestamp: IRISUtils.formatTimestamp(),
            source: 'map-viewer',
            data: { layerId, action: 'added' },
            classification
        });

        this.log(`Vector tile layer added: ${layerId} (${name})`);

        return layerId;
    }

    async removeVectorTileLayer(layerId: string): Promise<void> {
        const layer = this.layers.get(layerId);
        if (!layer) {
            throw new Error('Layer not found');
        }

        this.layers.delete(layerId);

        this.emit({
            id: IRISUtils.generateId(),
            type: 'layer-changed',
            timestamp: IRISUtils.formatTimestamp(),
            source: 'map-viewer',
            data: { layerId, action: 'removed' },
            classification: layer.classification
        });

        this.log(`Vector tile layer removed: ${layerId}`);
    }

    // Layer Styling
    async updateLayerStyle(layerId: string, style: MapStyle): Promise<void> {
        const layer = this.layers.get(layerId);
        if (!layer) {
            throw new Error('Layer not found');
        }

        layer.style = style;
        this.layers.set(layerId, layer);

        this.emit({
            id: IRISUtils.generateId(),
            type: 'layer-changed',
            timestamp: IRISUtils.formatTimestamp(),
            source: 'map-viewer',
            data: { layerId, action: 'styled' },
            classification: layer.classification
        });

        this.log(`Layer style updated: ${layerId}`);
    }

    async createCustomStyle(
        name: string,
        fillColor: string,
        strokeColor: string,
        strokeWidth: number = 1,
        opacity: number = 1
    ): Promise<string> {
        const styleId = IRISUtils.generateId();

        const style: MapStyle = {
            fill: { color: fillColor, opacity },
            stroke: { color: strokeColor, width: strokeWidth, opacity }
        };

        this.styles.set(styleId, style);

        this.log(`Custom style created: ${styleId} (${name})`);

        return styleId;
    }

    // Layer Visibility and Filtering
    async toggleLayerVisibility(layerId: string): Promise<void> {
        const layer = this.layers.get(layerId);
        if (!layer) {
            throw new Error('Layer not found');
        }

        layer.visibility = !layer.visibility;
        this.layers.set(layerId, layer);

        this.emit({
            id: IRISUtils.generateId(),
            type: 'layer-changed',
            timestamp: IRISUtils.formatTimestamp(),
            source: 'map-viewer',
            data: { layerId, action: 'visibility-toggled', visible: layer.visibility },
            classification: layer.classification
        });

        this.log(`Layer visibility toggled: ${layerId} (${layer.visibility ? 'visible' : 'hidden'})`);
    }

    async filterLayersByClassification(
        classification: 'UNCLASSIFIED' | 'CUI' | 'SECRET'
    ): Promise<VectorTileLayer[]> {
        const filteredLayers = Array.from(this.layers.values())
            .filter(layer => layer.classification === classification);

        this.log(`Filtered ${filteredLayers.length} layers by classification: ${classification}`);

        return filteredLayers;
    }

    async filterLayersByReleasability(
        releasability: 'FOUO' | 'LIMDIS' | 'COALITION'
    ): Promise<VectorTileLayer[]> {
        const filteredLayers = Array.from(this.layers.values())
            .filter(layer => layer.releasability === releasability);

        this.log(`Filtered ${filteredLayers.length} layers by releasability: ${releasability}`);

        return filteredLayers;
    }

    // OGC API Integration
    async loadOGCTiles(
        endpoint: string,
        bounds: { north: number; south: number; east: number; west: number },
        zoomLevel: number = 10
    ): Promise<string[]> {
        const tileIds: string[] = [];

        // Calculate tile grid for bounds and zoom level
        const tiles = this.calculateTileGrid(bounds, zoomLevel);

        for (const tile of tiles) {
            const tileId = await this.loadSingleTile(endpoint, tile.x, tile.y, tile.z);
            tileIds.push(tileId);
        }

        this.log(`Loaded ${tileIds.length} OGC tiles from ${endpoint}`);

        return tileIds;
    }

    private calculateTileGrid(
        bounds: { north: number; south: number; east: number; west: number },
        zoom: number
    ): { x: number; y: number; z: number }[] {
        const tiles: { x: number; y: number; z: number }[] = [];

        // Simple tile calculation - in production, use proper tile math
        const tilesPerRow = Math.pow(2, zoom);
        const tileWidth = 360 / tilesPerRow;
        const tileHeight = 180 / tilesPerRow;

        const startX = Math.floor((bounds.west + 180) / tileWidth);
        const endX = Math.floor((bounds.east + 180) / tileWidth);
        const startY = Math.floor((90 - bounds.north) / tileHeight);
        const endY = Math.floor((90 - bounds.south) / tileHeight);

        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                tiles.push({ x, y, z: zoom });
            }
        }

        return tiles;
    }

    private async loadSingleTile(endpoint: string, x: number, y: number, z: number): Promise<string> {
        const tileId = `${x}-${y}-${z}`;

        // Simulate tile loading
        await new Promise(resolve => setTimeout(resolve, 50));

        this.log(`Loaded tile: ${tileId} from ${endpoint}`);

        return tileId;
    }

    // Data Source Management
    async addDataSource(
        name: string,
        type: FederatedDataSource['type'],
        url: string,
        compliance: string[] = ['OGC-API-Tiles']
    ): Promise<string> {
        const sourceId = IRISUtils.generateId();

        const dataSource: FederatedDataSource = {
            id: sourceId,
            name,
            type,
            url,
            compliance,
            capabilities: ['tiles', 'styles', 'features'],
            metadata: {
                organization: 'IRIS-MCP-SDK',
                contact: 'geospatial@iris-mcp.mil',
                description: `${type} data source for ${name}`
            }
        };

        this.dataSources.set(sourceId, dataSource);

        this.log(`Data source added: ${sourceId} (${name})`);

        return sourceId;
    }

    async testDataSourceConnection(sourceId: string): Promise<boolean> {
        const dataSource = this.dataSources.get(sourceId);
        if (!dataSource) {
            throw new Error('Data source not found');
        }

        // Simulate connection test
        await new Promise(resolve => setTimeout(resolve, 500));

        const isConnected = Math.random() > 0.1; // 90% success rate

        this.log(`Data source connection test: ${sourceId} - ${isConnected ? 'SUCCESS' : 'FAILED'}`);

        return isConnected;
    }

    // Map Projection and Coordinate Systems
    async projectCoordinates(
        coordinates: GeospatialCoordinate[],
        targetProjection: string = 'EPSG:3857'
    ): Promise<{ x: number; y: number }[]> {
        const projectedCoords: { x: number; y: number }[] = [];

        for (const coord of coordinates) {
            if (!IRISUtils.validateCoordinate(coord)) {
                throw new Error('Invalid coordinate provided');
            }

            // Simple Web Mercator projection simulation
            const x = coord.longitude * 20037508.34 / 180;
            const y = Math.log(Math.tan((90 + coord.latitude) * Math.PI / 360)) / (Math.PI / 180);
            const projectedY = y * 20037508.34 / 180;

            projectedCoords.push({ x, y: projectedY });
        }

        this.log(`Projected ${coordinates.length} coordinates to ${targetProjection}`);

        return projectedCoords;
    }

    // Export and Sharing
    async exportMap(
        bounds: { north: number; south: number; east: number; west: number },
        format: 'png' | 'jpeg' | 'pdf' | 'svg' = 'png',
        releasability: 'FOUO' | 'LIMDIS' | 'COALITION' = 'COALITION'
    ): Promise<string> {
        const exportId = IRISUtils.generateId();

        // Filter layers by releasability
        const releasableLayers = await this.filterLayersByReleasability(releasability);

        // Simulate map export
        await new Promise(resolve => setTimeout(resolve, 1000));

        const exportData = {
            id: exportId,
            format,
            bounds,
            layers: releasableLayers.map(l => l.id),
            releasability,
            exportedAt: IRISUtils.formatTimestamp()
        };

        this.log(`Map exported: ${exportId} (${format}, ${releasableLayers.length} layers)`);

        return exportId;
    }

    // Data Management
    getLayer(layerId: string): VectorTileLayer | null {
        return this.layers.get(layerId) || null;
    }

    getAllLayers(): VectorTileLayer[] {
        return Array.from(this.layers.values());
    }

    getVisibleLayers(): VectorTileLayer[] {
        return Array.from(this.layers.values()).filter(layer => layer.visibility);
    }

    getStyle(styleId: string): MapStyle | null {
        return this.styles.get(styleId) || null;
    }

    getDataSource(sourceId: string): FederatedDataSource | null {
        return this.dataSources.get(sourceId) || null;
    }

    getAllDataSources(): FederatedDataSource[] {
        return Array.from(this.dataSources.values());
    }

    // Compliance reporting
    getComplianceReport() {
        return {
            module: 'map-viewer',
            compliance: ['OGC-API-Tiles', 'OGC-API-Styles', 'SSGF'],
            capabilities: ['vector-tiles', 'releasable-basemaps', 'coalition-sharing'],
            layers: this.layers.size,
            styles: this.styles.size,
            dataSources: this.dataSources.size,
            ogcEndpoints: Array.from(this.ogcEndpoints.keys()),
            status: 'active',
            lastExport: IRISUtils.formatTimestamp()
        };
    }
}

// Export singleton instance
export const mapViewerModule = new IRISMapViewerModule(); 