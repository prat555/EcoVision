import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/simple-storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const stats = await storage.getStats();
    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error in stats route:', error);
    return res.status(500).json({
      message: `Error fetching stats: ${error instanceof Error ? error.message : String(error)}`
    });
  }
} 