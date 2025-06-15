"use client"

import type React from "react"

const ExecutiveAnimatedBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-navy-950">
      <div className="absolute inset-0 executive-gradient opacity-90"></div>

      {/* Geometric patterns for professional look */}
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(234, 179, 8, 0.1)" strokeWidth="1" />
            </pattern>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(234, 179, 8, 0.1)" />
              <stop offset="100%" stopColor="rgba(245, 158, 11, 0.05)" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating geometric shapes */}
      <div className="floating-shapes">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="floating-shape"
            style={
              {
                "--shape-left": `${Math.random() * 100}%`,
                "--shape-duration": `${15 + Math.random() * 20}s`,
                "--shape-delay": `${Math.random() * 10}s`,
                "--shape-size": `${20 + Math.random() * 40}px`,
                "--shape-opacity": `${0.03 + Math.random() * 0.07}`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Subtle light rays */}
      <div className="light-rays">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="light-ray"
            style={
              {
                "--ray-left": `${20 + i * 20}%`,
                "--ray-duration": `${8 + Math.random() * 4}s`,
                "--ray-delay": `${Math.random() * 3}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <style jsx>{`
        .floating-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .floating-shape {
          position: absolute;
          left: var(--shape-left);
          top: -10%;
          width: var(--shape-size);
          height: var(--shape-size);
          background: linear-gradient(45deg, rgba(234, 179, 8, var(--shape-opacity)), rgba(245, 158, 11, var(--shape-opacity)));
          border-radius: 4px;
          opacity: var(--shape-opacity);
          animation: floatUp var(--shape-duration) var(--shape-delay) linear infinite;
          transform: rotate(45deg);
        }
        .light-rays {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .light-ray {
          position: absolute;
          left: var(--ray-left);
          top: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, 
            transparent, 
            rgba(234, 179, 8, 0.1) 20%, 
            rgba(234, 179, 8, 0.05) 50%, 
            transparent 80%
          );
          animation: rayPulse var(--ray-duration) var(--ray-delay) ease-in-out infinite;
        }
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) rotate(45deg) scale(0);
            opacity: 0;
          }
          10% {
            opacity: var(--shape-opacity);
            transform: translateY(90vh) rotate(45deg) scale(1);
          }
          90% {
            opacity: var(--shape-opacity);
            transform: translateY(-10vh) rotate(405deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20vh) rotate(405deg) scale(0);
          }
        }
        @keyframes rayPulse {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  )
}

export default ExecutiveAnimatedBackground
