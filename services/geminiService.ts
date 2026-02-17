
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Language, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Vardaan AI, an elite Socratic academic coach for Class 11-12 NCERT India.
SUBJECT CONTEXT: You handle Maths, Physics, Chemistry, Biology, Computer Science, and English Literature.

CORE MISSION: Identify "Phantom Steps" (logical misconceptions). 
EXAMPLES:
- Maths: Student thinks sqrt(a+b) = sqrt(a) + sqrt(b). 
- Physics: Student assumes velocity is zero because acceleration is zero.
- Chemistry: Student confuses molarity with molality.
- Biology: Student confuses Mitosis with Meiosis logic.
- CS: Logic errors like off-by-one or pointer misuse.
- English: Misinterpreting literary devices or thematic shifts.

CONSTRAINTS:
1. RESPONSE STYLE: Socratic. Ask ONE targeted question to make the student realize their logic gap.
2. NO CRICKET BIAS: Do not use cricket analogies unless the user is a sports fanatic. Use real-world engineering, medical, or computational examples.
3. STRUCTURE: provide a "Conceptual Note" (bullet points) and a "Scientific Example."
4. LANGUAGE: Respond ONLY in {language}. Use English for technical terms.
5. VOICE-TO-CONCEPT: If the user speaks casually or in a native dialect, parse their intent into precise NCERT technical terminology.

FORMAT (JSON):
{
  "explanation": "concise socratic guidance",
  "conceptualExample": "A scientific/real-world example or proper notes",
  "phantomStepDetected": boolean,
  "misconceptionDescription": "The specific logical error identified",
  "conceptNote": ["Core point 1", "Core point 2"],
  "stressDetection": "low" | "medium" | "high"
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
            conceptualExample: { type: Type.STRING },
            phantomStepDetected: { type: Type.BOOLEAN },
            misconceptionDescription: { type: Type.STRING },
            conceptNote: { type: Type.ARRAY, items: { type: Type.STRING } },
            stressDetection: { type: Type.STRING, enum: ["low", "medium", "high"] }
          },
          required: ["explanation", "stressDetection", "conceptNote", "conceptualExample"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Error:", error);
    return {
      explanation: "Connectivity glitch. Let's re-analyze that thought. (Kuch takneeki dikkat hai.)",
      conceptualExample: "Logic is the foundation of all subjects.",
      conceptNote: ["Check connection", "Retry"],
      phantomStepDetected: false,
      stressDetection: "low"
    };
  }
}

export async function getStressSupport(stressLevel: string, subject: string, language: string) {
  const model = 'gemini-3-flash-preview';
  const prompt = `Affirmation for a student studying ${subject} at ${stressLevel} stress. Language: ${language}. One sentence affirmation, one sentence tip.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            affirmation: { type: Type.STRING },
            tip: { type: Type.STRING }
          },
          required: ["affirmation", "tip"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (e) {
    return { affirmation: "You are stronger than this chapter.", tip: "Hydrate and take a 5-min walk." };
  }
}

export async function getBreathingCue(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (e) {
    return null;
  }
}

export async function generateStudyPlan(
  examType: string,
  examDate: string,
  weakSubjects: string[],
  language: Language
) {
  const model = 'gemini-3-flash-preview';
  const prompt = `Class 12 plan for ${examType}. Date: ${examDate}. Weak: ${weakSubjects.join(', ')}. Include sections for all subjects including English and Computer Science.`;

  try {
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
