import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../services/chat.service';

// Map to store conversation history (if needed)
const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long (max 1000 characters)'),
  conversationId: z.uuid(),
});

export const chatController = {
  async sendMessage(req: Request, res: Response) {
    const parsResult = chatSchema.safeParse(req.body);
    if (!parsResult.success) {
      if (parsResult.error instanceof z.ZodError) {
        const tree = z.treeifyError(parsResult.error);
        return res.status(400).json({ errors: tree });
      }
    }

    try {
      const { prompt, conversationId } = req.body;
      const response = await chatService.sendMessage(prompt, conversationId);

      res.json({ message: response.message });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
    }
  },
};
