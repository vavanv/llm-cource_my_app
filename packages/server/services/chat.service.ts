import OpenAI from 'openai';

import { conversationRepository } from '../repositories/conversation.repository';

type ChatResponse = {
  id: string;
  message: string;
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Leaky abstraction
export const chatService = {
  sendMessage: async (prompt: string, conversationId: string): Promise<ChatResponse> => {
    const previousResponseId = conversationRepository.getLastResponseId(conversationId);

    const response = await client.responses.create({
      model: 'gpt-4o',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      ...(previousResponseId && { previous_response_id: previousResponseId }),
    });

    conversationRepository.setLastResponseId(conversationId, response.id);

    return { id: response.id, message: response.output_text };
  },
};
