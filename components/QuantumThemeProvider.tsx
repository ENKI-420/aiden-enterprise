"use client";

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface QuantumTheme {
    name: string;
    colors: {
        quantum: {
            primary: string;
            secondary: string;
            accent: string;
            plasma: string;
            field: string;
            dimensional: string;
        };
        gradients: {
            quantum: string;
            neural: string;
            plasma: string;
            dimensional: string;
        };
        shadows: {
            quantum: string;
            glow: string;
            neural: string;
        };
    };
    animations: {
        quantum: string;
        plasma: string;
        neural: string;
    };
}

const quantumThemes: Record<string, QuantumTheme> = {
    'quantum-dark': {
        name: 'Quantum Dark',
        colors: {
            quantum: {
                primary: '#00FFFF',
                secondary: '#0EA5E9',
                accent: '#3B82F6',
                plasma: '#06B6D4',
                field: '#8B5CF6',
                dimensional: '#10B981'
            },
            gradients: {
                quantum: 'linear-gradient(135deg, #00FFFF 0%, #0EA5E9 50%, #3B82F6 100%)',
                neural: 'linear-gradient(45deg, #8B5CF6, #06B6D4, #00FFFF, #10B981)',
                plasma: 'linear-gradient(90deg, #00FFFF, #06B6D4, #0EA5E9)',
                dimensional: 'linear-gradient(180deg, #0F172A, #1E293B, #334155)'
            },
            shadows: {
                quantum: '0 0 20px rgba(0, 255, 255, 0.3)',
                glow: '0 0 40px rgba(14, 165, 233, 0.6)',
                neural: '0 0 30px rgba(139, 92, 246, 0.4)'
            }
        },
        animations: {
            quantum: 'quantumPulse 3s ease-in-out infinite',
            plasma: 'plasmaFlow 4s linear infinite',
            neural: 'neuralSync 2s ease-in-out infinite alternate'
        }
    },
    'quantum-light': {
        name: 'Quantum Light',
        colors: {
            quantum: {
                primary: '#0EA5E9',
                secondary: '#3B82F6',
                accent: '#06B6D4',
                plasma: '#00FFFF',
                field: '#6366F1',
                dimensional: '#10B981'
            },
            gradients: {
                quantum: 'linear-gradient(135deg, #0EA5E9 0%, #3B82F6 50%, #06B6D4 100%)',
                neural: 'linear-gradient(45deg, #6366F1, #3B82F6, #0EA5E9, #10B981)',
                plasma: 'linear-gradient(90deg, #0EA5E9, #3B82F6, #06B6D4)',
                dimensional: 'linear-gradient(180deg, #F8FAFC, #E2E8F0, #CBD5E1)'
            },
            shadows: {
                quantum: '0 0 20px rgba(14, 165, 233, 0.2)',
                glow: '0 0 40px rgba(59, 130, 246, 0.4)',
                neural: '0 0 30px rgba(99, 102, 241, 0.3)'
            }
        },
        animations: {
            quantum: 'quantumPulse 3s ease-in-out infinite',
            plasma: 'plasmaFlow 4s linear infinite',
            neural: 'neuralSync 2s ease-in-out infinite alternate'
        }
    }
};

interface QuantumThemeContextType {
    currentTheme: QuantumTheme;
    switchTheme: (themeName: string) => void;
    applyQuantumEffect: (element: HTMLElement, effect: string) => void;
    generateQuantumGradient: (type: keyof QuantumTheme['colors']['gradients']) => string;
}

const QuantumThemeContext = createContext<QuantumThemeContextType | undefined>(undefined);

export const useQuantumTheme = () => {
    const context = useContext(QuantumThemeContext);
    if (!context) {
        throw new Error('useQuantumTheme must be used within a QuantumThemeProvider');
    }
    return context;
};

interface QuantumThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: string;
}

export default function QuantumThemeProvider({
    children,
    defaultTheme = 'quantum-dark'
}: QuantumThemeProviderProps) {
    const [currentThemeName, setCurrentThemeName] = useState(defaultTheme);
    const currentTheme = quantumThemes[currentThemeName];

    useEffect(() => {
        if (!currentTheme) return;

        // Apply quantum CSS variables to document root
        const root = document.documentElement;
        const theme = currentTheme;

        // Set quantum color variables
        Object.entries(theme.colors.quantum).forEach(([key, value]) => {
            root.style.setProperty(`--quantum-${key}`, value);
        });

        // Set gradient variables
        Object.entries(theme.colors.gradients).forEach(([key, value]) => {
            root.style.setProperty(`--gradient-${key}`, value);
        });

        // Set shadow variables
        Object.entries(theme.colors.shadows).forEach(([key, value]) => {
            root.style.setProperty(`--shadow-${key}`, value);
        });

        // Add quantum animations to stylesheet
        const style = document.createElement('style');
        style.textContent = `
      @keyframes quantumPulse {
        0%, 100% { 
          opacity: 0.7; 
          transform: scale(1); 
          filter: brightness(1);
        }
        50% { 
          opacity: 1; 
          transform: scale(1.05); 
          filter: brightness(1.3);
        }
      }

      @keyframes plasmaFlow {
        0% { 
          background-position: 0% 50%; 
          filter: hue-rotate(0deg);
        }
        50% { 
          background-position: 100% 50%; 
          filter: hue-rotate(180deg);
        }
        100% { 
          background-position: 0% 50%; 
          filter: hue-rotate(360deg);
        }
      }

      @keyframes neuralSync {
        0% { 
          transform: translateY(0px) rotate(0deg); 
          opacity: 0.6;
        }
        100% { 
          transform: translateY(-10px) rotate(180deg); 
          opacity: 1;
        }
      }

      @keyframes quantumShimmer {
        0% { background-position: -200px 0; }
        100% { background-position: calc(200px + 100%) 0; }
      }

      @keyframes dimensionalPhase {
        0%, 100% { 
          transform: rotateY(0deg) rotateX(0deg); 
          filter: hue-rotate(0deg);
        }
        33% { 
          transform: rotateY(120deg) rotateX(10deg); 
          filter: hue-rotate(120deg);
        }
        66% { 
          transform: rotateY(240deg) rotateX(-10deg); 
          filter: hue-rotate(240deg);
        }
      }

      .quantum-glow {
        box-shadow: var(--shadow-quantum);
        transition: box-shadow 0.3s ease;
      }

      .quantum-glow:hover {
        box-shadow: var(--shadow-glow);
      }

      .neural-glow {
        box-shadow: var(--shadow-neural);
        animation: ${theme.animations.neural};
      }

      .quantum-gradient {
        background: var(--gradient-quantum);
        background-size: 200% 200%;
        animation: ${theme.animations.plasma};
      }

      .neural-gradient {
        background: var(--gradient-neural);
        background-size: 400% 400%;
        animation: ${theme.animations.plasma};
      }

      .plasma-gradient {
        background: var(--gradient-plasma);
        background-size: 300% 300%;
        animation: ${theme.animations.plasma};
      }

      .dimensional-gradient {
        background: var(--gradient-dimensional);
      }

      .quantum-shimmer {
        background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent);
        background-size: 200px 100%;
        animation: quantumShimmer 1.5s infinite;
      }

      .quantum-phase {
        animation: dimensionalPhase 6s ease-in-out infinite;
        transform-style: preserve-3d;
      }

      .quantum-pulse {
        animation: ${theme.animations.quantum};
      }

      .quantum-text {
        background: var(--gradient-quantum);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-size: 200% 200%;
        animation: ${theme.animations.plasma};
      }

      .quantum-border {
        border: 1px solid transparent;
        background: linear-gradient(var(--gradient-dimensional), var(--gradient-dimensional)) padding-box,
                    var(--gradient-quantum) border-box;
      }

      .quantum-card {
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(0, 255, 255, 0.2);
        box-shadow: var(--shadow-quantum);
        transition: all 0.3s ease;
      }

      .quantum-card:hover {
        border-color: rgba(0, 255, 255, 0.4);
        box-shadow: var(--shadow-glow);
        transform: translateY(-2px);
      }

      .quantum-button {
        background: var(--gradient-quantum);
        border: none;
        color: white;
        font-weight: 600;
        box-shadow: var(--shadow-quantum);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .quantum-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }

      .quantum-button:hover::before {
        left: 100%;
      }

      .quantum-button:hover {
        box-shadow: var(--shadow-glow);
        transform: translateY(-1px);
      }
    `;

        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, [currentTheme]);

    const switchTheme = (themeName: string) => {
        if (quantumThemes[themeName]) {
            setCurrentThemeName(themeName);
        }
    };

    const applyQuantumEffect = (element: HTMLElement, effect: string) => {
        const effects = {
            glow: 'quantum-glow',
            pulse: 'quantum-pulse',
            shimmer: 'quantum-shimmer',
            phase: 'quantum-phase',
            gradient: 'quantum-gradient',
            neural: 'neural-gradient',
            plasma: 'plasma-gradient'
        };

        const className = effects[effect as keyof typeof effects];
        if (className) {
            element.classList.add(className);
        }
    };

    const generateQuantumGradient = (type: keyof QuantumTheme['colors']['gradients']) => {
        if (!currentTheme) return '';
        return currentTheme.colors.gradients[type];
    };

    if (!currentTheme) {
        return <div>Loading quantum theme...</div>;
    }

    const contextValue: QuantumThemeContextType = {
        currentTheme,
        switchTheme,
        applyQuantumEffect,
        generateQuantumGradient
    };

    return (
        <NextThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
        >
            <QuantumThemeContext.Provider value={contextValue}>
                <div className="quantum-app">
                    {children}
                </div>
            </QuantumThemeContext.Provider>
        </NextThemeProvider>
    );
} 