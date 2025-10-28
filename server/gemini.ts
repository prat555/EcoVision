import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Validate API key on startup
if (!process.env.GEMINI_API_KEY) {
  console.error('⚠️  GEMINI_API_KEY environment variable is not set!');
  console.error('Please add your Gemini API key to the .env file');
}

export interface WasteAnalysisResult {
  category: 'recyclable' | 'compostable' | 'special' | 'landfill';
  itemName: string;
  disposalInstructions: string[];
  environmentalImpact: string;
}

/**
 * Analyze waste image using Gemini Vision API
 * Much faster and more accurate than Hugging Face models
 */
export async function analyzeWasteImage(base64Image: string): Promise<WasteAnalysisResult> {
  try {
    // Use Gemini 2.0 Flash for fast, accurate vision analysis
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are an expert in waste management and recycling. Analyze this image and identify the waste item(s).

Classify the waste into ONE of these categories:
- recyclable: Items that can be recycled (plastic bottles, paper, cardboard, metal cans, glass)
- compostable: Organic waste that can be composted (food scraps, yard waste, paper products)
- special: Items requiring special disposal (electronics, batteries, chemicals, light bulbs)
- landfill: Items that must go to landfill (contaminated items, certain plastics, mixed materials)

Provide detailed, practical disposal instructions and environmental impact information.

Respond with ONLY valid JSON in this exact format:
{
  "category": "recyclable|compostable|special|landfill",
  "itemName": "name of the item",
  "disposalInstructions": ["instruction 1", "instruction 2", "instruction 3"],
  "environmentalImpact": "brief description of environmental impact"
}`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg"
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON response
    let analysisResult: WasteAnalysisResult;
    try {
      // Clean the response text (remove markdown code blocks if present)
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(cleanedText);
    } catch (parseError) {
      console.warn("Failed to parse JSON from Gemini, attempting text extraction:", text);
      analysisResult = extractWasteInfoFromText(text);
    }

    // Validate the result
    if (!analysisResult.category || !analysisResult.itemName || 
        !analysisResult.disposalInstructions || !analysisResult.environmentalImpact) {
      throw new Error("Invalid response structure from Gemini");
    }

    // Ensure disposalInstructions is an array
    if (!Array.isArray(analysisResult.disposalInstructions)) {
      analysisResult.disposalInstructions = [String(analysisResult.disposalInstructions)];
    }

    return analysisResult;
  } catch (error) {
    console.error("Error analyzing waste image with Gemini:", error);
    
    // Return a helpful fallback response
    return {
      category: 'landfill',
      itemName: 'Unknown Item',
      disposalInstructions: [
        'Unable to identify the item clearly.',
        'Please take a clearer photo with good lighting.',
        'Consult your local waste management guidelines for proper disposal.'
      ],
      environmentalImpact: 'Unable to determine environmental impact. Please dispose of responsibly and consider reducing waste.'
    };
  }
}

/**
 * Get chat response using Gemini
 * Fast and intelligent responses for sustainability questions
 */
export async function getChatResponse(message: string): Promise<string> {
  try {
    // Use Gemini 2.0 Flash for fast chat responses
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are EcoBot, an AI sustainability assistant specialized in waste management and environmental topics. Provide helpful, educational responses about proper waste disposal, recycling, sustainability practices, and environmental impact. Keep responses informative but concise (under 150 words). Always be encouraging and positive about sustainable practices. Focus on practical advice and actionable steps users can take." }],
        },
        {
          role: "model",
          parts: [{ text: "Hello! I'm EcoBot, your sustainability assistant. I'm here to help you with waste management, recycling, and environmental questions. How can I assist you today?" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error getting chat response from Gemini:", error);
    return "I'm experiencing some technical difficulties right now. Please try asking your question again, or consult your local environmental guidelines for waste management advice.";
  }
}

/**
 * Helper function to extract waste info from text response if JSON parsing fails
 */
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
    const itemMatch = text.match(/item[Nn]ame[":\s]*["']?([^"'\n,}]+)["']?/i);
    if (itemMatch) {
      defaultResult.itemName = itemMatch[1].trim();
    }

    // Try to extract disposal instructions
    const instructionsMatch = text.match(/disposalInstructions[":\s]*\[([^\]]+)\]/i);
    if (instructionsMatch) {
      const instructions = instructionsMatch[1]
        .split(/[",]+/)
        .map(s => s.trim())
        .filter(s => s.length > 10);
      if (instructions.length > 0) {
        defaultResult.disposalInstructions = instructions;
      }
    }

    // Try to extract environmental impact
    const impactMatch = text.match(/environmental[Ii]mpact[":\s]*["']?([^"'\n}]+)["']?/i);
    if (impactMatch) {
      defaultResult.environmentalImpact = impactMatch[1].trim();
    }

    return defaultResult;
  } catch (error) {
    return defaultResult;
  }
}
