import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./simple-storage";
import { analyzeWasteImage, getChatResponse } from "./deepseek";
import { z } from "zod";
import { setupAuth } from "./firebase-auth";

const wasteImageSchema = z.object({
  imageData: z.string().min(1)
});

const chatMessageSchema = z.object({
  message: z.string().min(1)
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  // Analyze waste route
  app.post("/api/analyze-waste", async (req, res) => {
    try {
      const validation = wasteImageSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: validation.error.format()
        });
      }
      const { imageData } = validation.data;
      // Optional: allow provider selection via ?provider=huggingface or body.provider
      const provider = (req.query.provider || req.body.provider || 'deepseek') as 'deepseek' | 'huggingface';
      // Strip the prefix from the base64 string if present
      const base64Image = imageData.replace(/^data:image\/\w+;base64,/, "");
      // Call selected provider for analysis
      const analysisResult = await analyzeWasteImage(base64Image, provider);
      // Store the analysis result
      const analysis = await storage.createAnalysis({
        imageData: base64Image,
        result: JSON.stringify(analysisResult),
        category: analysisResult.category
      });
      return res.status(200).json({
        id: analysis.id,
        category: analysisResult.category,
        itemName: analysisResult.itemName,
        disposalInstructions: analysisResult.disposalInstructions,
        environmentalImpact: analysisResult.environmentalImpact
      });
    } catch (error) {
      console.error("Error in analyze-waste route:", error);
      return res.status(500).json({ 
        message: `Error analyzing waste: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  });

  // Chat with AI assistant route
  app.post("/api/chat", async (req, res) => {
    try {
      const validation = chatMessageSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: validation.error.format()
        });
      }
      
      const { message } = validation.data;
      
      // Call DeepSeek R1 for chat response
      const response = await getChatResponse(message);
      
      // Store the chat message and response
      const chatMessage = await storage.createChatMessage({
        userId: null,
        message,
        response
      });
      
      return res.status(200).json({
        id: chatMessage.id,
        message,
        response
      });
    } catch (error) {
      console.error("Error in chat route:", error);
      return res.status(500).json({ 
        message: `Error processing chat message: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  });

  // Stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error("Error in stats route:", error);
      return res.status(500).json({ 
        message: `Error fetching stats: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
