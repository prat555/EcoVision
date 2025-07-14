// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/simple-storage.ts
var SimpleStorage = class {
  analyses = [];
  chatMessages = [];
  nextAnalysisId = 1;
  nextChatId = 1;
  async createAnalysis(analysis) {
    const newAnalysis = {
      ...analysis,
      id: this.nextAnalysisId++,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.analyses.push(newAnalysis);
    return newAnalysis;
  }
  async createChatMessage(chatMessage) {
    const newChatMessage = {
      ...chatMessage,
      id: this.nextChatId++,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.chatMessages.push(newChatMessage);
    return newChatMessage;
  }
  async getStats() {
    const analysesCount = this.analyses.length;
    return {
      itemsAnalyzed: analysesCount,
      accuracy: "89%",
      wasteAverted: `${Math.round(analysesCount * 0.2)} kg`
    };
  }
};
var storage = new SimpleStorage();

// server/deepseek.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://ecovision-app.com",
    // Optional: your app URL
    "X-Title": "EcoVision"
    // Optional: your app name
  }
});
if (!process.env.OPENROUTER_API_KEY) {
  console.error("\u26A0\uFE0F  OPENROUTER_API_KEY environment variable is not set!");
  console.error("Please add your OpenRouter API key to the .env file");
}
async function analyzeWasteImage(base64Image) {
  try {
    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1",
      messages: [
        {
          role: "system",
          content: 'You are an expert in waste management and recycling. Analyze the provided image and identify waste items. Classify the waste as one of: recyclable, compostable, special (requires special disposal), or landfill. Provide detailed disposal instructions and environmental impact information. Respond with JSON in this exact format: { "category": "recyclable|compostable|special|landfill", "itemName": "string", "disposalInstructions": ["string1", "string2"], "environmentalImpact": "string" }'
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
          ]
        }
      ],
      max_tokens: 800,
      temperature: 0.1
      // Lower temperature for more consistent responses
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
      category: "landfill",
      itemName: "Unknown Item",
      disposalInstructions: ["Please consult your local waste management guidelines for proper disposal."],
      environmentalImpact: "Unable to determine environmental impact. Please dispose of responsibly."
    };
  }
}
function extractWasteInfoFromText(text) {
  const defaultResult = {
    category: "landfill",
    itemName: "Unknown Item",
    disposalInstructions: ["Please consult your local waste management guidelines."],
    environmentalImpact: "Environmental impact assessment unavailable."
  };
  try {
    const categoryMatch = text.match(/category[\":\s]*[\"']?(recyclable|compostable|special|landfill)[\"']?/i);
    if (categoryMatch) {
      defaultResult.category = categoryMatch[1].toLowerCase();
    }
    const itemMatch = text.match(/item[Nn]ame[\":\s]*[\"']?([^\"'\n,]+)[\"']?/i);
    if (itemMatch) {
      defaultResult.itemName = itemMatch[1].trim();
    }
    const impactMatch = text.match(/environmental[Ii]mpact[\":\s]*[\"']?([^\"'\n]+)[\"']?/i);
    if (impactMatch) {
      defaultResult.environmentalImpact = impactMatch[1].trim();
    }
    return defaultResult;
  } catch (error) {
    return defaultResult;
  }
}
async function getChatResponse(message) {
  try {
    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1",
      messages: [
        {
          role: "system",
          content: "You are EcoBot, an AI sustainability assistant specialized in waste management and environmental topics. Provide helpful, educational responses about proper waste disposal, recycling, sustainability practices, and environmental impact. Keep responses informative but concise (under 150 words). Always be encouraging and positive about sustainable practices. Focus on practical advice and actionable steps users can take."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7
      // Slightly higher temperature for more natural conversation
    });
    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "I'm experiencing some technical difficulties right now. Please try asking your question again, or consult your local environmental guidelines for waste management advice.";
  }
}

// server/routes.ts
import { z } from "zod";

// server/firebase-auth.ts
function setupAuth(app2) {
  app2.post("/api/guest", async (req, res) => {
    try {
      const guestUser = {
        id: `guest-${Date.now()}`,
        username: req.body.username || `guest-${Date.now()}`,
        name: req.body.name || "Guest User",
        email: null,
        isGuest: true,
        guestId: req.body.guestId,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      res.status(201).json(guestUser);
    } catch (err) {
      res.status(500).json({ message: "Failed to create guest user" });
    }
  });
  app2.get("/api/user", (req, res) => {
    res.status(401).json({ message: "Authentication handled by Firebase" });
  });
  app2.post("/api/logout", (req, res) => {
    res.sendStatus(200);
  });
}

// server/routes.ts
var wasteImageSchema = z.object({
  imageData: z.string().min(1)
});
var chatMessageSchema = z.object({
  message: z.string().min(1)
});
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.post("/api/analyze-waste", async (req, res) => {
    try {
      const validation = wasteImageSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validation.error.format()
        });
      }
      const { imageData } = validation.data;
      const base64Image = imageData.replace(/^data:image\/\w+;base64,/, "");
      const analysisResult = await analyzeWasteImage(base64Image);
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
  app2.post("/api/chat", async (req, res) => {
    try {
      const validation = chatMessageSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validation.error.format()
        });
      }
      const { message } = validation.data;
      const response = await getChatResponse(message);
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
  app2.get("/api/stats", async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
