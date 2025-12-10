import React, { useState, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GlassPot } from './components/GlassPot';
import { MoodSlider } from './components/MoodSlider';
import { RecipeResult } from './components/RecipeResult';
import { generateMoodRecipe } from './services/geminiService';
import { AppState, GenerationResult, Language } from './types';
import { History, Globe, Sparkles, ChefHat, Shuffle } from 'lucide-react';

const UI_TEXT = {
  [Language.EN]: {
    historyHeader: "Recipe History",
    noHistory: "No recipes cooked yet.",
    back: "Back",
    analyzing: "Capturing your mood particles...",
    intro: "Tell me about your day, your mood, or your energy level.",
    placeholder: "How are you feeling today? (e.g., 'A bit tired, need something warm...')",
    error: "The Chef couldn't quite catch that. Please try again.",
    randomBtn: "Surprise me"
  },
  [Language.JP]: {
    historyHeader: "レシピ履歴",
    noHistory: "まだ履歴がありません。",
    back: "戻る",
    analyzing: "感情の粒子を採取中...",
    intro: "今日の気分や、エネルギーレベルについて教えてください。",
    placeholder: "今日の気分はどうですか？ (例: 「少し疲れているので、温かいものが食べたい...」)",
    error: "うまく聞き取れませんでした。もう一度お試しください。",
    randomBtn: "入力例を試す"
  },
  [Language.KR]: {
    historyHeader: "요리 기록",
    noHistory: "아직 요리 기록이 없습니다.",
    back: "뒤로",
    analyzing: "감정 입자를 수집 중...",
    intro: "오늘 하루는 어땠나요? 기분이나 에너지 상태를 알려주세요.",
    placeholder: "오늘 기분은 어떤가요? (예: '좀 피곤해서 따뜻한 게 먹고 싶어...')",
    error: "셰프가 잘 알아듣지 못했습니다. 다시 시도해 주세요.",
    randomBtn: "랜덤 예시 입력"
  }
};

const SAMPLE_INPUTS = {
  [Language.EN]: [
    "Had a really long day at work, I need something comforting and warm.",
    "Feeling super energetic! I want something spicy and exciting.",
    "It's raining outside and I feel a bit nostalgic.",
    "I'm stressed out and need a quick, healthy meal to reset.",
    "Just finished a workout, I'm starving but want to keep it light.",
    "Feeling a bit lonely, make me something that feels like a hug."
  ],
  [Language.JP]: [
    "仕事で疲れたので、心も体も温まる料理が食べたいです。",
    "今日はとても元気！刺激的な辛い料理に挑戦したい気分。",
    "外は雨で、なんだか昔懐かしい気分です。",
    "少しストレスが溜まっているので、さっぱりとしたものでリセットしたい。",
    "運動した後でお腹が空いています。ヘルシーだけど満足感のあるものを。",
    "少し寂しい気分なので、優しくて懐かしい味が恋しいです。"
  ],
  [Language.KR]: [
    "오늘 일이 너무 힘들었어. 따뜻하고 위로가 되는 음식이 필요해.",
    "에너지가 넘치는 날이야! 뭔가 맵고 자극적인 게 땡겨.",
    "밖에 비가 오니까 괜히 옛날 생각이 나네. 감성적인 요리 없을까?",
    "스트레스가 좀 쌓였어. 깔끔하고 소화 잘 되는 걸로 추천해줘.",
    "운동 끝나고 배고파 죽겠어! 든든하지만 살 안 찌는 걸로.",
    "기분이 좀 울적해. 엄마가 해주던 집밥 같은 느낌이 필요해."
  ]
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('idle');
  const [userInput, setUserInput] = useState('');
  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null);
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [language, setLanguage] = useState<Language>(Language.EN);
  
  // Ref to prevent double submission
  const isProcessing = useRef(false);

  const texts = UI_TEXT[language];

  const handleAnalyze = useCallback(async () => {
    if (!userInput.trim() || isProcessing.current) return;
    
    isProcessing.current = true;
    setState('analyzing');
    
    // Simulate initial delay for "gathering particles" effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = await generateMoodRecipe(userInput);
    
    if (result) {
      setCurrentResult(result);
      setHistory(prev => [result, ...prev]);
      setState('result');
    } else {
      // Handle error state gracefully (reset)
      alert(texts.error);
      setState('idle');
    }
    
    isProcessing.current = false;
  }, [userInput, texts.error]);

  const handleReset = () => {
    setUserInput('');
    setState('idle');
    setCurrentResult(null);
  };

  const handleLoadHistory = (item: GenerationResult) => {
    setCurrentResult(item);
    setState('result');
  };

  const handleRandomInput = () => {
    const samples = SAMPLE_INPUTS[language];
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setUserInput(randomSample);
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 font-sans overflow-x-hidden selection:bg-purple-500/30">
      {/* Navigation / Header */}
      <nav className="flex justify-between items-center max-w-5xl mx-auto mb-8 z-50 relative">
        <div className="flex items-center gap-2 text-white/90">
          <ChefHat className="w-6 h-6" />
          <span className="font-serif text-lg tracking-wide hidden sm:block">CookGo MoodRecipe</span>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setState(state === 'history' ? 'idle' : 'history')}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70"
          >
            <History size={20} />
          </button>
          
          <div className="flex items-center bg-white/5 rounded-full px-1 border border-white/10">
             <button 
                onClick={() => setLanguage(Language.EN)} 
                className={`px-3 py-1 rounded-full text-xs transition-all ${language === Language.EN ? 'bg-white/20 text-white' : 'text-white/40'}`}
             >EN</button>
             <button 
                onClick={() => setLanguage(Language.JP)} 
                className={`px-3 py-1 rounded-full text-xs transition-all ${language === Language.JP ? 'bg-white/20 text-white' : 'text-white/40'}`}
             >JP</button>
             <button 
                onClick={() => setLanguage(Language.KR)} 
                className={`px-3 py-1 rounded-full text-xs transition-all ${language === Language.KR ? 'bg-white/20 text-white' : 'text-white/40'}`}
             >KR</button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto relative min-h-[80vh] flex flex-col items-center justify-center">
        
        {/* History View */}
        {state === 'history' && (
           <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-2xl font-serif text-white/90 mb-6 text-center">{texts.historyHeader}</h2>
             <div className="space-y-4">
               {history.length === 0 ? (
                 <p className="text-center text-white/30 italic">{texts.noHistory}</p>
               ) : (
                 history.map(item => (
                   <div 
                      key={item.id} 
                      onClick={() => handleLoadHistory(item)}
                      className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 cursor-pointer transition-all flex items-center justify-between"
                   >
                     <div>
                       <div className="text-xs text-white/40 mb-1">
                         {new Date(item.timestamp).toLocaleDateString()}
                       </div>
                       <h3 className="text-white/90 font-medium">
                         {item.recipe.content[language].title}
                       </h3>
                       <p className="text-white/60 text-sm line-clamp-1 mt-1">
                         "{item.mood.content[language].explanation}"
                       </p>
                     </div>
                     <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/80 transition-colors" />
                   </div>
                 ))
               )}
             </div>
             <button 
                onClick={() => setState(currentResult ? 'result' : 'idle')}
                className="mt-8 w-full py-3 text-white/50 hover:text-white transition-colors text-sm"
             >
               {texts.back}
             </button>
           </div>
        )}

        {/* Idle & Analyzing State */}
        {(state === 'idle' || state === 'analyzing') && (
          <div className={`w-full max-w-xl text-center transition-all duration-700 ${state === 'analyzing' ? 'scale-95 opacity-90' : 'scale-100'}`}>
            
            <GlassPot 
              isAnalyzing={state === 'analyzing'} 
              color={state === 'analyzing' ? undefined : '#fbbf24'} // Default gold, changes during animation
            />
            
            <div className="h-12 mb-4">
               {state === 'analyzing' && (
                 <p className="text-white/60 animate-pulse text-sm tracking-widest uppercase">
                   {texts.analyzing}
                 </p>
               )}
            </div>

            <MoodSlider valence={state === 'analyzing' ? 0.5 : 0} /> {/* Dynamic in real app, static placeholder for concept */}

            <div className="relative mt-8 group">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={texts.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all resize-none text-lg min-h-[120px] shadow-inner"
                disabled={state === 'analyzing'}
              />
              
              <div className="absolute bottom-4 right-4">
                 {state === 'idle' ? (
                   <button 
                     onClick={handleAnalyze}
                     disabled={!userInput.trim()}
                     className="bg-white text-black p-3 rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                   >
                     <Sparkles size={20} />
                   </button>
                 ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                 )}
              </div>
            </div>

            {state === 'idle' && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <p className="text-white/30 text-sm">
                  {texts.intro}
                </p>
                <button 
                  onClick={handleRandomInput}
                  className="flex items-center gap-2 text-xs text-white/40 hover:text-white/80 transition-colors border border-white/10 rounded-full px-4 py-1.5 hover:bg-white/5 hover:border-white/20"
                >
                  <Shuffle size={12} />
                  {texts.randomBtn}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Result State */}
        {state === 'result' && currentResult && (
          <RecipeResult 
            data={currentResult} 
            language={language} 
            onReset={handleReset} 
          />
        )}

      </main>
    </div>
  );
};

export default App;
