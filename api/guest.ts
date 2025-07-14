import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const guestUser = {
      id: `guest-${Date.now()}`,
      username: req.body?.username || `guest-${Date.now()}`,
      name: req.body?.name || 'Guest User',
      email: null,
      isGuest: true,
      guestId: req.body?.guestId,
      createdAt: new Date().toISOString(),
    };
    res.status(201).json(guestUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create guest user' });
  }
} 