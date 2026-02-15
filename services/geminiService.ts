
import { GoogleGenAI, Type } from "@google/genai";
import { Language, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Vardaan AI, an elite Socratic academic coach for Class 11-12 NCERT India.
GOAL: Guide students to answers through questioning. DO NOT GIVE DIRECT ANSWERS.

CONSTRAINTS:
1. RESPONSE SPEED: Be extremely concise. Max 3-4 sentences.
2. LANGUAGE: Respond ONLY in {language}. Use English for technical terms (e.g., "Molarity").
3. SOCRATIC METHOD: Identify the user's logic gap. Ask ONE targeted question.
4. ANALOGY: Use Indian context (Street food, Cricket, Monsoon, local trains).

FORMAT (JSON):
{
  "explanation": "concise socratic guidance",
  "phantomStepDetected": boolean,
  "misconceptionDescription": "brief logical error description",
  "rubricFeedback": "CBSE-style marking tip",
  "stressDetection": "low" | "medium" | "high",
  "analogyUsed": "brief analogy description"
}
`;

export async function getCoachingResponse(
  prompt: string, 
  history: ChatMessage[], 
  language: Language, 
  subject: string
) {
  const model = 'gemini-3-flash-preview';
  
  const conversationHistory = history.slice(-5).map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...conversationHistory,
        { parts: [{ text: `SUBJECT: ${subject}. LANG: ${language}. USER_MESSAGE: ${prompt}` }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION.replace(/{language}/g, language),
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            phantomStepDetected: { type: Type.BOOLEAN },
            misconceptionDescription: { type: Type.STRING },
            rubricFeedback: { type: Type.STRING },
            stressDetection: { type: Type.STRING, enum: ["low", "medium", "high"] },
            analogyUsed: { type: Type.STRING }
          },
          required: ["explanation", "phantomStepDetected", "stressDetection"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Error:", error);
    return {
      explanation: "Connectivity issue. Could you rephrase? (Sampark mein dikkat hai, kripya dobara puchein?)",
      phantomStepDetected: false,
      stressDetection: "low"
    };
  }
}

export async function generateStudyPlan(
  examType: string,
  examDate: string,
  weakSubjects: string[],
  language: Language
) {
  const model = 'gemini-3-flash-preview';
  const prompt = `Class 12 NCERT study plan for ${examType} (${examDate}). Weakness: ${weakSubjects.join(', ')}. Output modules.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            modules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.NUMBER },
                  subject: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  chapter: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] }
                },
                required: ['week', 'subject', 'topic', 'chapter', 'priority']
              }
            }
          },
          required: ['modules']
        }
      }
    });

    const data = JSON.parse(response.text);
    return data.modules.map((m: any, i: number) => ({
      ...m,
      id: `mod-${i}`,
      status: i === 0 ? 'current' : 'upcoming'
    }));
  } catch (e) {
    return [];
  }
}
