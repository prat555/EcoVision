import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

export interface WasteAnalysisResult {
  category: 'recyclable' | 'compostable' | 'special' | 'landfill';
  itemName: string;
  disposalInstructions: string[];
  environmentalImpact: string;
}

export async function analyzeWasteImage(base64Image: string): Promise<WasteAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are an expert in waste management and recycling. Analyze the provided image and identify waste items. " +
            "Classify the waste as one of: recyclable, compostable, special (requires special disposal), or landfill. " +
            "Provide detailed disposal instructions and environmental impact information. " +
            "Respond with JSON in this format: { category: string, itemName: string, disposalInstructions: string[], environmentalImpact: string }"
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "What type of waste is in this image? Provide classification, disposal instructions, and environmental impact."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      category: result.category,
      itemName: result.itemName,
      disposalInstructions: result.disposalInstructions,
      environmentalImpact: result.environmentalImpact
    };
  } catch (error) {
    console.error("Error analyzing waste image:", error);
    throw new Error(`Failed to analyze waste image: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getChatResponse(message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are EcoBot, an AI sustainability assistant specialized in waste management and environmental topics. " +
            "Provide helpful, educational responses about proper waste disposal, recycling, sustainability practices, and environmental impact. " +
            "Keep responses informative but concise (under 150 words). Always be encouraging and positive about sustainable practices."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error getting chat response:", error);
    throw new Error(`Failed to get chat response: ${error instanceof Error ? error.message : String(error)}`);
  }
}
