// src/services/api/aiService.ts

// IMPORTANT: You must have a VITE_GEMINI_API_KEY in your .env file for this to work.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

interface StepSuggestion {
  title: string;
}

export const aiService = {
  /**
   * Generates a list of actionable steps for a given goal using the Gemini API.
   * @param goalTitle The title of the goal.
   * @param goalDescription The description of the goal.
   * @returns A promise that resolves to an array of step suggestions.
   */
  async generateGoalSteps(goalTitle: string, goalDescription?: string | null): Promise<StepSuggestion[]> {
    if (!API_KEY) {
      throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.");
    }

    const prompt = `
      Based on the following goal, break it down into a list of small, actionable steps.
      
      Goal Title: "${goalTitle}"
      ${goalDescription ? `Goal Description: "${goalDescription}"` : ''}

      Provide only the list of steps.
    `;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        // Ensure we get a JSON response by defining the schema
        response_mime_type: "application/json",
        response_schema: {
          type: "OBJECT",
          properties: {
            steps: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  title: {
                    type: "STRING",
                    description: "A single, actionable step towards the goal."
                  }
                }
              }
            }
          }
        },
      },
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Gemini API Error:", errorBody);
      throw new Error(`AI suggestion failed: ${errorBody.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    // The response text is a JSON string, so we parse it
    const parsed = JSON.parse(responseText);

    return parsed.steps || [];
  },
};
