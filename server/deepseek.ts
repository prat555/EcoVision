import OpenAI from "openai";

// Using DeepSeek R1 through OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://ecovision-app.com", // Optional: your app URL
    "X-Title": "EcoVision", // Optional: your app name
  },
});

// Validate API key on startup
if (!process.env.OPENROUTER_API_KEY) {
  console.error('⚠️  OPENROUTER_API_KEY environment variable is not set!');
  console.error('Please add your OpenRouter API key to the .env file');
}

export interface WasteAnalysisResult {
  category: 'recyclable' | 'compostable' | 'special' | 'landfill';
  itemName: string;
  disposalInstructions: string[];
  environmentalImpact: string;
}

export async function analyzeWasteImage(base64Image: string): Promise<WasteAnalysisResult> {
  try {
    // DeepSeek R1 supports vision, so we can use the same format
    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1",
      messages: [
        {
          role: "system",
          content: 
            "You are an expert in waste management and recycling. Analyze the provided image and identify waste items. " +
            "Classify the waste as one of: recyclable, compostable, special (requires special disposal), or landfill. " +
            "Provide detailed disposal instructions and environmental impact information. " +
            "Respond with JSON in this exact format: { \"category\": \"recyclable|compostable|special|landfill\", \"itemName\": \"string\", \"disposalInstructions\": [\"string1\", \"string2\"], \"environmentalImpact\": \"string\" }"
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
      max_tokens: 800,
      temperature: 0.1, // Lower temperature for more consistent responses
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response content received");
    }

    // Try to parse JSON response
    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      // If JSON parsing fails, try to extract information from text response
      console.warn("Failed to parse JSON, attempting text extraction:", content);
      result = extractWasteInfoFromText(content);
    }
    
    // Validate the result structure
    if (!result.category || !result.itemName || !result.disposalInstructions || !result.environmentalImpact) {
      throw new Error("Invalid response structure from AI");
    }

    return {
      category: result.category,
      itemName: result.itemName,
      disposalInstructions: Array.isArray(result.disposalInstructions) ? result.disposalInstructions : [result.disposalInstructions],
      environmentalImpact: result.environmentalImpact
    };
  } catch (error) {
    console.error("Error analyzing waste image:", error);
    
    // Fallback response if AI fails
    return {
      category: 'landfill',
      itemName: 'Unknown Item',
      disposalInstructions: ['Please consult your local waste management guidelines for proper disposal.'],
      environmentalImpact: 'Unable to determine environmental impact. Please dispose of responsibly.'
    };
  }
}

// Helper function to extract waste info from text response if JSON parsing fails
function extractWasteInfoFromText(text: string): WasteAnalysisResult {
  const defaultResult: WasteAnalysisResult = {
    category: 'landfill',
    itemName: 'Unknown Item',
    disposalInstructions: ['Please consult your local waste management guidelines.'],
    environmentalImpact: 'Environmental impact assessment unavailable.'
  };

  try {
    // Try to extract category
    const categoryMatch = text.match(/category[\":\s]*[\"']?(recyclable|compostable|special|landfill)[\"']?/i);
    if (categoryMatch) {
      defaultResult.category = categoryMatch[1].toLowerCase() as any;
    }

    // Try to extract item name
    const itemMatch = text.match(/item[Nn]ame[\":\s]*[\"']?([^\"'\n,]+)[\"']?/i);
    if (itemMatch) {
      defaultResult.itemName = itemMatch[1].trim();
    }

    // Try to extract environmental impact
    const impactMatch = text.match(/environmental[Ii]mpact[\":\s]*[\"']?([^\"'\n]+)[\"']?/i);
    if (impactMatch) {
      defaultResult.environmentalImpact = impactMatch[1].trim();
    }

    return defaultResult;
  } catch (error) {
    return defaultResult;
  }
}

export async function getChatResponse(message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1",
      messages: [
        {
          role: "system",
          content: 
            "You are EcoBot, an AI sustainability assistant specialized in waste management and environmental topics. " +
            "Provide helpful, educational responses about proper waste disposal, recycling, sustainability practices, and environmental impact. " +
            "Keep responses informative but concise (under 150 words). Always be encouraging and positive about sustainable practices. " +
            "Focus on practical advice and actionable steps users can take."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7, // Slightly higher temperature for more natural conversation
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "I'm experiencing some technical difficulties right now. Please try asking your question again, or consult your local environmental guidelines for waste management advice.";
  }
}