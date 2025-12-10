import React from 'react';

interface MoodSliderProps {
  valence: number; // -1 to 1
}

export const MoodSlider: React.FC<MoodSliderProps> = ({ valence }) => {
  // Map -1...1 to 0...100%
  const percentage = ((valence + 1) / 2) * 100;

  return (
    <div className="w-full max-w-sm mx-auto my-6">
      <div className="flex justify-between text-xs text-white/50 mb-2 font-mono">
        <span>Deep / Low</span>
        <span>Bright / Light</span>
      </div>
      <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 opacity-50 w-full"
        ></div>
        {/* Indicator Dot */}
        <div 
          className="absolute top-1/2 -mt-1.5 h-3 w-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-1000 ease-out"
          style={{ left: `calc(${percentage}% - 6px)` }}
        ></div>
      </div>
    </div>
  );
};
