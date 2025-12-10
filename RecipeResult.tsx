import React from 'react';
import { GenerationResult, Language } from '../types';
import { 
  Soup, 
  Utensils, 
  Clock, 
  Share2, 
  Save, 
  RefreshCcw,
  Sparkles,
  Droplets,
  Wind,
  Flame
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RecipeResultProps {
  data: GenerationResult;
  language: Language;
  onReset: () => void;
}

const UI_LABELS = {
  [Language.EN]: {
    moodPalette: "Mood Flavor Palette",
    baseMood: "Base Mood",
    topNotes: "Top Notes",
    heartNotes: "Heart Notes",
    finish: "Finish",
    intensity: "Intensity",
    ingredients: "Ingredients",
    instructions: "Instructions",
    save: "Save to Menu",
    share: "Share Card",
    askAgain: "Ask Chef Again"
  },
  [Language.JP]: {
    moodPalette: "ムードフレーバーパレット",
    baseMood: "ベース",
    topNotes: "トップノート",
    heartNotes: "ハートノート",
    finish: "フィニッシュ",
    intensity: "強度",
    ingredients: "材料",
    instructions: "作り方",
    save: "メニューに保存",
    share: "カードを共有",
    askAgain: "もう一度聞く"
  },
  [Language.KR]: {
    moodPalette: "무드 플레이버 팔레트",
    baseMood: "베이스",
    topNotes: "탑 노트",
    heartNotes: "하트 노트",
    finish: "피니시",
    intensity: "강도",
    ingredients: "재료",
    instructions: "조리법",
    save: "메뉴에 저장",
    share: "카드 공유",
    askAgain: "다시 물어보기"
  }
};

export const RecipeResult: React.FC<RecipeResultProps> = ({ data, language, onReset }) => {
  const content = data.recipe.content[language];
  const labels = UI_LABELS[language];
  const { mood } = data;
  const moodContent = mood.content[language];

  const getIllustrationIcon = () => {
    switch (data.recipe.illustrationType) {
      case 'ceramic': return <Soup className="w-12 h-12 text-white/80" />;
      case 'bento': return <Utensils className="w-12 h-12 text-white/80" />;
      case 'vapor': return <Wind className="w-12 h-12 text-white/80" />;
      default: return <Soup className="w-12 h-12 text-white/80" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto pb-20"
    >
      {/* Header Name */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/60 mb-2">
          {content.title}
        </h1>
        <p className="text-white/60 text-sm md:text-base italic">
          "{content.description}"
        </p>
      </div>

      {/* Illustration Placeholders */}
      <div className="flex justify-center mb-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-white/5 to-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          {getIllustrationIcon()}
        </div>
      </div>

      {/* Mood Flavor Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Sparkles />
        </div>
        <h3 className="text-xs tracking-widest uppercase text-white/40 mb-6 border-b border-white/10 pb-2">
          {labels.moodPalette}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs text-blue-300/80 mb-1">
                <Droplets size={12}/> {labels.baseMood}
              </label>
              <p className="text-white/90 font-light">{moodContent.baseMood}</p>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs text-yellow-300/80 mb-1">
                <Wind size={12}/> {labels.topNotes}
              </label>
              <p className="text-white/90 font-light">{moodContent.topNotes}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs text-red-300/80 mb-1">
                <Flame size={12}/> {labels.heartNotes}
              </label>
              <p className="text-white/90 font-light">{moodContent.heartNotes}</p>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs text-purple-300/80 mb-1">
                <Sparkles size={12}/> {labels.finish}
              </label>
              <p className="text-white/90 font-light">{moodContent.finish}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-sm text-white/60 italic leading-relaxed">
            "{moodContent.explanation}"
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-white/40">{labels.intensity}</span>
            <div className="flex-1 h-1 bg-white/10 rounded-full">
              <div 
                className="h-full bg-white/60 rounded-full transition-all duration-1000"
                style={{ width: `${mood.intensity * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Details */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6 text-white/50 text-sm">
          <Clock size={16} />
          <span>{content.cookingTime}</span>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">{labels.ingredients}</h3>
          <ul className="space-y-2">
            {content.ingredients.map((ing, idx) => (
              <li key={idx} className="flex items-start gap-3 text-white/80 font-light text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2"></span>
                {ing}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium text-white mb-4">{labels.instructions}</h3>
          <ol className="space-y-6">
            {content.steps.map((step, idx) => (
              <li key={idx} className="flex gap-4 text-white/80 font-light text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono">
                  {idx + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm border border-white/10">
          <Save size={16} /> {labels.save}
        </button>
        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm border border-white/10">
          <Share2 size={16} /> {labels.share}
        </button>
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-colors text-sm font-medium shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <RefreshCcw size={16} /> {labels.askAgain}
        </button>
      </div>
    </motion.div>
  );
};
