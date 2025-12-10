export enum Language {
  EN = 'en',
  JP = 'ja',
  KR = 'ko',
}

export interface MoodContent {
  baseMood: string;
  topNotes: string;
  heartNotes: string;
  finish: string;
  explanation: string;
}

export interface MoodData {
  valence: number; // -1 (Sad/Low) to 1 (Happy/High)
  intensity: number; // 0 to 1
  colorHex: string;
  content: {
    [key in Language]: MoodContent;
  };
}

export interface RecipeContent {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  cookingTime: string;
}

export interface RecipeData {
  illustrationType: 'ceramic' | 'bento' | 'vapor';
  content: {
    [key in Language]: RecipeContent;
  };
}

export interface GenerationResult {
  id: string;
  timestamp: number;
  mood: MoodData;
  recipe: RecipeData;
}

export type AppState = 'idle' | 'analyzing' | 'result' | 'history';
