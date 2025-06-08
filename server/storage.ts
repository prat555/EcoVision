import { 
  type User, 
  type InsertUser, 
  type Analysis, 
  type InsertAnalysis,
  type ChatMessage,
  type InsertChatMessage,
  users,
  analyses,
  chatMessages
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByResetToken(resetToken: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserResetToken(userId: number, resetToken: string, resetTokenExpiry: Date): Promise<User>;
  updateUserPassword(userId: number, newPassword: string): Promise<User>;
  
  getAnalysis(id: number): Promise<Analysis | undefined>;
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  
  getChatMessage(id: number): Promise<ChatMessage | undefined>;
  getChatMessagesByUserId(userId: number | null): Promise<ChatMessage[]>;
  createChatMessage(chatMessage: InsertChatMessage): Promise<ChatMessage>;
  
  getStats(): Promise<{
    itemsAnalyzed: number;
    accuracy: string;
    wasteAverted: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results[0];
  }

  async getUserByResetToken(resetToken: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.resetToken, resetToken));
    return results[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUserResetToken(userId: number, resetToken: string, resetTokenExpiry: Date): Promise<User> {
    const result = await db
      .update(users)
      .set({ 
        resetToken,
        resetTokenExpiry
      })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<User> {
    const result = await db
      .update(users)
      .set({ 
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null
      })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  // Analysis methods
  async getAnalysis(id: number): Promise<Analysis | undefined> {
    const results = await db.select().from(analyses).where(eq(analyses.id, id));
    return results[0];
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const result = await db.insert(analyses).values(insertAnalysis).returning();
    return result[0];
  }

  // Chat message methods
  async getChatMessage(id: number): Promise<ChatMessage | undefined> {
    const results = await db.select().from(chatMessages).where(eq(chatMessages.id, id));
    return results[0];
  }

  async getChatMessagesByUserId(userId: number | null): Promise<ChatMessage[]> {
    return db.select().from(chatMessages)
      .where(userId === null ? sql`${chatMessages.userId} IS NULL` : eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.createdAt));
  }

  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const result = await db.insert(chatMessages).values(insertChatMessage).returning();
    return result[0];
  }

  // Stats methods
  async getStats(): Promise<{ itemsAnalyzed: number; accuracy: string; wasteAverted: string }> {
    const result = await db.select({ count: count() }).from(analyses);
    const analysesCount = result[0].count;
    
    // Return static stats for now, in a real app these would be calculated
    return {
      itemsAnalyzed: analysesCount,
      accuracy: "89%",
      wasteAverted: `${Math.round(analysesCount * 0.2)} kg`
    };
  }
}

export const storage = new DatabaseStorage();
