
import { GoogleGenAI, Type } from "@google/genai";
import { Language, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Vardaan AI, an elite Socratic academic coach for 11th and 12th-grade students in India.
Your mission is to help students master NCERT concepts for CBSE, JEE, and NEET.

STRICT MULTILINGUAL RULE:
1. The user will select a language (e.g., Hindi, Tamil, Telugu).
2. You MUST write the ENTIRE "explanation" field in that SELECTED LANGUAGE.
3. CRITICAL: Use the selected language for all conversational and descriptive text.
4. HOWEVER, keep all scientific and technical terms (e.g., "Momentum", "Valency", "Equilibrium", "Mitochondria") in English. 
5. Do NOT use formal/heavy academic translations of technical terms. Use the English terms as they appear in standard NCERT textbooks.

SOCRATIC GUIDELINES:
- NEVER give the direct answer. Always ask a probing question or provide a hint to bridge the logical gap.
- PHANTOM STEP ANALYSIS: If a student skips a step or makes a logical error, describe it clearly in the "misconceptionDescription" field.
- LOCAL ANALOGIES: Use Indian cultural contexts (e.g., street food, festivals, cricket, local geography) for analogies. Put this in the "analogyUsed" field.

JSON RESPONSE FORMAT (MANDATORY):
{
  "explanation": "Your text in the SELECTED LANGUAGE (Hindi/Tamil/etc) but with technical terms in English",
  "phantomStepDetected": boolean,
  "misconceptionDescription": "Explanation of logical error (if any)",
  "rubricFeedback": "CBSE step-marking/exam advice in English",
  "stressDetection": "low" | "medium" | "high",
  "analogyUsed": "The analogy you used to bridge the concept"
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

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...conversationHistory,
        { 
          parts: [{ 
            text: `CURRENT SUBJECT: ${subject}. 
                   TARGET LANGUAGE: ${language}. 
                   STUDENT MESSAGE: ${prompt}
                   
                   REMINDER: Generate the 'explanation' field strictly in ${language} text while keeping technical terms in English.` 
          }] 
        }
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
            analogyUsed: { type: Type.STRING }
          },
          required: ["explanation", "phantomStepDetected", "stressDetection"]
        }
      }
    });

    const text = response.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text;
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI Error:", error);
    return {
      explanation: "I encountered a minor logic glitch. Could you rephrase your question? (Kripya apna sawal firse puchein.)",
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
  const model = 'gemini-3-pro-preview';
  const prompt = `Generate a 4-week NCERT study plan for a Class 12 student preparing for ${examType} on ${examDate}. 
  The student is weak in: ${weakSubjects.join(', ')}. 
  Output as a JSON array of modules following this schema: 
  { modules: Array<{ week: number, subject: string, topic: string, chapter: string, priority: 'high' | 'medium' | 'low' }> }`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
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

  try {
    const data = JSON.parse(response.text);
    return data.modules.map((m: any, i: number) => ({
      ...m,
      id: `mod-${i}`,
      status: i === 0 ? 'current' : 'upcoming'
    }));
  } catch (e) {
    console.error("Plan generation error", e);
    return [];
  }
}
