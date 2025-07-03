/**
 * AGENTone Integration Store for IRIS-AI Enterprise
 * Centralized state management for agent orchestration, provider management, and real-time updates
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface AgentProvider {
    id: string;
    name: string;
    type: 'ai_model' | 'data_source' | 'service' | 'integration';
    status: 'active' | 'inactive' | 'error' | 'connecting';
    config: {
        endpoint?: string;
        apiKey?: string;
        region?: string;
        version?: string;
        capabilities: string[];
        rateLimits: {
            requestsPerMinute: number;
            tokensPerMinute: number;
            concurrent: number;
        };
    };
    metrics: {
        uptime: number;
        latency: number;
        errorRate: number;
        throughput: number;
        lastUpdate: Date;
    };
    health: {
        isHealthy: boolean;
        lastCheck: Date;
        issues: string[];
    };
}

export interface AgentTask {
    id: string;
    agentId: string;
    type: 'immediate' | 'scheduled' | 'recurring' | 'conditional';
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    input: any;
    output?: any;
    error?: string;
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    retryCount: number;
    maxRetries: number;
    dependencies: string[];
    metadata: {
        requiredCapabilities: string[];
        estimatedDuration: number;
        resourceRequirements: {
            cpu: number;
            memory: number;
            gpu: boolean;
        };
    };
}

export interface AgentWorkflow {
    id: string;
    name: string;
    description: string;
    steps: {
        id: string;
        agentId: string;
        action: string;
        config: any;
        dependencies: string[];
        condition?: string;
    }[];
    status: 'draft' | 'active' | 'paused' | 'completed' | 'failed';
    trigger: {
        type: 'manual' | 'scheduled' | 'event' | 'webhook';
        config: any;
    };
    variables: Record<string, any>;
    metrics: {
        executionCount: number;
        successRate: number;
        averageDuration: number;
        lastExecution?: Date;
    };
}

export interface SystemMetrics {
    totalAgents: number;
    activeAgents: number;
    runningTasks: number;
    completedTasks: number;
    failedTasks: number;
    systemLoad: {
        cpu: number;
        memory: number;
        network: number;
        storage: number;
    };
    performance: {
        averageResponseTime: number;
        throughput: number;
        errorRate: number;
        uptime: number;
    };
    resources: {
        tokensUsed: number;
        apiCalls: number;
        dataProcessed: number;
        cost: number;
    };
}

interface AGENToneState {
    // Core State
    agents: AgentBlueprint[];
    providers: AgentProvider[];
    tasks: AgentTask[];
    workflows: AgentWorkflow[];

    // UI State
    selectedAgent: AgentBlueprint | null;
    selectedProvider: AgentProvider | null;
    activeView: 'laboratory' | 'dashboard' | 'workflows' | 'providers' | 'analytics';
    isLoading: boolean;
    error: string | null;

    // Real-time State
    systemMetrics: SystemMetrics;
    notifications: Array<{
        id: string;
        type: 'info' | 'warning' | 'error' | 'success';
        title: string;
        message: string;
        timestamp: Date;
        read: boolean;
    }>;

    // Actions
    setSelectedAgent: (agent: AgentBlueprint | null) => void;
    setSelectedProvider: (provider: AgentProvider | null) => void;
    setActiveView: (view: string) => void;

    // Agent Management
    addAgent: (agent: Omit<AgentBlueprint, 'id'>) => void;
    updateAgent: (id: string, updates: Partial<AgentBlueprint>) => void;
    deleteAgent: (id: string) => void;
    deployAgent: (id: string) => Promise<void>;

    // Provider Management
    addProvider: (provider: Omit<AgentProvider, 'id'>) => void;
    updateProvider: (id: string, updates: Partial<AgentProvider>) => void;
    deleteProvider: (id: string) => void;
    testProviderConnection: (id: string) => Promise<boolean>;

    // Task Management
    createTask: (task: Omit<AgentTask, 'id' | 'createdAt'>) => void;
    executeTask: (taskId: string) => Promise<void>;
    cancelTask: (taskId: string) => void;
    retryTask: (taskId: string) => void;

    // Workflow Management
    createWorkflow: (workflow: Omit<AgentWorkflow, 'id'>) => void;
    executeWorkflow: (workflowId: string) => Promise<void>;
    pauseWorkflow: (workflowId: string) => void;
    resumeWorkflow: (workflowId: string) => void;

    // System Management
    refreshMetrics: () => void;
    addNotification: (notification: Omit<AGENToneState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void;
    markNotificationRead: (id: string) => void;
    clearNotifications: () => void;

    // Real-time Updates
    startRealTimeUpdates: () => void;
    stopRealTimeUpdates: () => void;
}

interface AgentBlueprint {
    id: string;
    name: string;
    type: 'cognitive' | 'reactive' | 'hybrid' | 'swarm' | 'specialist';
    description: string;
    capabilities: string[];
    models: string[];
    parameters: {
        autonomy: number;
        creativity: number;
        precision: number;
        collaboration: number;
        learning: number;
    };
    status: 'draft' | 'testing' | 'deployed' | 'retired';
    performance: {
        successRate: number;
        averageResponseTime: number;
        resourceUsage: number;
        userRating: number;
    };
}

export const useAGENToneStore = create<AGENToneState>()(
    subscribeWithSelector((set, get) => ({
        // Initial State
        agents: [],
        providers: [],
        tasks: [],
        workflows: [],
        selectedAgent: null,
        selectedProvider: null,
        activeView: 'laboratory',
        isLoading: false,
        error: null,
        systemMetrics: {
            totalAgents: 0,
            activeAgents: 0,
            runningTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            systemLoad: { cpu: 0, memory: 0, network: 0, storage: 0 },
            performance: { averageResponseTime: 0, throughput: 0, errorRate: 0, uptime: 0 },
            resources: { tokensUsed: 0, apiCalls: 0, dataProcessed: 0, cost: 0 }
        },
        notifications: [],

        // UI Actions
        setSelectedAgent: (agent) => set({ selectedAgent: agent }),
        setSelectedProvider: (provider) => set({ selectedProvider: provider }),
        setActiveView: (view) => set({ activeView: view as any }),

        // Agent Management
        addAgent: (agentData) => {
            const newAgent: AgentBlueprint = {
                ...agentData,
                id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            };

            set((state) => ({
                agents: [...state.agents, newAgent],
                systemMetrics: {
                    ...state.systemMetrics,
                    totalAgents: state.systemMetrics.totalAgents + 1
                }
            }));

            get().addNotification({
                type: 'success',
                title: 'Agent Created',
                message: `${newAgent.name} has been successfully created`
            });
        },

        updateAgent: (id, updates) => {
            set((state) => ({
                agents: state.agents.map(agent =>
                    agent.id === id ? { ...agent, ...updates } : agent
                )
            }));
        },

        deleteAgent: (id) => {
            const agent = get().agents.find(a => a.id === id);
            if (!agent) return;

            set((state) => ({
                agents: state.agents.filter(a => a.id !== id),
                selectedAgent: state.selectedAgent?.id === id ? null : state.selectedAgent,
                systemMetrics: {
                    ...state.systemMetrics,
                    totalAgents: Math.max(0, state.systemMetrics.totalAgents - 1),
                    activeAgents: agent.status === 'deployed'
                        ? Math.max(0, state.systemMetrics.activeAgents - 1)
                        : state.systemMetrics.activeAgents
                }
            }));

            get().addNotification({
                type: 'info',
                title: 'Agent Deleted',
                message: `${agent.name} has been removed from the system`
            });
        },

        deployAgent: async (id) => {
            const agent = get().agents.find(a => a.id === id);
            if (!agent) return;

            set({ isLoading: true });

            try {
                // Simulate deployment process
                await new Promise(resolve => setTimeout(resolve, 2000));

                set((state) => ({
                    agents: state.agents.map(a =>
                        a.id === id ? { ...a, status: 'deployed' as const } : a
                    ),
                    systemMetrics: {
                        ...state.systemMetrics,
                        activeAgents: state.systemMetrics.activeAgents + 1
                    },
                    isLoading: false
                }));

                get().addNotification({
                    type: 'success',
                    title: 'Agent Deployed',
                    message: `${agent.name} is now active and ready for use`
                });

            } catch (error) {
                set({ isLoading: false });
                get().addNotification({
                    type: 'error',
                    title: 'Deployment Failed',
                    message: `Failed to deploy ${agent.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
                });
            }
        },

        // Provider Management
        addProvider: (providerData) => {
            const newProvider: AgentProvider = {
                ...providerData,
                id: `provider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            };

            set((state) => ({
                providers: [...state.providers, newProvider]
            }));

            get().addNotification({
                type: 'success',
                title: 'Provider Added',
                message: `${newProvider.name} provider has been configured`
            });
        },

        updateProvider: (id, updates) => {
            set((state) => ({
                providers: state.providers.map(provider =>
                    provider.id === id ? { ...provider, ...updates } : provider
                )
            }));
        },

        deleteProvider: (id) => {
            const provider = get().providers.find(p => p.id === id);
            if (!provider) return;

            set((state) => ({
                providers: state.providers.filter(p => p.id !== id),
                selectedProvider: state.selectedProvider?.id === id ? null : state.selectedProvider
            }));

            get().addNotification({
                type: 'info',
                title: 'Provider Removed',
                message: `${provider.name} provider has been disconnected`
            });
        },

        testProviderConnection: async (id) => {
            const provider = get().providers.find(p => p.id === id);
            if (!provider) return false;

            set((state) => ({
                providers: state.providers.map(p =>
                    p.id === id ? { ...p, status: 'connecting' as const } : p
                )
            }));

            try {
                // Simulate connection test
                await new Promise(resolve => setTimeout(resolve, 1500));

                const isHealthy = Math.random() > 0.2; // 80% success rate

                set((state) => ({
                    providers: state.providers.map(p =>
                        p.id === id ? {
                            ...p,
                            status: isHealthy ? 'active' as const : 'error' as const,
                            health: {
                                isHealthy,
                                lastCheck: new Date(),
                                issues: isHealthy ? [] : ['Connection timeout']
                            }
                        } : p
                    )
                }));

                get().addNotification({
                    type: isHealthy ? 'success' : 'error',
                    title: 'Connection Test',
                    message: `${provider.name}: ${isHealthy ? 'Connection successful' : 'Connection failed'}`
                });

                return isHealthy;
            } catch (error) {
                set((state) => ({
                    providers: state.providers.map(p =>
                        p.id === id ? { ...p, status: 'error' as const } : p
                    )
                }));
                return false;
            }
        },

        // Task Management
        createTask: (taskData) => {
            const newTask: AgentTask = {
                ...taskData,
                id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date()
            };

            set((state) => ({
                tasks: [...state.tasks, newTask]
            }));
        },

        executeTask: async (taskId) => {
            const task = get().tasks.find(t => t.id === taskId);
            if (!task) return;

            set((state) => ({
                tasks: state.tasks.map(t =>
                    t.id === taskId ? {
                        ...t,
                        status: 'running' as const,
                        startedAt: new Date()
                    } : t
                ),
                systemMetrics: {
                    ...state.systemMetrics,
                    runningTasks: state.systemMetrics.runningTasks + 1
                }
            }));

            try {
                // Simulate task execution
                const executionTime = Math.random() * 5000 + 1000; // 1-6 seconds
                await new Promise(resolve => setTimeout(resolve, executionTime));

                const success = Math.random() > 0.1; // 90% success rate

                set((state) => ({
                    tasks: state.tasks.map(t =>
                        t.id === taskId ? {
                            ...t,
                            status: success ? 'completed' as const : 'failed' as const,
                            completedAt: new Date(),
                            output: success ? { result: 'Task completed successfully' } : undefined,
                            error: success ? undefined : 'Task execution failed'
                        } : t
                    ),
                    systemMetrics: {
                        ...state.systemMetrics,
                        runningTasks: Math.max(0, state.systemMetrics.runningTasks - 1),
                        completedTasks: success ? state.systemMetrics.completedTasks + 1 : state.systemMetrics.completedTasks,
                        failedTasks: success ? state.systemMetrics.failedTasks : state.systemMetrics.failedTasks + 1
                    }
                }));

            } catch (error) {
                set((state) => ({
                    tasks: state.tasks.map(t =>
                        t.id === taskId ? {
                            ...t,
                            status: 'failed' as const,
                            completedAt: new Date(),
                            error: error instanceof Error ? error.message : 'Unknown error'
                        } : t
                    ),
                    systemMetrics: {
                        ...state.systemMetrics,
                        runningTasks: Math.max(0, state.systemMetrics.runningTasks - 1),
                        failedTasks: state.systemMetrics.failedTasks + 1
                    }
                }));
            }
        },

        cancelTask: (taskId) => {
            set((state) => ({
                tasks: state.tasks.map(t =>
                    t.id === taskId ? { ...t, status: 'cancelled' as const } : t
                )
            }));
        },

        retryTask: (taskId) => {
            const task = get().tasks.find(t => t.id === taskId);
            if (!task || task.retryCount >= task.maxRetries) return;

            set((state) => ({
                tasks: state.tasks.map(t =>
                    t.id === taskId ? {
                        ...t,
                        status: 'pending' as const,
                        retryCount: t.retryCount + 1,
                        error: undefined
                    } : t
                )
            }));

            // Auto-execute retry
            setTimeout(() => get().executeTask(taskId), 1000);
        },

        // Workflow Management
        createWorkflow: (workflowData) => {
            const newWorkflow: AgentWorkflow = {
                ...workflowData,
                id: `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            };

            set((state) => ({
                workflows: [...state.workflows, newWorkflow]
            }));

            get().addNotification({
                type: 'success',
                title: 'Workflow Created',
                message: `${newWorkflow.name} workflow is ready for execution`
            });
        },

        executeWorkflow: async (workflowId) => {
            // Implementation would execute workflow steps
            get().addNotification({
                type: 'info',
                title: 'Workflow Started',
                message: 'Workflow execution has begun'
            });
        },

        pauseWorkflow: (workflowId) => {
            set((state) => ({
                workflows: state.workflows.map(w =>
                    w.id === workflowId ? { ...w, status: 'paused' as const } : w
                )
            }));
        },

        resumeWorkflow: (workflowId) => {
            set((state) => ({
                workflows: state.workflows.map(w =>
                    w.id === workflowId ? { ...w, status: 'active' as const } : w
                )
            }));
        },

        // System Management
        refreshMetrics: () => {
            const state = get();
            const newMetrics: SystemMetrics = {
                totalAgents: state.agents.length,
                activeAgents: state.agents.filter(a => a.status === 'deployed').length,
                runningTasks: state.tasks.filter(t => t.status === 'running').length,
                completedTasks: state.tasks.filter(t => t.status === 'completed').length,
                failedTasks: state.tasks.filter(t => t.status === 'failed').length,
                systemLoad: {
                    cpu: Math.random() * 100,
                    memory: Math.random() * 100,
                    network: Math.random() * 100,
                    storage: Math.random() * 100
                },
                performance: {
                    averageResponseTime: Math.random() * 2000 + 500,
                    throughput: Math.random() * 1000 + 100,
                    errorRate: Math.random() * 5,
                    uptime: 99.9
                },
                resources: {
                    tokensUsed: Math.floor(Math.random() * 100000),
                    apiCalls: Math.floor(Math.random() * 10000),
                    dataProcessed: Math.floor(Math.random() * 1000),
                    cost: Math.random() * 1000
                }
            };

            set({ systemMetrics: newMetrics });
        },

        addNotification: (notification) => {
            const newNotification = {
                ...notification,
                id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
                read: false
            };

            set((state) => ({
                notifications: [newNotification, ...state.notifications].slice(0, 100) // Keep only 100 latest
            }));
        },

        markNotificationRead: (id) => {
            set((state) => ({
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                )
            }));
        },

        clearNotifications: () => {
            set({ notifications: [] });
        },

        // Real-time Updates
        startRealTimeUpdates: () => {
            // Start periodic updates
            const interval = setInterval(() => {
                get().refreshMetrics();
            }, 10000); // Update every 10 seconds

            // Store interval ID for cleanup
            (globalThis as any).agentoneUpdateInterval = interval;
        },

        stopRealTimeUpdates: () => {
            if ((globalThis as any).agentoneUpdateInterval) {
                clearInterval((globalThis as any).agentoneUpdateInterval);
                delete (globalThis as any).agentoneUpdateInterval;
            }
        }
    }))
);

// Selectors for optimized subscriptions
export const useAgents = () => useAGENToneStore(state => state.agents);
export const useProviders = () => useAGENToneStore(state => state.providers);
export const useTasks = () => useAGENToneStore(state => state.tasks);
export const useWorkflows = () => useAGENToneStore(state => state.workflows);
export const useSystemMetrics = () => useAGENToneStore(state => state.systemMetrics);
export const useNotifications = () => useAGENToneStore(state => state.notifications);

// Initialize store with sample data
useAGENToneStore.getState().addProvider({
    name: 'OpenAI GPT-4',
    type: 'ai_model',
    status: 'active',
    config: {
        endpoint: 'https://api.openai.com/v1',
        capabilities: ['text-generation', 'reasoning', 'code'],
        rateLimits: { requestsPerMinute: 3500, tokensPerMinute: 90000, concurrent: 10 }
    },
    metrics: {
        uptime: 99.9,
        latency: 1200,
        errorRate: 0.1,
        throughput: 850,
        lastUpdate: new Date()
    },
    health: {
        isHealthy: true,
        lastCheck: new Date(),
        issues: []
    }
});

// Start real-time updates
useAGENToneStore.getState().startRealTimeUpdates(); 