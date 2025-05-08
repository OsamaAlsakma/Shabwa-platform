import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDiXGMpyJYWVuZLJF7UXx-WYuFKHba7zoE");

export interface AITool {
  name: string;
  description: string;
  url: string;
  pricing: 'free' | 'freemium' | 'paid';
  arabicSupport: boolean;
  rating?: number;
  tags: string[];
  features: string[];
}

export class AIToolsService {
  static async searchTools(query: string): Promise<AITool[]> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `
        Based on this user query: "${query}"
        
        Please recommend AI tools that would be helpful. Return the response in this exact JSON format:
        {
          "tools": [
            {
              "name": "Tool Name",
              "description": "Brief description in Arabic",
              "url": "https://tool-url.com",
              "pricing": "free|freemium|paid",
              "arabicSupport": true|false,
              "rating": 4.5,
              "tags": ["tag1", "tag2"],
              "features": ["feature1", "feature2"]
            }
          ]
        }

        Rules:
        - Return 3-5 relevant tools
        - Description must be in Arabic
        - Only include real, existing AI tools
        - Ensure URLs are valid
        - Rating should be between 1-5
        - Include relevant tags and key features
        - Be accurate about Arabic language support
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const data = JSON.parse(text);
        return data.tools;
      } catch (e) {
        console.error('Failed to parse Gemini response:', e);
        return [];
      }
    } catch (e) {
      console.error('Error calling Gemini API:', e);
      return [];
    }
  }
}