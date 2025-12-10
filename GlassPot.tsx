import React from 'react';
import { motion } from 'framer-motion';

interface GlassPotProps {
  isAnalyzing: boolean;
  intensity?: number;
  color?: string;
}

export const GlassPot: React.FC<GlassPotProps> = ({ isAnalyzing, intensity = 0.5, color = '#fbbf24' }) => {
  // Determine particle speed and count based on intensity
  const particleCount = isAnalyzing ? 8 : 3;
  
  return (
    <div className="relative w-64 h-64 mx-auto my-8">
      {/* Pot Rim */}
      <div className="absolute top-0 left-0 w-full h-full rounded-full border border-white/20 z-20 pointer-events-none shadow-[0_0_40px_rgba(255,255,255,0.1)_inset]"></div>
      
      {/* Glass Reflection */}
      <div className="absolute top-4 left-4 w-56 h-56 rounded-full bg-gradient-to-br from-white/10 to-transparent z-30 pointer-events-none"></div>

      {/* The Liquid/Mood Core */}
      <motion.div 
        className="absolute inset-2 rounded-full blur-2xl opacity-60 mix-blend-screen"
        animate={{
          backgroundColor: isAnalyzing ? [color, '#e11d48', '#4f46e5', color] : color,
          scale: isAnalyzing ? [1, 1.1, 0.9, 1] : 1,
        }}
        transition={{
          duration: isAnalyzing ? 4 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
            backgroundColor: color
        }}
      />

      {/* Particles */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full bg-white opacity-40 blur-sm"
          initial={{ 
            x: "50%", 
            y: "50%", 
            scale: 0 
          }}
          animate={{
            x: [
              "50%", 
              `${50 + (Math.random() - 0.5) * 80}%`, 
              `${50 + (Math.random() - 0.5) * 80}%`
            ],
            y: [
              "50%", 
              `${50 + (Math.random() - 0.5) * 80}%`, 
              `${50 + (Math.random() - 0.5) * 80}%`
            ],
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Steam/Mist for analyzing state */}
      {isAnalyzing && (
        <motion.div
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/5 blur-3xl rounded-full"
          animate={{
            y: [-10, -40],
            opacity: [0, 0.4, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      )}

      {/* Base Label */}
      <div className="absolute -bottom-8 w-full text-center text-xs text-white/40 tracking-widest uppercase">
        Cooking Glass Pot v2.0
      </div>
    </div>
  );
};
