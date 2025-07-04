import OpenAI from 'openai';

// Initialize OpenAI client only if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function chatWithOpenAI(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  temperature = 0.7,
  maxTokens = 500,
  model = 'gpt-4o'          // для премиум-аккаунтов,
  // можно подменять на 'gpt-3.5-turbo-0125' для бесплатного тарифа
) {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const resp = await openai.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  return resp.choices[0].message.content?.trim() || '';
}