// IRIS MCP SDK - Geo Routing Module
// REM + RAPI Compliant Route Planning and Obstacle Sharing

import { IRISCoreModule, IRISUtils } from './core';
import {
    GeospatialCoordinate,
    ObstacleData,
    RouteConstraints,
    RouteExchangeModel,
    RoutePoint
} from './types';

export class IRISGeoRoutingModule extends IRISCoreModule {
    private routes: Map<string, RouteExchangeModel> = new Map();
    private obstacles: Map<string, ObstacleData> = new Map();
    private rapiEndpoints: Map<string, string> = new Map();

    constructor() {
        super();
        this.initializeRAPIEndpoints();
        this.log('IRIS Geo Routing Module initialized with REM + RAPI compliance', 'UNCLASSIFIED');
    }

    private initializeRAPIEndpoints() {
        // Standard RAPI endpoints for route services
        this.rapiEndpoints.set('routes', '/api/rapi/routes');
        this.rapiEndpoints.set('obstacles', '/api/rapi/obstacles');
        this.rapiEndpoints.set('waypoints', '/api/rapi/waypoints');
        this.rapiEndpoints.set('analysis', '/api/rapi/analysis');
    }

    // Route Planning (REM Compliant)
    async planRoute(
        startPoint: GeospatialCoordinate,
        endPoint: GeospatialCoordinate,
        constraints?: RouteConstraints
    ): Promise<RouteExchangeModel> {
        if (!IRISUtils.validateCoordinate(startPoint) || !IRISUtils.validateCoordinate(endPoint)) {
            throw new Error('Invalid coordinates provided');
        }

        const routeId = IRISUtils.generateId();
        const route: RouteExchangeModel = {
            id: routeId,
            name: `Route ${routeId}`,
            classification: 'UNCLASSIFIED',
            releasability: 'FOUO',
            routePoints: [
                {
                    id: IRISUtils.generateId(),
                    ...startPoint,
                    waypoint: true
                },
                {
                    id: IRISUtils.generateId(),
                    ...endPoint,
                    waypoint: true
                }
            ],
            ...(constraints && { constraints }),
            metadata: {
                createdBy: 'IRIS-MCP-SDK',
                createdAt: IRISUtils.formatTimestamp(),
                purpose: 'Route planning',
                units: ['military', 'civilian']
            }
        };

        // Add intermediate waypoints based on constraints
        if (constraints) {
            await this.addIntermediateWaypoints(route, constraints);
        }

        // Check for obstacles along route
        await this.checkRouteObstacles(route);

        this.routes.set(routeId, route);

        this.emit({
            id: IRISUtils.generateId(),
            type: 'route-updated',
            timestamp: IRISUtils.formatTimestamp(),
            source: 'geo-routing',
            data: { routeId, action: 'created' },
            classification: 'UNCLASSIFIED'
        });

        this.log(`Route planned: ${routeId} from ${startPoint.latitude},${startPoint.longitude} to ${endPoint.latitude},${endPoint.longitude}`);

        return route;
    }

    private async addIntermediateWaypoints(route: RouteExchangeModel, constraints: RouteConstraints) {
        // Simplified waypoint generation - in production, use proper routing algorithm
        if (route.routePoints.length < 2) return;

        const startPoint = route.routePoints[0];
        const endPoint = route.routePoints[route.routePoints.length - 1];

        if (!startPoint || !endPoint) return;

        const distance = IRISUtils.calculateDistance(startPoint, endPoint);

        // Add waypoints every 50km for long routes
        if (distance > 50) {
            const numWaypoints = Math.floor(distance / 50);
            const latStep = (endPoint.latitude - startPoint.latitude) / (numWaypoints + 1);
            const lonStep = (endPoint.longitude - startPoint.longitude) / (numWaypoints + 1);

            for (let i = 1; i <= numWaypoints; i++) {
                const waypoint: RoutePoint = {
                    id: IRISUtils.generateId(),
                    latitude: startPoint.latitude + (latStep * i),
                    longitude: startPoint.longitude + (lonStep * i),
                    waypoint: true
                };

                route.routePoints.splice(i, 0, waypoint);
            }
        }
    }

    private async checkRouteObstacles(route: RouteExchangeModel) {
        // Check each route segment for obstacles
        for (let i = 0; i < route.routePoints.length - 1; i++) {
            const currentPoint = route.routePoints[i];
            const nextPoint = route.routePoints[i + 1];

            if (!currentPoint || !nextPoint) continue;

            const obstacles = await this.getObstaclesNearRoute(currentPoint, nextPoint);

            obstacles.forEach(obstacle => {
                // Add obstacle data to nearest route point
                const nearestPoint = this.findNearestRoutePoint(route.routePoints, obstacle);
                if (nearestPoint) {
                    nearestPoint.obstacleData = obstacle;
                }
            });
        }
    }

    private async getObstaclesNearRoute(start: RoutePoint, end: RoutePoint): Promise<ObstacleData[]> {
        const obstacles: ObstacleData[] = [];

        // Simulate obstacle detection
        const midpoint = {
            latitude: (start.latitude + end.latitude) / 2,
            longitude: (start.longitude + end.longitude) / 2
        };

        // Check if there are any obstacles near the midpoint
        for (const [id, obstacle] of this.obstacles) {
            if (obstacle.geometry && obstacle.geometry.type === 'Point') {
                const coords = obstacle.geometry.coordinates as [number, number];
                if (coords && coords.length >= 2) {
                    const obstacleCoord = {
                        latitude: coords[1],
                        longitude: coords[0]
                    };

                    const distance = IRISUtils.calculateDistance(midpoint, obstacleCoord);

                    // If obstacle is within 5km of route
                    if (distance <= 5) {
                        obstacles.push(obstacle);
                    }
                }
            }
        }

        return obstacles;
    }

    private findNearestRoutePoint(routePoints: RoutePoint[], obstacle: ObstacleData): RoutePoint | null {
        if (!obstacle.geometry || obstacle.geometry.type !== 'Point') {
            return null;
        }

        const coords = obstacle.geometry.coordinates as [number, number];
        if (!coords || coords.length < 2) {
            return null;
        }

        const obstacleCoord = {
            latitude: coords[1],
            longitude: coords[0]
        };

        let nearestPoint: RoutePoint | null = null;
        let minDistance = Infinity;

        routePoints.forEach(point => {
            const distance = IRISUtils.calculateDistance(point, obstacleCoord);
            if (distance < minDistance) {
                minDistance = distance;
                nearestPoint = point;
            }
        });

        return nearestPoint;
    }

    // Obstacle Management
    async addObstacle(obstacle: ObstacleData): Promise<string> {
        const obstacleId = IRISUtils.generateId();
        this.obstacles.set(obstacleId, obstacle);

        this.emit({
            id: IRISUtils.generateId(),
            type: 'obstacle-detected',
            timestamp: IRISUtils.formatTimestamp(),
            source: 'geo-routing',
            data: { obstacleId, obstacle },
            classification: obstacle.classification
        });

        this.log(`Obstacle added: ${obstacleId} (${obstacle.type}, ${obstacle.severity})`);

        return obstacleId;
    }

    async updateObstacle(obstacleId: string, updates: Partial<ObstacleData>): Promise<void> {
        const obstacle = this.obstacles.get(obstacleId);
        if (!obstacle) {
            throw new Error('Obstacle not found');
        }

        const updatedObstacle = { ...obstacle, ...updates };
        this.obstacles.set(obstacleId, updatedObstacle);

        this.emit({
            id: IRISUtils.generateId(),
            type: 'obstacle-detected',
            timestamp: IRISUtils.formatTimestamp(),
            source: 'geo-routing',
            data: { obstacleId, action: 'updated' },
            classification: updatedObstacle.classification
        });

        this.log(`Obstacle updated: ${obstacleId}`);
    }

    async removeObstacle(obstacleId: string): Promise<void> {
        const obstacle = this.obstacles.get(obstacleId);
        if (!obstacle) {
            throw new Error('Obstacle not found');
        }

        this.obstacles.delete(obstacleId);

        this.emit({
            id: IRISUtils.generateId(),
            type: 'obstacle-detected',
            timestamp: IRISUtils.formatTimestamp(),
            source: 'geo-routing',
            data: { obstacleId, action: 'removed' },
            classification: obstacle.classification
        });

        this.log(`Obstacle removed: ${obstacleId}`);
    }

    // Route Management
    getRoute(routeId: string): RouteExchangeModel | null {
        return this.routes.get(routeId) || null;
    }

    getAllRoutes(): RouteExchangeModel[] {
        return Array.from(this.routes.values());
    }

    async deleteRoute(routeId: string): Promise<void> {
        if (!this.routes.has(routeId)) {
            throw new Error('Route not found');
        }

        this.routes.delete(routeId);

        this.emit({
            id: IRISUtils.generateId(),
            type: 'route-updated',
            timestamp: IRISUtils.formatTimestamp(),
            source: 'geo-routing',
            data: { routeId, action: 'deleted' },
            classification: 'UNCLASSIFIED'
        });

        this.log(`Route deleted: ${routeId}`);
    }

    // RAPI Integration
    async syncWithRAPI(endpoint: string): Promise<void> {
        // Simulate RAPI synchronization
        this.log(`Syncing with RAPI endpoint: ${endpoint}`);

        // In production, this would make HTTP requests to RAPI-compliant services
        const routes = this.getAllRoutes();
        const obstacles = Array.from(this.obstacles.values());

        // Simulate API calls
        await this.simulateRAPICall('POST', endpoint + '/routes', routes);
        await this.simulateRAPICall('POST', endpoint + '/obstacles', obstacles);

        this.log(`RAPI sync completed: ${routes.length} routes, ${obstacles.length} obstacles`);
    }

    private async simulateRAPICall(method: string, url: string, data: any): Promise<void> {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100));

        this.log(`RAPI ${method} ${url} - ${JSON.stringify(data).length} bytes`);
    }

    // Offline capability
    async enableOfflineMode(): Promise<void> {
        // Cache routes and obstacles for offline use
        const cacheData = {
            routes: Array.from(this.routes.entries()),
            obstacles: Array.from(this.obstacles.entries()),
            timestamp: IRISUtils.formatTimestamp()
        };

        // In production, store in IndexedDB or similar
        localStorage.setItem('iris-geo-routing-cache', JSON.stringify(cacheData));

        this.log('Offline mode enabled - data cached locally');
    }

    async loadOfflineCache(): Promise<void> {
        const cacheData = localStorage.getItem('iris-geo-routing-cache');
        if (!cacheData) {
            this.log('No offline cache found');
            return;
        }

        const cache = JSON.parse(cacheData);
        this.routes = new Map(cache.routes);
        this.obstacles = new Map(cache.obstacles);

        this.log(`Offline cache loaded: ${this.routes.size} routes, ${this.obstacles.size} obstacles`);
    }

    // Compliance reporting
    getComplianceReport() {
        return {
            module: 'geo-routing',
            compliance: ['REM', 'RAPI', 'SSGF'],
            capabilities: ['route-planning', 'obstacle-sharing', 'offline-routing'],
            routes: this.routes.size,
            obstacles: this.obstacles.size,
            rapiEndpoints: Array.from(this.rapiEndpoints.keys()),
            status: 'active',
            lastSync: IRISUtils.formatTimestamp()
        };
    }
}

// Export singleton instance
export const geoRoutingModule = new IRISGeoRoutingModule(); 