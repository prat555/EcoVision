import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { getChatResponse } from '../server/deepseek';
import { storage } from '../server/simple-storage';

const chatMessageSchema = z.object({
  message: z.string().min(1)
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const validation = chatMessageSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Invalid request data',
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
    console.error('Error in chat route:', error);
    return res.status(500).json({
      message: `Error processing chat message: ${error instanceof Error ? error.message : String(error)}`
    });
  }
} 