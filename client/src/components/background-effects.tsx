import React from 'react';

export function MazeBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated maze grid */}
      <div className="absolute inset-0 maze-pattern animate-maze-shift opacity-30" />
      
      {/* Circuit flowing lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-circuit-flow"
            style={{
              top: `${20 + i * 15}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
      </div>
      
      {/* Breakthrough effect */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-400/0 via-green-400/80 to-green-400/0 animate-breakthrough" />
      
      {/* Corner maze fragments */}
      <div className="absolute top-10 left-10 w-20 h-20 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse-slow">
          <path d="M10 10 L90 10 L90 30 L70 30 L70 50 L50 50 L50 70 L30 70 L30 90 L10 90 Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="text-cyan-400" />
        </svg>
      </div>
      
      <div className="absolute bottom-10 right-10 w-20 h-20 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse-slow delay-1000">
          <path d="M90 90 L10 90 L10 70 L30 70 L30 50 L50 50 L50 30 L70 30 L70 10 L90 10 Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="text-teal-400" />
        </svg>
      </div>
      
      {/* Floating circuit nodes */}
      <div className="absolute inset-0 circuit-lines animate-maze-shift" />
    </div>
  );
}

export function HoverMazeEffect({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`group relative overflow-hidden ${className}`}>
      {children}
      
      {/* Hover breakthrough line */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent transform -translate-y-1/2 animate-breakthrough" />
        
        {/* Corner maze highlights */}
        <div className="absolute top-2 left-2 w-4 h-4">
          <svg viewBox="0 0 20 20" className="w-full h-full">
            <path d="M2 2 L18 2 L18 6 L14 6 L14 10 L10 10 L10 14 L6 14 L6 18 L2 18 Z" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  className="text-blue-400 animate-pulse" />
          </svg>
        </div>
        
        <div className="absolute bottom-2 right-2 w-4 h-4">
          <svg viewBox="0 0 20 20" className="w-full h-full">
            <path d="M18 18 L2 18 L2 14 L6 14 L6 10 L10 10 L10 6 L14 6 L14 2 L18 2 Z" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  className="text-cyan-400 animate-pulse" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function LoadingMaze() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin">
          <path d="M20 20 L80 20 L80 40 L60 40 L60 60 L40 60 L40 80 L20 80 Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round"
                className="text-blue-400" />
        </svg>
        
        {/* Center breakthrough */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
        </div>
      </div>
    </div>
  );
}