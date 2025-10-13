
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  // This is a placeholder check. In a real app, the key would be set in the environment.
  // For this environment, we will mock the API key.
  process.env.API_KEY = "mock-api-key-for-development"; 
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOCK_RESPONSE = `Of course! For a 'long-sleeve blue blouse with a Peter Pan collar', consider a soft, breathable fabric like cotton poplin or a fluid viscose for a lovely drape. The Peter Pan collar adds a touch of vintage charm, which could be accentuated with delicate white piping. For a modern twist, bishop sleeves with a fitted cuff would look elegant.`;

export const getDesignSuggestions = async (prompt: string): Promise<string> => {
  if (process.env.API_KEY === "mock-api-key-for-development") {
    console.warn("Using mock Gemini API response. Set a real API_KEY to use the service.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_RESPONSE), 1000));
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are a fashion design assistant. Based on the user's description, provide a more detailed description of the garment, including fabric suggestions and style notes. Keep it concise, around 2-3 sentences. Be friendly and encouraging.`
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating design suggestions:", error);
    return "Sorry, I couldn't generate a suggestion right now. Please try again later.";
  }
};
