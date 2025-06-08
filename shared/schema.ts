import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  username: text("username").notNull().unique(),
  email: text("email"),
  password: text("password"), // Removed .notNull() to allow null for guest users
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  isGuest: boolean("is_guest").default(false).notNull(), // Added guest flag
  guestId: text("guest_id").unique(), // Added for guest user tracking
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Updated insert schema with correct customization syntax
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3),
  password: z.string().min(6).optional(),
}).omit({
  id: true,
  resetToken: true,
  resetTokenExpiry: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Changed to allow null for guests
  imageData: text("image_data").notNull(),
  result: text("result").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).pick({
  userId: true,
  imageData: true,
  result: true,
  category: true,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Changed to allow null for guests
  guestId: text("guest_id"), // Added for guest user tracking
  message: text("message").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  guestId: true,
  message: true,
  response: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Add a schema for guest users
export const guestUserSchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  name: z.string().optional(),
  isGuest: z.literal(true),
  guestId: z.string(),
  createdAt: z.string().optional(),
});

export type GuestUser = z.infer<typeof guestUserSchema>;