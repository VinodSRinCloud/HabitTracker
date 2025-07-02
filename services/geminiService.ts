
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a placeholder check. The execution environment must have the API_KEY.
  console.warn("API_KEY environment variable not set. Gemini features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getMotivationalQuote = async (): Promise<string> => {
  if (!API_KEY) {
    return "To enable motivational quotes, please set up your API key.";
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: "Generate a short, powerful motivational quote about consistency and building good habits. The quote should be inspiring and concise.",
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching motivational quote:", error);
    return "The only bad workout is the one that didn't happen. Keep going!";
  }
};
