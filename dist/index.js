var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  analyses: () => analyses,
  chatMessages: () => chatMessages,
  guestUserSchema: () => guestUserSchema,
  insertAnalysisSchema: () => insertAnalysisSchema,
  insertChatMessageSchema: () => insertChatMessageSchema,
  insertUserSchema: () => insertUserSchema,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  username: text("username").notNull().unique(),
  email: text("email"),
  password: text("password"),
  // Removed .notNull() to allow null for guest users
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  isGuest: boolean("is_guest").default(false).notNull(),
  // Added guest flag
  guestId: text("guest_id").unique(),
  // Added for guest user tracking
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3),
  password: z.string().min(6).optional()
}).omit({
  id: true,
  resetToken: true,
  resetTokenExpiry: true,
  createdAt: true
});
var analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  // Changed to allow null for guests
  imageData: text("image_data").notNull(),
  result: text("result").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertAnalysisSchema = createInsertSchema(analyses).pick({
  userId: true,
  imageData: true,
  result: true,
  category: true
});
var chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  // Changed to allow null for guests
  guestId: text("guest_id"),
  // Added for guest user tracking
  message: text("message").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  guestId: true,
  message: true,
  response: true
});
var guestUserSchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  name: z.string().optional(),
  isGuest: z.literal(true),
  guestId: z.string(),
  createdAt: z.string().optional()
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, count, sql } from "drizzle-orm";
var DatabaseStorage = class {
  // User methods
  async getUser(id) {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  }
  async getUserByUsername(username) {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results[0];
  }
  async getUserByResetToken(resetToken) {
    const results = await db.select().from(users).where(eq(users.resetToken, resetToken));
    return results[0];
  }
  async createUser(insertUser) {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  async updateUserResetToken(userId, resetToken, resetTokenExpiry) {
    const result = await db.update(users).set({
      resetToken,
      resetTokenExpiry
    }).where(eq(users.id, userId)).returning();
    return result[0];
  }
  async updateUserPassword(userId, newPassword) {
    const result = await db.update(users).set({
      password: newPassword,
      resetToken: null,
      resetTokenExpiry: null
    }).where(eq(users.id, userId)).returning();
    return result[0];
  }
  // Analysis methods
  async getAnalysis(id) {
    const results = await db.select().from(analyses).where(eq(analyses.id, id));
    return results[0];
  }
  async createAnalysis(insertAnalysis) {
    const result = await db.insert(analyses).values(insertAnalysis).returning();
    return result[0];
  }
  // Chat message methods
  async getChatMessage(id) {
    const results = await db.select().from(chatMessages).where(eq(chatMessages.id, id));
    return results[0];
  }
  async getChatMessagesByUserId(userId) {
    return db.select().from(chatMessages).where(userId === null ? sql`${chatMessages.userId} IS NULL` : eq(chatMessages.userId, userId)).orderBy(desc(chatMessages.createdAt));
  }
  async createChatMessage(insertChatMessage) {
    const result = await db.insert(chatMessages).values(insertChatMessage).returning();
    return result[0];
  }
  // Stats methods
  async getStats() {
    const result = await db.select({ count: count() }).from(analyses);
    const analysesCount = result[0].count;
    return {
      itemsAnalyzed: analysesCount,
      accuracy: "89%",
      wasteAverted: `${Math.round(analysesCount * 0.2)} kg`
    };
  }
};
var storage = new DatabaseStorage();

// server/openai.ts
import OpenAI from "openai";
var openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
async function analyzeWasteImage(base64Image) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in waste management and recycling. Analyze the provided image and identify waste items. Classify the waste as one of: recyclable, compostable, special (requires special disposal), or landfill. Provide detailed disposal instructions and environmental impact information. Respond with JSON in this format: { category: string, itemName: string, disposalInstructions: string[], environmentalImpact: string }"
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
      response_format: { type: "json_object" },
      max_tokens: 800
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
async function getChatResponse(message) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are EcoBot, an AI sustainability assistant specialized in waste management and environmental topics. Provide helpful, educational responses about proper waste disposal, recycling, sustainability practices, and environmental impact. Keep responses informative but concise (under 150 words). Always be encouraging and positive about sustainable practices."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300
    });
    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error getting chat response:", error);
    throw new Error(`Failed to get chat response: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// server/routes.ts
import { z as z2 } from "zod";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import pgSession from "connect-pg-simple";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const PostgresSessionStore = pgSession(session);
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "ecovision-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1e3
      // 30 days
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || void 0);
    } catch (err) {
      done(err);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid username or password" });
      req.login(user, (err2) => {
        if (err2) return next(err2);
        res.status(200).json(user);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
  app2.post("/api/forgot-password", async (req, res, next) => {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(200).json({ message: "If an account with that username exists, a password reset link has been sent." });
      }
      const resetToken = uuidv4();
      const resetTokenExpiry = new Date(Date.now() + 1e3 * 60 * 60);
      await storage.updateUserResetToken(user.id, resetToken, resetTokenExpiry);
      console.log(`Reset token for ${username}: ${resetToken}`);
      return res.status(200).json({
        message: "If an account with that username exists, a password reset link has been sent.",
        // In a real app, we would NOT include this, but for demo purposes:
        resetToken,
        resetTokenExpiry
      });
    } catch (err) {
      next(err);
    }
  });
  app2.post("/api/reset-password", async (req, res, next) => {
    try {
      const { resetToken, newPassword } = req.body;
      if (!resetToken || !newPassword) {
        return res.status(400).json({ message: "Reset token and new password are required" });
      }
      const user = await storage.getUserByResetToken(resetToken);
      if (!user || !user.resetTokenExpiry) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
      const now = /* @__PURE__ */ new Date();
      if (now > user.resetTokenExpiry) {
        return res.status(400).json({ message: "Reset token has expired" });
      }
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(user.id, hashedPassword);
      return res.status(200).json({ message: "Password has been reset successfully" });
    } catch (err) {
      next(err);
    }
  });
}

// server/routes.ts
var wasteImageSchema = z2.object({
  imageData: z2.string().min(1)
});
var chatMessageSchema = z2.object({
  message: z2.string().min(1)
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
      "@shared": path.resolve(import.meta.dirname, "shared"),
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
