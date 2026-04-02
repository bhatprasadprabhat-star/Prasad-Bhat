import OpenAI from 'openai';

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateSmartReply({ message, tone = 'professional', context = 'general support' }) {
  if (!client) {
    return `[Mock ${tone} reply] Thanks for reaching out about ${context}. We received: "${message}".`;
  }

  const prompt = `Generate a concise ${tone} response for context: ${context}. User message: ${message}`;
  const result = await client.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    input: prompt
  });

  return result.output_text || 'Thanks for your message. Our team will respond shortly.';
}
