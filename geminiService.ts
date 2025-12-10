import { GoogleGenAI, Schema, Type } from "@google/genai";
import { GenerationResult, Language } from "../types";

const MOOD_SYSTEM_INSTRUCTION = `
You are "CookGo MoodRecipe". 
Your goal is to analyze the user's input text to determine their emotional state and generate a personalized recipe proposal.
The recipe must be realistic and achievable (American Comfort, Japanese Home Cooking, Korean Soup/Stew/Side dish, or Chinese Quick Meal).
Do not invent fantasy food. It must be edible.

You must translate the mood into a "Flavor Structure":
1. Base (Underlying mood -> e.g., Stew for sad/deep, Salad for fresh/happy).
2. Top Notes (Urgency/Tension -> e.g., Citrus, Ginger).
3. Heart Notes (Core emotion -> e.g., Miso, Cream, Tomato).
4. Finish (Desire/Need -> e.g., Herbs, Spice).
5. Intensity (Energy level).

You must provide BOTH the recipe content AND the mood analysis text (base, top notes, heart notes, finish, explanation) in English, Japanese, and Korean.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    moodAnalysis: {
      type: Type.OBJECT,
      properties: {
        valence: { type: Type.NUMBER, description: "Mood valence from -1 (Negative/Low) to 1 (Positive/High)" },
        intensity: { type: Type.NUMBER, description: "Mood intensity from 0 (Calm) to 1 (Intense)" },
        colorHex: { type: Type.STRING, description: "A hex color code representing the mood (e.g., #5D4037 for deep, #FFF176 for bright)" },
        content: {
          type: Type.OBJECT,
          properties: {
            en: {
              type: Type.OBJECT,
              properties: {
                baseMood: { type: Type.STRING, description: "The base emotional tone translated to flavor concept" },
                topNotes: { type: Type.STRING, description: "Immediate emotional impression translated to seasoning" },
                heartNotes: { type: Type.STRING, description: "Main emotional burden/joy translated to main ingredient style" },
                finish: { type: Type.STRING, description: "Aftertaste or hidden desire translated to finishing touch" },
                explanation: { type: Type.STRING, description: "Brief poetic explanation of the mood-flavor connection" }
              },
              required: ["baseMood", "topNotes", "heartNotes", "finish", "explanation"]
            },
            ja: {
              type: Type.OBJECT,
              properties: {
                baseMood: { type: Type.STRING },
                topNotes: { type: Type.STRING },
                heartNotes: { type: Type.STRING },
                finish: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["baseMood", "topNotes", "heartNotes", "finish", "explanation"]
            },
            ko: {
              type: Type.OBJECT,
              properties: {
                baseMood: { type: Type.STRING },
                topNotes: { type: Type.STRING },
                heartNotes: { type: Type.STRING },
                finish: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["baseMood", "topNotes", "heartNotes", "finish", "explanation"]
            }
          },
          required: ["en", "ja", "ko"]
        }
      },
      required: ["valence", "intensity", "colorHex", "content"]
    },
    recipe: {
      type: Type.OBJECT,
      properties: {
        illustrationType: { type: Type.STRING, enum: ["ceramic", "bento", "vapor"], description: "Visual style for the dish" },
        content: {
          type: Type.OBJECT,
          properties: {
            en: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                cookingTime: { type: Type.STRING }
              },
              required: ["title", "description", "ingredients", "steps", "cookingTime"]
            },
            ja: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                cookingTime: { type: Type.STRING }
              },
              required: ["title", "description", "ingredients", "steps", "cookingTime"]
            },
            ko: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                cookingTime: { type: Type.STRING }
              },
              required: ["title", "description", "ingredients", "steps", "cookingTime"]
            }
          },
          required: ["en", "ja", "ko"]
        }
      },
      required: ["illustrationType", "content"]
    }
  },
  required: ["moodAnalysis", "recipe"]
};

export const generateMoodRecipe = async (inputText: string): Promise<GenerationResult | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: inputText,
      config: {
        systemInstruction: MOOD_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);
    
    return {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      mood: {
        valence: data.moodAnalysis.valence,
        intensity: data.moodAnalysis.intensity,
        colorHex: data.moodAnalysis.colorHex,
        content: {
          [Language.EN]: data.moodAnalysis.content.en,
          [Language.JP]: data.moodAnalysis.content.ja,
          [Language.KR]: data.moodAnalysis.content.ko,
        }
      },
      recipe: {
        illustrationType: data.recipe.illustrationType,
        content: {
          [Language.EN]: data.recipe.content.en,
          [Language.JP]: data.recipe.content.ja,
          [Language.KR]: data.recipe.content.ko,
        }
      }
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};
