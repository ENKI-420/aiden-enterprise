/**
 * Unified AI Orchestration Layer for IRIS-AI Enterprise
 * Manages all AI models with intelligent routing, load balancing, and fallback mechanisms
 */

export interface AIModel {
    id: string;
    name: string;
    provider: 'openai' | 'anthropic' | 'google' | 'meta' | 'iris-custom';
    specialty: string;
    capabilities: string[];
    costPerToken: number;
    maxTokens: number;
    responseTime: number;
    reliability: number;
    isAvailable: boolean;
    currentLoad: number;
    maxConcurrency: number;
}

export interface AIRequest {
    taskType: 'reasoning' | 'creative' | 'analysis' | 'synthesis' | 'medical' | 'legal' | 'defense';
    priority: 'low' | 'medium' | 'high' | 'critical';
    context: string;
    requirements: {
        accuracy?: number;
        speed?: number;
        creativity?: number;
        cost?: number;
    };
    fallbackAllowed: boolean;
}

export interface AIResponse {
    modelUsed: string;
    result: any;
    confidence: number;
    processingTime: number;
    cost: number;
    alternatives?: AIResponse[];
}

export class UnifiedAIOrchestrator {
    private models: Map<string, AIModel> = new Map();
    private requestQueue: AIRequest[] = [];
    private loadBalancer: LoadBalancer;
    private fallbackManager: FallbackManager;
    private costOptimizer: CostOptimizer;
    private healthMonitor: HealthMonitor;

    constructor() {
        this.loadBalancer = new LoadBalancer();
        this.fallbackManager = new FallbackManager();
        this.costOptimizer = new CostOptimizer();
        this.healthMonitor = new HealthMonitor();
        this.initializeModels();
        this.startHealthMonitoring();
    }

    private initializeModels() {
        // Production-ready model registry
        const modelConfigs: AIModel[] = [
            {
                id: 'gpt-4-turbo',
                name: 'GPT-4 Turbo',
                provider: 'openai',
                specialty: 'general reasoning',
                capabilities: ['reasoning', 'code', 'analysis', 'synthesis'],
                costPerToken: 0.00003,
                maxTokens: 128000,
                responseTime: 2.1,
                reliability: 0.98,
                isAvailable: true,
                currentLoad: 0,
                maxConcurrency: 10
            },
            {
                id: 'claude-3-opus',
                name: 'Claude 3 Opus',
                provider: 'anthropic',
                specialty: 'creative writing',
                capabilities: ['creative', 'analysis', 'reasoning', 'ethical'],
                costPerToken: 0.000015,
                maxTokens: 200000,
                responseTime: 1.8,
                reliability: 0.97,
                isAvailable: true,
                currentLoad: 0,
                maxConcurrency: 8
            },
            {
                id: 'iris-medical',
                name: 'IRIS Medical AI',
                provider: 'iris-custom',
                specialty: 'healthcare',
                capabilities: ['medical', 'diagnosis', 'analysis', 'compliance'],
                costPerToken: 0.00001,
                maxTokens: 100000,
                responseTime: 1.5,
                reliability: 0.99,
                isAvailable: true,
                currentLoad: 0,
                maxConcurrency: 15
            },
            {
                id: 'iris-defense',
                name: 'IRIS Defense AI',
                provider: 'iris-custom',
                specialty: 'defense',
                capabilities: ['security', 'threat-analysis', 'compliance', 'intelligence'],
                costPerToken: 0.00001,
                maxTokens: 100000,
                responseTime: 1.2,
                reliability: 0.99,
                isAvailable: true,
                currentLoad: 0,
                maxConcurrency: 12
            },
            {
                id: 'iris-legal',
                name: 'IRIS Legal AI',
                provider: 'iris-custom',
                specialty: 'legal',
                capabilities: ['legal', 'compliance', 'analysis', 'contracts'],
                costPerToken: 0.00001,
                maxTokens: 100000,
                responseTime: 1.3,
                reliability: 0.99,
                isAvailable: true,
                currentLoad: 0,
                maxConcurrency: 10
            }
        ];

        modelConfigs.forEach(model => this.models.set(model.id, model));
    }

    public async processRequest(request: AIRequest): Promise<AIResponse> {
        // Step 1: Select optimal model
        const selectedModel = this.selectOptimalModel(request);

        // Step 2: Check availability and load
        if (!this.isModelAvailable(selectedModel)) {
            if (request.fallbackAllowed) {
                const fallbackModel = this.fallbackManager.selectFallback(selectedModel, request);
                if (fallbackModel) {
                    return this.executeRequest(request, fallbackModel);
                }
            }
            throw new Error(`Model ${selectedModel.id} unavailable and no fallback allowed`);
        }

        // Step 3: Execute request
        return this.executeRequest(request, selectedModel);
    }

    private selectOptimalModel(request: AIRequest): AIModel {
        const candidates = Array.from(this.models.values())
            .filter(model => this.isModelSuitableForTask(model, request));

        if (candidates.length === 0) {
            throw new Error(`No suitable model found for task type: ${request.taskType}`);
        }

        // Multi-criteria decision making
        const scores = candidates.map(model => ({
            model,
            score: this.calculateModelScore(model, request)
        }));

        scores.sort((a, b) => b.score - a.score);
        return scores[0]!.model;
    }

    private calculateModelScore(model: AIModel, request: AIRequest): number {
        let score = 0;
        const weights = {
            specialty: 0.3,
            performance: 0.25,
            cost: 0.2,
            reliability: 0.15,
            load: 0.1
        };

        // Specialty match
        if (model.capabilities.includes(request.taskType)) {
            score += weights.specialty * 100;
        }

        // Performance requirements
        if (request.requirements.accuracy) {
            score += weights.performance * (model.reliability * 100);
        }
        if (request.requirements.speed) {
            score += weights.performance * (1 / model.responseTime * 20);
        }

        // Cost optimization
        if (request.requirements.cost) {
            score += weights.cost * (1 / model.costPerToken * 1000);
        }

        // Reliability
        score += weights.reliability * (model.reliability * 100);

        // Current load
        const loadFactor = 1 - (model.currentLoad / model.maxConcurrency);
        score += weights.load * (loadFactor * 100);

        return score;
    }

    private isModelSuitableForTask(model: AIModel, request: AIRequest): boolean {
        // Check if model has required capabilities
        const hasCapability = model.capabilities.some(cap =>
            cap === request.taskType ||
            (request.taskType === 'medical' && cap === 'medical') ||
            (request.taskType === 'legal' && cap === 'legal') ||
            (request.taskType === 'defense' && cap === 'security')
        );

        return hasCapability && model.isAvailable;
    }

    private isModelAvailable(model: AIModel): boolean {
        return model.isAvailable && model.currentLoad < model.maxConcurrency;
    }

    private async executeRequest(request: AIRequest, model: AIModel): Promise<AIResponse> {
        const startTime = Date.now();

        // Increment load
        model.currentLoad++;

        try {
            // Route to appropriate API based on provider
            let result;
            switch (model.provider) {
                case 'openai':
                    result = await this.executeOpenAIRequest(request, model);
                    break;
                case 'anthropic':
                    result = await this.executeAnthropicRequest(request, model);
                    break;
                case 'iris-custom':
                    result = await this.executeIRISRequest(request, model);
                    break;
                default:
                    throw new Error(`Unsupported provider: ${model.provider}`);
            }

            const processingTime = Date.now() - startTime;
            const cost = this.costOptimizer.calculateCost(model, result);

            return {
                modelUsed: model.id,
                result,
                confidence: 0.95, // Would be calculated based on model response
                processingTime,
                cost
            };
        } catch (error) {
            // Handle fallback
            if (request.fallbackAllowed) {
                const fallbackModel = this.fallbackManager.selectFallback(model, request);
                if (fallbackModel) {
                    return this.executeRequest(request, fallbackModel);
                }
            }
            throw error;
        } finally {
            // Decrement load
            model.currentLoad--;
        }
    }

    private async executeOpenAIRequest(request: AIRequest, model: AIModel): Promise<any> {
        // Implementation would call OpenAI API
        const response = await fetch('/api/ai/openai-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model.id,
                taskType: request.taskType,
                context: request.context,
                priority: request.priority
            })
        });
        return await response.json();
    }

    private async executeAnthropicRequest(request: AIRequest, model: AIModel): Promise<any> {
        // Implementation would call Anthropic API
        const response = await fetch('/api/ai/anthropic-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model.id,
                taskType: request.taskType,
                context: request.context,
                priority: request.priority
            })
        });
        return await response.json();
    }

    private async executeIRISRequest(request: AIRequest, model: AIModel): Promise<any> {
        // Route to existing IRIS endpoints
        let endpoint = '/api/iris/neural-synthesis';

        if (model.id === 'iris-medical') {
            endpoint = '/api/agents/medical-assistant';
        } else if (model.id === 'iris-defense') {
            endpoint = '/api/agents/defense-analysis';
        } else if (model.id === 'iris-legal') {
            endpoint = '/api/agents/legal-analysis';
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                inputs: { text: request.context },
                taskType: request.taskType,
                priority: request.priority
            })
        });
        return await response.json();
    }

    private startHealthMonitoring() {
        setInterval(() => {
            this.healthMonitor.checkModelHealth(this.models);
        }, 30000); // Check every 30 seconds
    }

    public getModelStatistics(): Record<string, any> {
        return Array.from(this.models.entries()).reduce((stats, [id, model]) => {
            stats[id] = {
                name: model.name,
                specialty: model.specialty,
                currentLoad: model.currentLoad,
                maxConcurrency: model.maxConcurrency,
                utilizationRate: (model.currentLoad / model.maxConcurrency) * 100,
                reliability: model.reliability,
                averageResponseTime: model.responseTime,
                isAvailable: model.isAvailable,
                costPerToken: model.costPerToken
            };
            return stats;
        }, {} as Record<string, any>);
    }
}

class LoadBalancer {
    public distributeLoad(models: AIModel[], request: AIRequest): AIModel | null {
        const availableModels = models.filter(model =>
            model.isAvailable && model.currentLoad < model.maxConcurrency
        );

        if (availableModels.length === 0) return null;

        // Round-robin with load consideration
        return availableModels.reduce((selected, current) => {
            const selectedLoad = selected.currentLoad / selected.maxConcurrency;
            const currentLoad = current.currentLoad / current.maxConcurrency;
            return currentLoad < selectedLoad ? current : selected;
        });
    }
}

class FallbackManager {
    private fallbackMap = new Map<string, string[]>([
        ['gpt-4-turbo', ['claude-3-opus', 'iris-medical']],
        ['claude-3-opus', ['gpt-4-turbo', 'iris-medical']],
        ['iris-medical', ['gpt-4-turbo', 'claude-3-opus']],
        ['iris-defense', ['gpt-4-turbo', 'claude-3-opus']],
        ['iris-legal', ['gpt-4-turbo', 'claude-3-opus']]
    ]);

    public selectFallback(failedModel: AIModel, request: AIRequest): AIModel | null {
        const fallbacks = this.fallbackMap.get(failedModel.id) || [];

        // Find first available fallback
        // Note: In production, this would reference the main orchestrator's model registry
        return null; // Placeholder - would implement proper fallback selection
    }
}

class CostOptimizer {
    public calculateCost(model: AIModel, result: any): number {
        // Simple token-based cost calculation
        const estimatedTokens = this.estimateTokens(result);
        return model.costPerToken * estimatedTokens;
    }

    private estimateTokens(result: any): number {
        // Rough estimation - in production, use actual token counts
        const text = JSON.stringify(result);
        return Math.ceil(text.length / 4); // ~4 characters per token
    }

    public getOptimalModel(models: AIModel[], request: AIRequest): AIModel | null {
        // Cost-performance optimization
        const candidates = models.filter(model =>
            model.isAvailable && model.currentLoad < model.maxConcurrency
        );

        if (candidates.length === 0) return null;

        // Balance cost and performance
        return candidates.reduce((optimal, current) => {
            const optimalScore = optimal.reliability / optimal.costPerToken;
            const currentScore = current.reliability / current.costPerToken;
            return currentScore > optimalScore ? current : optimal;
        });
    }
}

class HealthMonitor {
    private healthHistory: Map<string, number[]> = new Map();

    public checkModelHealth(models: Map<string, AIModel>): void {
        models.forEach(async (model) => {
            try {
                const health = await this.pingModel(model);
                model.isAvailable = health.isHealthy;
                model.responseTime = health.responseTime;
                model.reliability = health.reliability;

                // Update health history
                const history = this.healthHistory.get(model.id) || [];
                history.push(health.reliability);
                if (history.length > 10) history.shift(); // Keep last 10 readings
                this.healthHistory.set(model.id, history);

                // Calculate moving average reliability
                const avgReliability = history.reduce((sum, val) => sum + val, 0) / history.length;
                model.reliability = avgReliability;

            } catch (error) {
                model.isAvailable = false;
                console.error(`Model ${model.id} health check failed:`, error);
            }
        });
    }

    private async pingModel(model: AIModel): Promise<{
        isHealthy: boolean;
        responseTime: number;
        reliability: number;
    }> {
        const startTime = Date.now();

        try {
            // Health check endpoint for each provider
            let endpoint = '/api/health/general';

            if (model.provider === 'openai') {
                endpoint = '/api/health/openai';
            } else if (model.provider === 'anthropic') {
                endpoint = '/api/health/anthropic';
            } else if (model.provider === 'iris-custom') {
                endpoint = '/api/health/iris';
            }

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const responseTime = Date.now() - startTime;
            const isHealthy = response.ok;

            return {
                isHealthy,
                responseTime,
                reliability: isHealthy ? 0.99 : 0.5
            };
        } catch (error) {
            return {
                isHealthy: false,
                responseTime: Date.now() - startTime,
                reliability: 0
            };
        }
    }

    public getHealthMetrics(): Record<string, any> {
        const metrics: Record<string, any> = {};

        this.healthHistory.forEach((history, modelId) => {
            metrics[modelId] = {
                currentReliability: history[history.length - 1] || 0,
                averageReliability: history.reduce((sum, val) => sum + val, 0) / history.length,
                healthTrend: this.calculateTrend(history),
                lastChecked: new Date().toISOString()
            };
        });

        return metrics;
    }

    private calculateTrend(history: number[]): 'improving' | 'stable' | 'declining' {
        if (history.length < 3) return 'stable';

        const recent = history.slice(-3);
        const older = history.slice(-6, -3);

        const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
        const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;

        if (recentAvg > olderAvg + 0.05) return 'improving';
        if (recentAvg < olderAvg - 0.05) return 'declining';
        return 'stable';
    }
}

// Export singleton
export const unifiedAIOrchestrator = new UnifiedAIOrchestrator();

// Export utility functions
export const createAIRequest = (
    taskType: AIRequest['taskType'],
    context: string,
    priority: AIRequest['priority'] = 'medium',
    requirements: AIRequest['requirements'] = {},
    fallbackAllowed: boolean = true
): AIRequest => ({
    taskType,
    context,
    priority,
    requirements,
    fallbackAllowed
});

export const getModelRecommendation = (taskType: string): string[] => {
    const recommendations: Record<string, string[]> = {
        'medical': ['iris-medical', 'gpt-4-turbo', 'claude-3-opus'],
        'legal': ['iris-legal', 'gpt-4-turbo', 'claude-3-opus'],
        'defense': ['iris-defense', 'gpt-4-turbo', 'claude-3-opus'],
        'creative': ['claude-3-opus', 'gpt-4-turbo', 'iris-medical'],
        'reasoning': ['gpt-4-turbo', 'claude-3-opus', 'iris-medical'],
        'analysis': ['gpt-4-turbo', 'iris-medical', 'claude-3-opus']
    };

    return recommendations[taskType] || ['gpt-4-turbo', 'claude-3-opus'];
}; 