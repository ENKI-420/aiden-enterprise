'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle, Database, Layers, Map, Navigation, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SDKModule {
    status: 'active' | 'inactive';
    compliance: string[];
    capabilities: string[];
    [key: string]: any;
}

interface SDKStatus {
    version: string;
    status: string;
    timestamp: string;
    supportedStandards: string[];
    modules: {
        'geo-routing': SDKModule;
        '3d-context': SDKModule;
        'map-viewer': SDKModule;
        'portrayal-engine': SDKModule;
        'data-bridge': SDKModule;
    };
}

export default function AGCDemo() {
    const [sdkStatus, setSdkStatus] = useState<SDKStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeModule, setActiveModule] = useState('overview');
    const [demoResults, setDemoResults] = useState<any>({});

    useEffect(() => {
        fetchSDKStatus();
    }, []);

    const fetchSDKStatus = async () => {
        try {
            const response = await fetch('/api/iris-agc');
            const result = await response.json();
            if (result.success) {
                setSdkStatus(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch SDK status:', error);
        } finally {
            setLoading(false);
        }
    };

    const runDemo = async (action: string, module: string, data: any = {}) => {
        try {
            const response = await fetch('/api/iris-agc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, module, data })
            });
            const result = await response.json();

            setDemoResults((prev: any) => ({
                ...prev,
                [action]: result
            }));

            return result;
        } catch (error) {
            console.error('Demo execution failed:', error);
            return { success: false, error: 'Demo execution failed' };
        }
    };

    const getModuleIcon = (moduleId: string) => {
        const icons = {
            'geo-routing': <Navigation className="h-5 w-5" />,
            '3d-context': <Map className="h-5 w-5" />,
            'map-viewer': <Layers className="h-5 w-5" />,
            'portrayal-engine': <Shield className="h-5 w-5" />,
            'data-bridge': <Database className="h-5 w-5" />
        };
        return icons[moduleId as keyof typeof icons] || <AlertCircle className="h-5 w-5" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading IRIS MCP SDK AGC Compliance Demo...</div>
            </div>
        );
    }

    if (!sdkStatus) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-red-400 text-xl">Failed to load SDK status</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Header */}
            <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-lg">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                IRIS MCP SDK - AGC Compliance Demo
                            </h1>
                            <p className="text-slate-300">
                                Army Geospatial Center Standards Demonstration Platform
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Badge variant="secondary" className="bg-green-600 text-white">
                                Version {sdkStatus.version}
                            </Badge>
                            <Badge variant="secondary" className="bg-blue-600 text-white">
                                {sdkStatus.status.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8">
                <Tabs value={activeModule} onValueChange={setActiveModule} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
                        <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
                        <TabsTrigger value="geo-routing" className="text-white">Geo Routing</TabsTrigger>
                        <TabsTrigger value="3d-context" className="text-white">3D Context</TabsTrigger>
                        <TabsTrigger value="map-viewer" className="text-white">Map Viewer</TabsTrigger>
                        <TabsTrigger value="portrayal-engine" className="text-white">Portrayal Engine</TabsTrigger>
                        <TabsTrigger value="data-bridge" className="text-white">Data Bridge</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Standards Compliance */}
                            <Card className="bg-slate-800/50 border-slate-700 text-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span>Standards Compliance</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {sdkStatus.supportedStandards.map(standard => (
                                            <Badge key={standard} variant="outline" className="mr-2 mb-2">
                                                {standard}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Module Status */}
                            {Object.entries(sdkStatus.modules).map(([moduleId, module]) => (
                                <Card key={moduleId} className="bg-slate-800/50 border-slate-700 text-white">
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            {getModuleIcon(moduleId)}
                                            <span>{moduleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                        </CardTitle>
                                        <CardDescription className="text-slate-300">
                                            {module.capabilities.join(', ')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Status:</span>
                                                <Badge variant={module.status === 'active' ? 'default' : 'destructive'}>
                                                    {module.status}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-slate-300">
                                                Compliance: {module.compliance.join(', ')}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Geo Routing Tab */}
                    <TabsContent value="geo-routing" className="space-y-6">
                        <Card className="bg-slate-800/50 border-slate-700 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Navigation className="h-5 w-5" />
                                    <span>REM + RAPI Route Planning Demo</span>
                                </CardTitle>
                                <CardDescription className="text-slate-300">
                                    Route Exchange Model and Route API compliance demonstration
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Start Coordinate</Label>
                                        <Input
                                            placeholder="38.9072, -77.0369"
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Coordinate</Label>
                                        <Input
                                            placeholder="39.0458, -76.6413"
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={() => runDemo('plan-route', 'geo-routing', {
                                        startPoint: { latitude: 38.9072, longitude: -77.0369 },
                                        endPoint: { latitude: 39.0458, longitude: -76.6413 }
                                    })}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    Plan REM-Compliant Route
                                </Button>

                                {demoResults['plan-route'] && (
                                    <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                                        <h4 className="font-semibold mb-2">Route Planning Result:</h4>
                                        <pre className="text-sm text-green-400 overflow-auto">
                                            {JSON.stringify(demoResults['plan-route'], null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 3D Context Tab */}
                    <TabsContent value="3d-context" className="space-y-6">
                        <Card className="bg-slate-800/50 border-slate-700 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Map className="h-5 w-5" />
                                    <span>3D GeoVolumes API Demo</span>
                                </CardTitle>
                                <CardDescription className="text-slate-300">
                                    OGC 3D terrain visualization and analysis
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Bounds (North, South, East, West)</Label>
                                        <Input
                                            placeholder="39.0, 38.0, -76.0, -78.0"
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Resolution</Label>
                                        <Input
                                            placeholder="1"
                                            type="number"
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={() => runDemo('load-terrain', '3d-context', {
                                        bounds: { north: 39.0, south: 38.0, east: -76.0, west: -78.0 },
                                        resolution: 1
                                    })}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    Load 3D Terrain Model
                                </Button>

                                {demoResults['load-terrain'] && (
                                    <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                                        <h4 className="font-semibold mb-2">Terrain Loading Result:</h4>
                                        <pre className="text-sm text-green-400 overflow-auto">
                                            {JSON.stringify(demoResults['load-terrain'], null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Map Viewer Tab */}
                    <TabsContent value="map-viewer" className="space-y-6">
                        <Card className="bg-slate-800/50 border-slate-700 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Layers className="h-5 w-5" />
                                    <span>Vector Tiles & Releasable Basemaps</span>
                                </CardTitle>
                                <CardDescription className="text-slate-300">
                                    OGC API - Tiles and coalition sharing demonstration
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                                        Load Vector Tiles
                                    </Button>
                                    <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                                        Apply OGC Styles
                                    </Button>
                                    <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                                        Export for Coalition
                                    </Button>
                                </div>

                                <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                                    <h4 className="font-semibold mb-2">Available Releasable Basemaps:</h4>
                                    <ul className="text-sm space-y-1">
                                        <li>• World Releasable Basemap (UNCLASSIFIED/COALITION)</li>
                                        <li>• Transportation Network (UNCLASSIFIED/COALITION)</li>
                                        <li>• Administrative Boundaries (UNCLASSIFIED/COALITION)</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Portrayal Engine Tab */}
                    <TabsContent value="portrayal-engine" className="space-y-6">
                        <Card className="bg-slate-800/50 border-slate-700 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Shield className="h-5 w-5" />
                                    <span>MIL-STD-2525 Symbology Demo</span>
                                </CardTitle>
                                <CardDescription className="text-slate-300">
                                    Military symbology and role-based portrayal
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>SIDC Code</Label>
                                        <Input
                                            placeholder="SFGP-----------"
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Position</Label>
                                        <Input
                                            placeholder="38.9072, -77.0369"
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Affiliation</Label>
                                        <select className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white">
                                            <option value="friendly">Friendly</option>
                                            <option value="hostile">Hostile</option>
                                            <option value="neutral">Neutral</option>
                                            <option value="unknown">Unknown</option>
                                        </select>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => runDemo('add-symbol', 'portrayal-engine', {
                                        sidc: 'SFGP-----------',
                                        position: { latitude: 38.9072, longitude: -77.0369 },
                                        affiliation: 'friendly'
                                    })}
                                    className="w-full bg-red-600 hover:bg-red-700"
                                >
                                    Add Military Symbol
                                </Button>

                                {demoResults['add-symbol'] && (
                                    <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                                        <h4 className="font-semibold mb-2">Symbol Creation Result:</h4>
                                        <pre className="text-sm text-green-400 overflow-auto">
                                            {JSON.stringify(demoResults['add-symbol'], null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Data Bridge Tab */}
                    <TabsContent value="data-bridge" className="space-y-6">
                        <Card className="bg-slate-800/50 border-slate-700 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Database className="h-5 w-5" />
                                    <span>ABCANZ Federated Data Access</span>
                                </CardTitle>
                                <CardDescription className="text-slate-300">
                                    Cross-domain data federation and security labeling
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Data Source</Label>
                                        <select className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white">
                                            <option value="nga-foundation">NGA Foundation Data</option>
                                            <option value="agc-services">AGC Services</option>
                                            <option value="coalition-intel">Coalition Intelligence</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Classification</Label>
                                        <select className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white">
                                            <option value="UNCLASSIFIED">UNCLASSIFIED</option>
                                            <option value="CUI">CUI</option>
                                            <option value="SECRET">SECRET</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Query Parameters</Label>
                                    <Textarea
                                        placeholder='{"queryType": "spatial", "geometry": {...}}'
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                </div>
                                <Button
                                    onClick={() => runDemo('federated-query', 'data-bridge', {
                                        sourceId: 'nga-foundation',
                                        securityLabel: { classification: 'UNCLASSIFIED', releasability: 'COALITION' }
                                    })}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    Execute Federated Query
                                </Button>

                                {demoResults['federated-query'] && (
                                    <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                                        <h4 className="font-semibold mb-2">Query Result:</h4>
                                        <pre className="text-sm text-green-400 overflow-auto">
                                            {JSON.stringify(demoResults['federated-query'], null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-700 bg-slate-800/50 backdrop-blur-lg mt-12">
                <div className="container mx-auto px-6 py-4">
                    <div className="text-center text-slate-400 text-sm">
                        IRIS MCP SDK v{sdkStatus.version} - AGC Compliant Geospatial Intelligence Platform
                        <br />
                        Last Updated: {new Date(sdkStatus.timestamp).toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
} 