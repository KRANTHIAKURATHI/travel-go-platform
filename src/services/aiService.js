import { GoogleGenerativeAI } from "@google/generative-ai";
let genAI = null;

// Initialize the API only if the key exists to avoid app crashing
try {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
  } else {
    console.warn("VITE_GEMINI_API_KEY is missing. Chatbot features will run in mock mode.");
  }
} catch (error) {
  console.error("Error initializing Google Generative AI:", error);
}

export const generateChatResponse = async (query, pageContext) => {
  if (!genAI) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("This is a simulated response. To enable real AI responses, please configure your VITE_GEMINI_API_KEY in the .env file.");
      }, 1000);
    });
  }

  try {
    const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  });

    const prompt = `
You are a helpful travel assistant chatbot for a website called "TravelGo".
Your goal is to help users find the best buses, travel packages, and answer their questions based on their preferences. 

The user is currently viewing the following content on the website:
--- PAGE CONTEXT ---
${pageContext ? pageContext : 'No specific page context found.'}
--------------------

Based on this context and your general knowledge, answer the user's query gracefully and concisely. Address them directly.

User's Query: ${query}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Generation Error:", error);
    return `I'm sorry, I encountered an error: ${error.message}`;
  }
};
