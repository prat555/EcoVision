import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { analyzeWasteImage } from '../server/deepseek';
import { storage } from '../server/simple-storage';

const wasteImageSchema = z.object({
  imageData: z.string().min(1)
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const validation = wasteImageSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Invalid request data',
        errors: validation.error.format()
      });
    }
    const { imageData } = validation.data;
    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');
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
    console.error('Error in analyze-waste route:', error);
    return res.status(500).json({
      message: `Error analyzing waste: ${error instanceof Error ? error.message : String(error)}`
    });
  }
} 