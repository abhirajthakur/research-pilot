import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export async function summarizeText(text: string): Promise<string> {
  const prompt = `Summarize this text in no more than 120 words. Keep it concise and focus on the main points:\n\n${text}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return (response as any).text?.trim?.() ?? "";
  } catch (error) {
    console.error("Error summarizing text:", error);
    // return "An error occurred while summarizing the text.";
    throw new Error("An error occurred while summarizing the text.");
  }
}
