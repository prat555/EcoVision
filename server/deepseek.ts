import OpenAI from "openai";
import fetch from "node-fetch";

// Using DeepSeek R1 through OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://ecovision-app.com", // Optional: your app URL
    "X-Title": "EcoVision", // Optional: your app name
  },
});

// Hugging Face API config
const HF_API_TOKEN = process.env.HF_API_TOKEN;
const HF_MODEL_URL = "https://api-inference.huggingface.co/models/amariayudha/RealWaste_Prediction_Deep_Learning";

// Validate API keys on startup
if (!process.env.OPENROUTER_API_KEY) {
  console.error('⚠️  OPENROUTER_API_KEY environment variable is not set!');
  console.error('Please add your OpenRouter API key to the .env file');
}
if (!HF_API_TOKEN) {
  console.warn('⚠️  HF_API_TOKEN environment variable is not set! Hugging Face image analysis will not work.');
}

export interface WasteAnalysisResult {
  category: 'recyclable' | 'compostable' | 'special' | 'landfill';
  itemName: string;
  disposalInstructions: string[];
  environmentalImpact: string;
}


// Main image analysis function: switch between DeepSeek and Hugging Face
export async function analyzeWasteImage(base64Image: string, provider: 'deepseek' | 'huggingface' = 'deepseek'): Promise<WasteAnalysisResult> {
  if (provider === 'huggingface') {
    return analyzeWasteImageHuggingFace(base64Image);
  }
  return analyzeWasteImageDeepSeek(base64Image);
}

// DeepSeek implementation (existing)
async function analyzeWasteImageDeepSeek(base64Image: string): Promise<WasteAnalysisResult> {
  try {
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
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response content received");
    }

    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.warn("Failed to parse JSON, attempting text extraction:", content);
      result = extractWasteInfoFromText(content);
    }

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
    return {
      category: 'landfill',
      itemName: 'Unknown Item',
      disposalInstructions: ['Please consult your local waste management guidelines for proper disposal.'],
      environmentalImpact: 'Unable to determine environmental impact. Please dispose of responsibly.'
    };
  }
}

// Hugging Face implementation
async function analyzeWasteImageHuggingFace(base64Image: string): Promise<WasteAnalysisResult> {
  if (!HF_API_TOKEN) {
    return {
      category: 'landfill',
      itemName: 'Unknown Item',
      disposalInstructions: ['Hugging Face API token not set.'],
      environmentalImpact: 'Unable to determine environmental impact.'
    };
  }
  try {
    // Convert base64 to binary buffer
    const buffer = Buffer.from(base64Image, 'base64');
    const response = await fetch(HF_MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/octet-stream',
        'Accept': 'application/json',
      },
      body: buffer,
    });
    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    // The model returns an array of predictions, pick the top one
    const top = Array.isArray(result) && result.length > 0 ? result[0] : null;
    if (!top || !top.label) {
      throw new Error('No prediction returned from Hugging Face model');
    }
    // Map label to your WasteAnalysisResult
    return {
      category: 'recyclable', // Default, you may want to map label to category
      itemName: top.label,
      disposalInstructions: [`Dispose of ${top.label} as recommended by local guidelines.`],
      environmentalImpact: `Predicted as ${top.label} with score ${top.score}`
    };
  } catch (error) {
    console.error("Error analyzing waste image with Hugging Face:", error);
    return {
      category: 'landfill',
      itemName: 'Unknown Item',
      disposalInstructions: ['Error using Hugging Face API.'],
      environmentalImpact: 'Unable to determine environmental impact.'
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
    const categoryMatch = text.match(/category[":\s]*["']?(recyclable|compostable|special|landfill)["']?/i);
    if (categoryMatch) {
      defaultResult.category = categoryMatch[1].toLowerCase() as any;
    }

    // Try to extract item name
    const itemMatch = text.match(/item[Nn]ame[":\s]*["']?([^"'\n,]+)["']?/i);
    if (itemMatch) {
      defaultResult.itemName = itemMatch[1].trim();
    }

    // Try to extract environmental impact
    const impactMatch = text.match(/environmental[Ii]mpact[":\s]*["']?([^"'\n]+)["']?/i);
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