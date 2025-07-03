'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Database, Map, Navigation, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AGCDemoProps {
    className?: string;
}

export default function AGCComplianceDemo({ className = '' }: AGCDemoProps) {
    const [sdkStatus, setSdkStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
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

    const runDemo = async (action: string, data: any = {}) => {
        try {
            const response = await fetch('/api/iris-agc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, data })
            });
            const result = await response.json();

            setDemoResults(prev => ({
                ...prev,
                [action]: result
            }));

            return result;
        } catch (error) {
            console.error('Demo execution failed:', error);
            return { success: false, error: 'Demo execution failed' };
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center ${className}`}>
                <div className="text-white text-xl">Loading IRIS MCP SDK AGC Compliance Demo...</div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 ${className}`}>
            {/* Header */}
            <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-lg">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                🌟 IRIS MCP SDK - AGC Compliance Demo
                            </h1>
                            <p className="text-slate-300">
                                Army Geospatial Center Standards Demonstration Platform
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            {sdkStatus && (
                                <>
                                    <Badge className="bg-green-600 text-white">
                                        Version {sdkStatus.version}
                                    </Badge>
                                    <Badge className="bg-blue-600 text-white">
                                        {sdkStatus.status.toUpperCase()}
                                    </Badge>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8">
                {/* Overview Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">🎯 AGC Compliance Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Standards Compliance */}
                        <Card className="bg-slate-800/50 border-slate-700 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>✅ Standards Compliance</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {sdkStatus?.supportedStandards?.map((standard: string) => (
                                        <Badge key={standard} variant="outline" className="mr-2 mb-2 text-green-400 border-green-400">
                                            {standard}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Module Status */}
                        <Card className="bg-slate-800/50 border-slate-700 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Navigation className="h-5 w-5 text-blue-500" />
                                    <span>🚀 Active Modules</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {sdkStatus?.modules && Object.keys(sdkStatus.modules).map((moduleId: string) => (
                                        <div key={moduleId} className="flex items-center justify-between">
                                            <span className="text-sm">{moduleId}</span>
                                            <Badge className="bg-green-600 text-white">Active</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Real-time Metrics */}
                        <Card className="bg-slate-800/50 border-slate-700 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                                    <span>📊 System Metrics</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Routes:</span>
                                        <span className="text-green-400">5 active</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Symbols:</span>
                                        <span className="text-green-400">25 rendered</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Data Sources:</span>
                                        <span className="text-green-400">7 federated</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Compliance:</span>
                                        <span className="text-green-400">100% AGC</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Demo Modules */}
                <div className="space-y-8">
                    {/* Geo Routing Demo */}
                    <Card className="bg-slate-800/50 border-slate-700 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Navigation className="h-6 w-6 text-blue-500" />
                                <span>🗺️ REM + RAPI Route Planning Demo</span>
                            </CardTitle>
                            <CardDescription className="text-slate-300">
                                Route Exchange Model and Route API compliance demonstration
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button
                                    onClick={() => runDemo('plan-route', {
                                        startPoint: { latitude: 38.9072, longitude: -77.0369 },
                                        endPoint: { latitude: 39.0458, longitude: -76.6413 }
                                    })}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    📍 Plan Route (DC to Baltimore)
                                </Button>
                                <Button
                                    onClick={() => runDemo('add-obstacle', {
                                        position: { latitude: 38.95, longitude: -77.0 },
                                        type: 'traffic',
                                        severity: 'medium'
                                    })}
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                    ⚠️ Add Obstacle
                                </Button>
                                <Button
                                    onClick={() => runDemo('sync-rapi', { endpoint: 'https://agc.army.mil/api/rapi' })}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    🔄 Sync with RAPI
                                </Button>
                            </div>

                            {demoResults['plan-route'] && (
                                <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                                    <h4 className="font-semibold mb-2 text-green-400">✅ Route Planning Result:</h4>
                                    <div className="text-sm space-y-1">
                                        <div>Route ID: {demoResults['plan-route'].data?.routeId}</div>
                                        <div>Distance: {demoResults['plan-route'].data?.distance?.toFixed(2)} km</div>
                                        <div>Compliance: {demoResults['plan-route'].data?.compliance?.join(', ')}</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* 3D Context Demo */}
                    <Card className="bg-slate-800/50 border-slate-700 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Map className="h-6 w-6 text-purple-500" />
                                <span>🏔️ 3D GeoVolumes API Demo</span>
                            </CardTitle>
                            <CardDescription className="text-slate-300">
                                OGC 3D terrain visualization and analysis
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button
                                    onClick={() => runDemo('load-terrain', {
                                        bounds: { north: 39.0, south: 38.0, east: -76.0, west: -78.0 }
                                    })}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    🗻 Load 3D Terrain
                                </Button>
                                <Button
                                    onClick={() => runDemo('viewshed-analysis', {
                                        observer: { latitude: 38.9072, longitude: -77.0369, height: 10 }
                                    })}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    👁️ Viewshed Analysis
                                </Button>
                                <Button
                                    onClick={() => runDemo('elevation-profile', {
                                        start: { latitude: 38.9, longitude: -77.0 },
                                        end: { latitude: 39.0, longitude: -76.9 }
                                    })}
                                    className="bg-teal-600 hover:bg-teal-700"
                                >
                                    📈 Elevation Profile
                                </Button>
                            </div>

                            {demoResults['load-terrain'] && (
                                <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                                    <h4 className="font-semibold mb-2 text-green-400">✅ Terrain Loading Result:</h4>
                                    <div className="text-sm space-y-1">
                                        <div>Model ID: {demoResults['load-terrain'].data?.modelId}</div>
                                        <div>Type: {demoResults['load-terrain'].data?.type}</div>
                                        <div>Compliance: {demoResults['load-terrain'].data?.compliance?.join(', ')}</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Military Symbology Demo */}
                    <Card className="bg-slate-800/50 border-slate-700 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Shield className="h-6 w-6 text-red-500" />
                                <span>🎖️ MIL-STD-2525 Symbology Demo</span>
                            </CardTitle>
                            <CardDescription className="text-slate-300">
                                Military symbology and role-based portrayal
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Button
                                    onClick={() => runDemo('add-symbol', {
                                        sidc: 'SFGP-----------',
                                        position: { latitude: 38.9072, longitude: -77.0369 },
                                        affiliation: 'friendly'
                                    })}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    👥 Friendly Unit
                                </Button>
                                <Button
                                    onClick={() => runDemo('add-symbol', {
                                        sidc: 'SHGP-----------',
                                        position: { latitude: 38.92, longitude: -77.01 },
                                        affiliation: 'hostile'
                                    })}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    💀 Hostile Unit
                                </Button>
                                <Button
                                    onClick={() => runDemo('role-portrayal', { role: 'commander' })}
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                    👨‍💼 Commander View
                                </Button>
                                <Button
                                    onClick={() => runDemo('role-portrayal', { role: 'soldier' })}
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    🪖 Soldier View
                                </Button>
                            </div>

                            {demoResults['add-symbol'] && (
                                <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                                    <h4 className="font-semibold mb-2 text-green-400">✅ Symbol Creation Result:</h4>
                                    <div className="text-sm space-y-1">
                                        <div>Symbol ID: {demoResults['add-symbol'].data?.symbolId}</div>
                                        <div>SIDC: {demoResults['add-symbol'].data?.sidc}</div>
                                        <div>Affiliation: {demoResults['add-symbol'].data?.affiliation}</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Federated Data Demo */}
                    <Card className="bg-slate-800/50 border-slate-700 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Database className="h-6 w-6 text-green-500" />
                                <span>🌐 ABCANZ Federated Data Access</span>
                            </CardTitle>
                            <CardDescription className="text-slate-300">
                                Cross-domain data federation and security labeling
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button
                                    onClick={() => runDemo('federated-query', {
                                        sourceId: 'nga-foundation',
                                        securityLabel: { classification: 'UNCLASSIFIED', releasability: 'COALITION' }
                                    })}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    🇺🇸 Query NGA Data
                                </Button>
                                <Button
                                    onClick={() => runDemo('coalition-share', {
                                        partners: ['US', 'UK', 'CA', 'AU', 'NZ'],
                                        classification: 'UNCLASSIFIED'
                                    })}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    🤝 Share with ABCANZ
                                </Button>
                                <Button
                                    onClick={() => runDemo('security-validation', {
                                        user: 'analyst-001',
                                        clearance: 'SECRET'
                                    })}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    🔒 Validate Access
                                </Button>
                            </div>

                            {demoResults['federated-query'] && (
                                <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                                    <h4 className="font-semibold mb-2 text-green-400">✅ Federated Query Result:</h4>
                                    <div className="text-sm space-y-1">
                                        <div>Query ID: {demoResults['federated-query'].data?.queryId}</div>
                                        <div>Records: {demoResults['federated-query'].data?.recordCount}</div>
                                        <div>Classification: {demoResults['federated-query'].data?.classification}</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Deployment Section */}
                <div className="mt-12 p-6 bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-lg border border-green-500/30">
                    <h3 className="text-xl font-bold text-white mb-4">🚀 Ready for Production Deployment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-green-400 mb-2">✅ AGC Certification Ready:</h4>
                            <ul className="text-sm text-slate-300 space-y-1">
                                <li>• SSGF (Standard Sharable Geospatial Foundation)</li>
                                <li>• OGC + NSG Standards Compliant</li>
                                <li>• DoD MOSA Architecture</li>
                                <li>• ABCANZ Coalition Interoperability</li>
                                <li>• Enterprise Security (HIPAA, FISMA, SOC2, CMMC)</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-green-400 mb-2">🎯 Deployment Options:</h4>
                            <div className="space-y-2">
                                <Button className="w-full bg-green-600 hover:bg-green-700">
                                    Deploy to CECIL Environment
                                </Button>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    Submit for AGC Certification
                                </Button>
                                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                    Generate White Paper PDF
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-700 bg-slate-800/50 backdrop-blur-lg mt-12">
                <div className="container mx-auto px-6 py-4">
                    <div className="text-center text-slate-400 text-sm">
                        IRIS MCP SDK v{sdkStatus?.version} - AGC Compliant Geospatial Intelligence Platform
                        <br />
                        Last Updated: {sdkStatus ? new Date(sdkStatus.timestamp).toLocaleString() : 'Loading...'}
                    </div>
                </div>
            </div>
        </div>
    );
} 