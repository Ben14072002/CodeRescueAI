import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      {/* Maze Pattern */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        fill="none"
      >
        {/* Top maze section */}
        <g className="maze-top">
          <path d="M20 15 L45 15 L45 25 L35 25 L35 20 L25 20 L25 30 L40 30 L40 35 L20 35 Z" 
                fill="currentColor" 
                className="text-blue-400 animate-pulse-slow" />
          <path d="M50 15 L75 15 L75 25 L65 25 L65 20 L55 20 L55 30 L70 30 L70 35 L50 35 Z" 
                fill="currentColor" 
                className="text-cyan-400 animate-pulse-slow delay-100" />
        </g>
        
        {/* Center breakthrough path */}
        <g className="breakthrough-path">
          <path d="M15 40 L85 40 L85 45 L15 45 Z" 
                fill="currentColor" 
                className="text-green-400 animate-glow" />
          <circle cx="50" cy="42.5" r="2" 
                  fill="currentColor" 
                  className="text-emerald-300 animate-ping" />
        </g>
        
        {/* Bottom maze section */}
        <g className="maze-bottom">
          <path d="M20 50 L45 50 L45 60 L35 60 L35 55 L25 55 L25 65 L40 65 L40 70 L20 70 Z" 
                fill="currentColor" 
                className="text-teal-400 animate-pulse-slow delay-200" />
          <path d="M50 50 L75 50 L75 60 L65 60 L65 55 L55 55 L55 65 L70 65 L70 70 L50 70 Z" 
                fill="currentColor" 
                className="text-blue-500 animate-pulse-slow delay-300" />
        </g>
        
        {/* Corner connectors */}
        <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-blue-300 animate-pulse" />
        <circle cx="80" cy="20" r="1.5" fill="currentColor" className="text-cyan-300 animate-pulse delay-75" />
        <circle cx="20" cy="65" r="1.5" fill="currentColor" className="text-teal-300 animate-pulse delay-150" />
        <circle cx="80" cy="65" r="1.5" fill="currentColor" className="text-blue-400 animate-pulse delay-225" />
      </svg>
    </div>
  );
}

export function LogoWithText({ className = '', size = 'md' }: LogoProps) {
  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo size={size} />
      <span className={`font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent ${textSizes[size]}`}>
        CODEBREAKER
      </span>
    </div>
  );
}