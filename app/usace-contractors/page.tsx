"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building, CheckCircle, Shield, Star, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

export default function USACEContractorsPage() {
    const [formData, setFormData] = useState({
        company: '',
        name: '',
        email: '',
        phone: '',
        contractorType: '',
        usaceDistrict: '',
        currentChallenges: '',
        annualRevenue: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/usace-contractors/trial-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                alert(`Welcome to IRIS-AI Enterprise! Your trial ID is: ${result.trialId}. You'll receive a call within ${result.leadScore >= 70 ? '1 hour' : '4 hours'}.`);

                // Reset form
                setFormData({
                    company: '',
                    name: '',
                    email: '',
                    phone: '',
                    contractorType: '',
                    usaceDistrict: '',
                    currentChallenges: '',
                    annualRevenue: ''
                });
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Error submitting trial request:', error);
            alert('Error submitting trial request. Please try again.');
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-cyan-900/20"></div>

                <div className="relative container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <Badge className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm">
                            <Shield className="w-4 h-4 mr-2" />
                            CMMC Level 3 Certified • FISMA Compliant
                        </Badge>

                        {/* Headline */}
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Dominate USACE Contracts with
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                {" "}Quantum AI
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            The only AI platform built specifically for Army Corps of Engineers contractors.
                            Get CMMC Level 3 compliance, quantum-powered analytics, and 12x faster project delivery.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                                onClick={() => document.getElementById('trial-form')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Start 30-Day Free Trial
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg"
                            >
                                Watch Demo
                            </Button>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center justify-center gap-8 text-blue-200 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span>2,400+ USACE Contractors</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-400" />
                                <span>4.9/5 Rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                <span>$2.3M Avg. Savings</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem/Solution Section */}
            <section className="py-20 bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Stop Losing USACE Contracts to Competitors
                            </h2>
                            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                                95% of USACE contractors still use outdated tools. You need quantum-powered AI to win.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Problems */}
                            <Card className="bg-red-900/20 border-red-700">
                                <CardHeader>
                                    <CardTitle className="text-red-400 text-2xl">❌ Old Way Problems</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-red-200">
                                        <strong>Manual compliance tracking</strong> → Failed audits, lost contracts
                                    </div>
                                    <div className="text-red-200">
                                        <strong>Slow environmental analysis</strong> → Missed deadlines, cost overruns
                                    </div>
                                    <div className="text-red-200">
                                        <strong>Inefficient project management</strong> → 30% profit loss
                                    </div>
                                    <div className="text-red-200">
                                        <strong>No competitive intelligence</strong> → Losing bids to better-prepared firms
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Solutions */}
                            <Card className="bg-green-900/20 border-green-700">
                                <CardHeader>
                                    <CardTitle className="text-green-400 text-2xl">✅ IRIS-AI Solutions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-green-200">
                                        <strong>Automated CMMC Level 3</strong> → 100% compliance guarantee
                                    </div>
                                    <div className="text-green-200">
                                        <strong>Quantum environmental modeling</strong> → 12x faster analysis
                                    </div>
                                    <div className="text-green-200">
                                        <strong>AI project optimization</strong> → 47% faster delivery
                                    </div>
                                    <div className="text-green-200">
                                        <strong>Real-time competitive intelligence</strong> → Win 3x more bids
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl font-bold text-white text-center mb-16">
                            Built for USACE Contractors
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Environmental Package */}
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-green-400">Environmental AI</CardTitle>
                                    <CardDescription className="text-slate-300">
                                        Specialized for contamination cleanup and environmental impact assessment
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-slate-300">
                                        <li>• Contamination modeling & prediction</li>
                                        <li>• EPA regulation compliance tracking</li>
                                        <li>• Remediation cost optimization</li>
                                        <li>• Environmental impact assessment</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Construction Package */}
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                                        <Building className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-blue-400">Construction AI</CardTitle>
                                    <CardDescription className="text-slate-300">
                                        Optimize timelines, costs, and quality for infrastructure projects
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-slate-300">
                                        <li>• Project timeline optimization</li>
                                        <li>• Cost estimation & risk assessment</li>
                                        <li>• Quality control automation</li>
                                        <li>• Supply chain optimization</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Compliance Package */}
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-purple-400">Compliance AI</CardTitle>
                                    <CardDescription className="text-slate-300">
                                        Automated CMMC Level 3, FISMA, and NIST compliance management
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-slate-300">
                                        <li>• CMMC Level 3 certification</li>
                                        <li>• FISMA compliance automation</li>
                                        <li>• NIST 800-171 monitoring</li>
                                        <li>• Audit trail documentation</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Success Metrics */}
            <section className="py-20 bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-white mb-16">
                            Proven Results for USACE Contractors
                        </h2>

                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-400 mb-2">47%</div>
                                <div className="text-slate-300">Faster Project Delivery</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-green-400 mb-2">$2.3M</div>
                                <div className="text-slate-300">Average Annual Savings</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-purple-400 mb-2">96.8%</div>
                                <div className="text-slate-300">Compliance Success Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-cyan-400 mb-2">3x</div>
                                <div className="text-slate-300">More Contracts Won</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trial Form */}
            <section id="trial-form" className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader className="text-center">
                                <CardTitle className="text-3xl text-white mb-2">
                                    Start Your 30-Day Free Trial
                                </CardTitle>
                                <CardDescription className="text-slate-300 text-lg">
                                    Join 2,400+ USACE contractors already using IRIS-AI Enterprise
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="company" className="text-slate-300">Company Name</Label>
                                            <Input
                                                id="company"
                                                value={formData.company}
                                                onChange={(e) => handleInputChange('company', e.target.value)}
                                                className="bg-slate-700 border-slate-600 text-white"
                                                placeholder="Your Company Name"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className="bg-slate-700 border-slate-600 text-white"
                                                placeholder="Your Full Name"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="email" className="text-slate-300">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="bg-slate-700 border-slate-600 text-white"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                                            <Input
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="bg-slate-700 border-slate-600 text-white"
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="contractorType" className="text-slate-300">Contractor Type</Label>
                                            <Select value={formData.contractorType} onValueChange={(value) => handleInputChange('contractorType', value)}>
                                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                                    <SelectValue placeholder="Select contractor type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="environmental">Environmental Services</SelectItem>
                                                    <SelectItem value="construction">Construction & Engineering</SelectItem>
                                                    <SelectItem value="consulting">Technology & Consulting</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="usaceDistrict" className="text-slate-300">USACE District</Label>
                                            <Select value={formData.usaceDistrict} onValueChange={(value) => handleInputChange('usaceDistrict', value)}>
                                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                                    <SelectValue placeholder="Select USACE district" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="mobile">Mobile District</SelectItem>
                                                    <SelectItem value="savannah">Savannah District</SelectItem>
                                                    <SelectItem value="jacksonville">Jacksonville District</SelectItem>
                                                    <SelectItem value="charleston">Charleston District</SelectItem>
                                                    <SelectItem value="norfolk">Norfolk District</SelectItem>
                                                    <SelectItem value="baltimore">Baltimore District</SelectItem>
                                                    <SelectItem value="other">Other District</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="annualRevenue" className="text-slate-300">Annual Revenue Range</Label>
                                        <Select value={formData.annualRevenue} onValueChange={(value) => handleInputChange('annualRevenue', value)}>
                                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                                <SelectValue placeholder="Select revenue range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="under-1m">Under $1M</SelectItem>
                                                <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                                                <SelectItem value="5m-25m">$5M - $25M</SelectItem>
                                                <SelectItem value="25m-100m">$25M - $100M</SelectItem>
                                                <SelectItem value="over-100m">Over $100M</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="challenges" className="text-slate-300">Current Challenges</Label>
                                        <Textarea
                                            id="challenges"
                                            value={formData.currentChallenges}
                                            onChange={(e) => handleInputChange('currentChallenges', e.target.value)}
                                            className="bg-slate-700 border-slate-600 text-white"
                                            placeholder="What are your biggest challenges with USACE contracts?"
                                            rows={4}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg">
                                        Start My Free Trial Now
                                    </Button>

                                    <p className="text-sm text-slate-400 text-center">
                                        No credit card required. 30-day money-back guarantee. Cancel anytime.
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-12 bg-blue-900">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Ready to dominate USACE contracts?
                    </h3>
                    <p className="text-blue-100 mb-6">
                        Join the quantum AI revolution and win more contracts with IRIS-AI Enterprise
                    </p>
                    <Button
                        size="lg"
                        className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4"
                        onClick={() => document.getElementById('trial-form')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Start Your Free Trial
                    </Button>
                </div>
            </section>
        </div>
    );
} 