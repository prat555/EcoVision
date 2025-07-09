// Simplified storage for Firebase migration
// This provides basic in-memory storage for analyses and chat messages
// In a full Firebase implementation, these would be stored in Firestore

export interface Analysis {
  id: number;
  userId?: number | null;
  imageData: string;
  result: string;
  category: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: number;
  userId?: number | null;
  guestId?: string | null;
  message: string;
  response: string;
  createdAt: Date;
}

export interface IStorage {
  createAnalysis(analysis: Omit<Analysis, 'id' | 'createdAt'>): Promise<Analysis>;
  createChatMessage(chatMessage: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage>;
  getStats(): Promise<{
    itemsAnalyzed: number;
    accuracy: string;
    wasteAverted: string;
  }>;
}

export class SimpleStorage implements IStorage {
  private analyses: Analysis[] = [];
  private chatMessages: ChatMessage[] = [];
  private nextAnalysisId = 1;
  private nextChatId = 1;

  async createAnalysis(analysis: Omit<Analysis, 'id' | 'createdAt'>): Promise<Analysis> {
    const newAnalysis: Analysis = {
      ...analysis,
      id: this.nextAnalysisId++,
      createdAt: new Date(),
    };
    
    this.analyses.push(newAnalysis);
    return newAnalysis;
  }

  async createChatMessage(chatMessage: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> {
    const newChatMessage: ChatMessage = {
      ...chatMessage,
      id: this.nextChatId++,
      createdAt: new Date(),
    };
    
    this.chatMessages.push(newChatMessage);
    return newChatMessage;
  }

  async getStats(): Promise<{ itemsAnalyzed: number; accuracy: string; wasteAverted: string }> {
    const analysesCount = this.analyses.length;
    
    return {
      itemsAnalyzed: analysesCount,
      accuracy: "89%",
      wasteAverted: `${Math.round(analysesCount * 0.2)} kg`
    };
  }
}

export const storage = new SimpleStorage();