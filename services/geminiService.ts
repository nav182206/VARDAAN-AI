import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Language, ChatMessage } from "../types";

const SYSTEM_INSTRUCTION = `
You are Vardaan AI, an elite Socratic academic coach for Class 11-12 NCERT India. You are a "Phantom Step" detector, meaning your primary goal is to find the unstated assumption, logical leap, or hidden misunderstanding in a student's reasoning.

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
2. ADAPTIVE EXPLANATION: Analyze the conversation history to gauge the student's current understanding. If they are asking basic questions, provide simpler, more foundational answers. If they are discussing advanced topics, offer more in-depth explanations.
3. SUBJECT FIDELITY: All explanations, examples, and concepts MUST strictly relate to the provided SUBJECT. Do not use examples from other subjects (e.g., no physics examples for a math problem).
4. NO CRICKET BIAS: Do not use cricket analogies unless the user is a sports fanatic. Use real-world engineering, medical, or computational examples relevant to the subject.
5. STRUCTURE: provide a "Conceptual Note" (bullet points) and a "Scientific Example."
6. LANGUAGE: Respond ONLY in {language}. Use English for technical terms.
7. VOICE-TO-CONCEPT: If the user speaks casually or in a native dialect, parse their intent into precise NCERT technical terminology.

FORMAT (JSON):
{
  "directAnswer": "A concise, to-the-point answer to the user's question.",
  "socraticExplanation": "Deeper socratic guidance to lead the student to understanding.",
  "conceptualExample": "A scientific/real-world example or proper notes to support the explanation.",
  "phantomStepDetected": boolean,
  "misconceptionDescription": "The specific logical error identified",
  "conceptNote": ["Core point 1", "Core point 2"],
  "stressDetection": "low" | "medium" | "high"
}
`;

function getAI() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please ensure VITE_GEMINI_API_KEY is set in your environment.");
  }
  return new GoogleGenAI({ apiKey });
}

export async function getCoachingResponse(
  prompt: string,
  history: ChatMessage[],
  language: Language,
  subject: string,
  attachment?: { data: string; mimeType: string }
) {
  const ai = getAI();

  const conversationHistory = history.slice(-5).map(h => {
    const parts = [];
    let messageContent = h.content;
    if (h.role === 'assistant' && h.directAnswer) {
        messageContent = `${h.directAnswer}\n\n${h.content}`;
    }
    if (messageContent) {
        parts.push({ text: messageContent });
    }
    if (h.attachment) {
        parts.push({ inlineData: { data: h.attachment.data, mimeType: h.attachment.mimeType } });
    }
    if (parts.length === 0) {
        parts.push({ text: "" });
    }
    return {
        role: h.role === 'user' ? 'user' : 'model',
        parts: parts
    };
  });

  try {
    let responseText: string;

    if (attachment) {
      const modelName = 'gemini-2.5-flash-image';
      const userParts = [
        { inlineData: { data: attachment.data, mimeType: attachment.mimeType } },
        { text: `SUBJECT: ${subject}. LANG: ${language}. USER_MESSAGE: ${prompt}. IMPORTANT: Respond in the JSON format specified in the system instructions.` }
      ];

      const response = await ai.models.generateContent({
        model: modelName,
        contents: [...conversationHistory, { parts: userParts }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION.replace(/{language}/g, language),
        }
      });
      responseText = response.text;
    } else {
      const modelName = 'gemini-3-flash-preview';
      const userParts = [{ text: `SUBJECT: ${subject}. LANG: ${language}. USER_MESSAGE: ${prompt}` }];
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [...conversationHistory, { parts: userParts }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION.replace(/{language}/g, language),
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              directAnswer: { type: Type.STRING },
              socraticExplanation: { type: Type.STRING },
              conceptualExample: { type: Type.STRING },
              phantomStepDetected: { type: Type.BOOLEAN },
              misconceptionDescription: { type: Type.STRING },
              conceptNote: { type: Type.ARRAY, items: { type: Type.STRING } },
              stressDetection: { type: Type.STRING, enum: ["low", "medium", "high"] }
            },
            required: ["directAnswer", "socraticExplanation", "stressDetection", "conceptNote", "conceptualExample"]
          }
        }
      });
      responseText = response.text;
    }

    try {
        const cleanedText = responseText.replace(/^```json\n?/, '').replace(/```$/, '');
        return JSON.parse(cleanedText);
    } catch (parseError) {
        console.error("Failed to parse AI JSON response:", parseError);
        return {
            directAnswer: "Response from AI:",
            socraticExplanation: responseText,
            conceptualExample: "",
            conceptNote: [],
            phantomStepDetected: false,
            stressDetection: "low"
        };
    }
  } catch (error: any) {
    console.error("AI Error:", error);
    const errorMessage = error.message || "Unknown error";
    
    // Check for specific common errors
    let directAnswer = "Connection Error";
    let socraticExplanation = `I'm having trouble connecting to my AI brain. Error: "${errorMessage}".`;
    
    if (errorMessage.includes("API Key") || errorMessage.includes("not defined")) {
      directAnswer = "Configuration Required";
      socraticExplanation = "It looks like my API key isn't set up correctly yet. Please make sure you've added VITE_GEMINI_API_KEY to your environment variables.";
    }

    return {
      directAnswer,
      socraticExplanation,
      conceptualExample: "Please check your network connection and API configuration.",
      conceptNote: ["Action Required: Verify API Key", "Action Required: Check Network"],
      phantomStepDetected: false,
      stressDetection: "low"
    };
  }
}

export async function getStressSupport(stressLevel: string, subject: string, language: string) {
  const ai = getAI();
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

export async function getMotivationalAffirmation(language: string): Promise<string> {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  const prompt = `Generate a short, powerful motivational affirmation for a student feeling overwhelmed during exam preparation. The affirmation should be encouraging and instill a sense of capability and resilience. Respond in ${language}. Format as a single sentence string.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text.replace(/"/g, ''); // Clean up quotes
  } catch (error) {
    console.error("AI Motivational Affirmation Error:", error);
    return "You have the strength to overcome any challenge.";
  }
}

export async function getBreathingCue(text: string) {
  const ai = getAI();
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

export async function getSmartGoals(goal: string, targetDate: string, language: Language) {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  const prompt = `As an expert academic advisor, break down the following high-level goal into smaller, manageable milestones. The student wants to achieve: "${goal}" by ${targetDate}. The milestones should be specific, measurable, achievable, relevant, and time-bound (SMART). The response should be in ${language}. Format the output as a JSON object with a single key "milestones", which is an array of objects. Each object should have "milestone" (a string) and "status" (a string, initially "pending").`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  milestone: { type: Type.STRING },
                  status: { type: Type.STRING },
                },
                required: ["milestone", "status"]
              }
            },
          },
          required: ["milestones"]
        }
      }
    });

    const parsed = JSON.parse(response.text);
    return parsed.milestones;
  } catch (error) {
    console.error("AI Smart Goals Error:", error);
    return [{ milestone: "An error occurred while generating your smart goals. Please try again.", status: 'error' }];
  }
}

export async function getDoubtExplanation(doubt: string, subject: string, language: Language) {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  const prompt = `As an expert tutor for ${subject}, provide a clear, step-by-step explanation for the following doubt: "${doubt}". Break down complex concepts into simple, easy-to-understand steps. The explanation should be in ${language}. Format the output as a JSON object with a single key "explanation" which is an array of strings, where each string is a paragraph or a step in the explanation.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["explanation"]
        }
      }
    });

    const parsed = JSON.parse(response.text);
    return parsed.explanation;
  } catch (error) {
    console.error("AI Doubt Explanation Error:", error);
    return ["An error occurred while generating the explanation. Please try again."];
  }
}

export async function getChapterSummary(subject: string, chapter: string, language: Language) {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  const prompt = `Generate a detailed, well-structured summary for the chapter titled "${chapter}" in the subject of ${subject}. The summary should be in ${language} and include key concepts, important definitions, and critical formulas. Format the output as a JSON object with a single key "summary" which is an array of strings, where each string is a key point or paragraph.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summary"]
        }
      }
    });

    const parsed = JSON.parse(response.text);
    return parsed.summary;
  } catch (error) {
    console.error("AI Summary Error:", error);
    return ["An error occurred while generating the summary. Please try again."];
  }
}

export async function generatePracticeTest(subject: string, topic: string, language: Language) {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  const prompt = `Generate a 5-question multiple-choice practice test on the topic "${topic}" in the subject of ${subject}. The questions should be challenging and relevant to the NCERT curriculum. The response should be in ${language}. Format the output as a JSON object with a single key "questions", which is an array of objects. Each object should have "question" (a string), "options" (an array of 4 strings), and "correctAnswer" (a string).`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                },
                required: ["question", "options", "correctAnswer"]
              }
            },
          },
          required: ["questions"]
        }
      }
    });

    const parsed = JSON.parse(response.text);
    return parsed.questions;
  } catch (error) {
    console.error("AI Practice Test Error:", error);
    return [];
  }
}

export async function generateStudyPlan(
  examType: string,
  examDate: string,
  weakSubjects: string[],
  language: Language
) {
  const ai = getAI();
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

export async function getRubricFeedback(submission: string, rubric: string): Promise<string> {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  const prompt = `As an expert academic evaluator, provide constructive feedback on the following submission based on the provided rubric.\n\nSUBMISSION:\n---\n${submission}\n---\n\nRUBRIC:\n---\n${rubric}\n---\n\nProvide feedback in a structured, encouraging, and actionable manner. Address each point in the rubric. Format the response as a markdown string.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    console.error("AI Rubric Feedback Error:", error);
    return "An error occurred while generating feedback. Please try again.";
  }
}
