import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';
import type { Request, Response } from 'express';
import { conversationRepository } from './repositories/conversation.repository';

dotenv.config();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(express.json());

app.get('/', (_: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello world' });
});

// Map to store conversation history (if needed)
const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long (max 1000 characters)'),
  conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const parsResult = chatSchema.safeParse(req.body);
  if (!parsResult.success) {
    if (parsResult.error instanceof z.ZodError) {
      const tree = z.treeifyError(parsResult.error);
      return res.status(400).json({ errors: tree });
    }
  }

  try {
    const { prompt, conversationId } = req.body;

    const response = await client.responses.create({
      model: 'gpt-4o',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id: conversationRepository.getLastResponseId(conversationId),
    });

    conversationRepository.setLastResponseId(conversationId, response.id);

    res.json({ message: response.output_text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
