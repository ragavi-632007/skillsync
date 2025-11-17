import { GoogleGenAI } from "@google/genai";
import { UserProfile, MatchedUser, SessionSummary, AiCoachResponse, MatchedUserSchema, SessionSummarySchema, AiCoachResponseSchema } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const safeParseJson = <T,>(jsonString: string | undefined): T | null => {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    console.error("Invalid JSON string:", jsonString);
    return null;
  }
};

export async function generateMatch(profile: UserProfile): Promise<MatchedUser> {
  const prompt = `You are a matchmaking AI for SkillSync, a platform for global skill exchange.
A user offers to teach "${profile.skillToOffer}" and wants to learn "${profile.skillToLearn}".
Create a profile for an ideal learning partner.
- The partner's skill to offer must be what the user wants to learn.
- The partner's skill to learn must be what the user is offering.
- Give them a plausible name, country, personality, and learning style.
- Provide a unique placeholder profile picture URL using i.pravatar.cc, for example: "https://i.pravatar.cc/150?u=some-unique-id".
- Ensure the profile is positive and encouraging.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: MatchedUserSchema,
      temperature: 0.8
    }
  });

  const matchData = safeParseJson<MatchedUser>(response.text);
  if (!matchData) {
      throw new Error("AI failed to generate a valid match profile.");
  }
  return matchData;
}


export async function generateSessionCoachPrompt(user: UserProfile, partner: MatchedUser): Promise<AiCoachResponse> {
  const prompt = `You are an AI Coach for a SkillSync session.
User A (the user) can teach "${user.skillToOffer}" and wants to learn "${user.skillToLearn}".
User B (the partner, from ${partner.country}) can teach "${partner.skillToOffer}" and wants to learn "${partner.skillToLearn}".
Their personalities are: User A is learning, User B has a personality of "${partner.personality}".

Generate the next part of their 10-minute session. Provide:
1.  A 'microLesson' for one of the users. Specify who it is for ('user' or 'partner').
2.  An 'activity' for them to do together to practice their new skills.
3.  A 'cultureBridge' note about ${partner.country} to foster understanding.

Keep the tone friendly, encouraging, and clear. Ensure the content is practical for a short session.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: AiCoachResponseSchema,
      temperature: 0.7
    }
  });

  const coachData = safeParseJson<AiCoachResponse>(response.text);
  if (!coachData) {
      throw new Error("AI failed to generate a valid coach prompt.");
  }
  return coachData;
}


export async function empathyTranslate(message: string): Promise<string> {
    const prompt = `You are an AI Empathy Translator. A user, who might be shy or nervous, wrote the following message: "${message}".
Rewrite it to sound more polite, confident, encouraging, and clear, while maintaining the original intent. Keep it concise.
Return only the rewritten text, with no extra explanations or labels.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.5,
          maxOutputTokens: 150,
          thinkingConfig: { thinkingBudget: 75 },
        }
    });

    return (response.text || "").trim();
}


export async function generateSessionSummary(user: UserProfile, partner: MatchedUser): Promise<SessionSummary> {
    const prompt = `You are the SkillSync analysis AI. A 10-minute learning session just concluded between two users.
User A taught "${user.skillToOffer}" and learned "${user.skillToLearn}".
User B from ${partner.country} taught "${partner.skillToOffer}" and learned "${partner.skillToLearn}".

Based on a simulated positive, kind, and collaborative interaction where they successfully helped each other, generate:
1.  A 'SkillSync Score' between 85 and 100.
2.  A short, encouraging 'summary' of their session's success.
3.  One positive 'takeaway' about the power of human connection.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: SessionSummarySchema,
        }
    });

    const summaryData = safeParseJson<SessionSummary>(response.text);
    if (!summaryData) {
        throw new Error("AI failed to generate a valid session summary.");
    }
    return summaryData;
}