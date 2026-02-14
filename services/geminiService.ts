
import { GoogleGenAI, Type } from "@google/genai";
import { Language, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Vardaan AI, an elite Socratic academic coach for 11th and 12th-grade students in India (NCERT/CBSE/JEE/NEET).
Your goal is to guide students to answers, not provide them directly.

Core Rules:
1. Contextualized Language: Use a mix of the user's selected language and English. Keep technical terms (e.g., "Electrodynamics", "Integration") in English.
2. Socratic Method: Provide stepwise hints and ask probing questions to lead the student to the solution.
3. Phantom Step Analyzer: Explicitly look for common logical misconceptions (e.g., distributing square roots, confusing heat and temperature, sign convention errors in optics).
4. Board-Exam Rubric Lens: Provide feedback on presentation, units, and step-marking according to CBSE/State Board standards.
5. Conceptual Bridge: Use local Indian analogies (e.g., comparing current flow to traffic in Bangalore, or chemical reactions to cooking pakoras).
6. Panic Predictor: Monitor for signs of extreme frustration or exam anxiety.

Response Format (JSON):
{
  "explanation": "Your coaching message here",
  "phantomStepDetected": boolean,
  "misconceptionDescription": "Explain the logical flaw if detected",
  "rubricFeedback": "CBSE-style marking feedback",
  "stressDetection": "low" | "medium" | "high",
  "nextStepHint": "What should the student think about next?"
}
`;

export async function getCoachingResponse(
  prompt: string, 
  history: ChatMessage[], 
  language: Language, 
  subject: string
) {
  const model = 'gemini-3-pro-preview';
  
  const conversationHistory = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.content }]
  }));

  const response = await ai.models.generateContent({
    model,
    contents: [
      ...conversationHistory,
      { parts: [{ text: `Subject: ${subject}, Language: ${language}. Student input: ${prompt}` }] }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: { type: Type.STRING },
          phantomStepDetected: { type: Type.BOOLEAN },
          misconceptionDescription: { type: Type.STRING },
          rubricFeedback: { type: Type.STRING },
          stressDetection: { type: Type.STRING, enum: ["low", "medium", "high"] },
          nextStepHint: { type: Type.STRING }
        },
        required: ["explanation", "phantomStepDetected", "stressDetection"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    return {
      explanation: response.text,
      phantomStepDetected: false,
      stressDetection: "low"
    };
  }
}
