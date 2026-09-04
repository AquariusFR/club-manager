import { createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

// Instance for Groq (compatible with OpenAI standard)
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY || '',
});

// Instance for OpenRouter (compatible with OpenAI standard)
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  // Default headers for OpenRouter
  headers: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'RCBA App',
  },
});

// New instances for free providers using OpenAI compatible endpoints
const together = createOpenAI({
  baseURL: 'https://api.together.xyz/v1',
  apiKey: process.env.TOGETHER_API_KEY || '',
});

const mistral = createOpenAI({
  baseURL: 'https://api.mistral.ai/v1',
  apiKey: process.env.MISTRAL_API_KEY || '',
});

const github = createOpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.GITHUB_TOKEN || '',
});

const deepseek = createOpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
});

const huggingface = createOpenAI({
  baseURL: 'https://api-inference.huggingface.co/v1/',
  apiKey: process.env.HUGGINGFACE_API_KEY || '',
});

export type LLMProvider = 'google' | 'groq' | 'openrouter' | 'together' | 'mistral' | 'github' | 'deepseek' | 'huggingface';

/**
 * Returns the corresponding language model instance based on the provider and model ID.
 * 
 * @param provider - The name of the API provider (e.g., 'google', 'groq', 'openrouter', 'together')
 * @param modelId - The specific model identifier (e.g., 'gemini-1.5-flash', 'llama3-8b-8192')
 * @returns A language model object compatible with Vercel AI SDK functions like `generateText` and `streamText`.
 */
export function getLLM(provider: LLMProvider, modelId: string) {
  switch (provider) {
    case 'google':
      return google(modelId);
    case 'groq':
      return groq(modelId);
    case 'openrouter':
      return openrouter(modelId);
    case 'together':
      return together(modelId);
    case 'mistral':
      return mistral(modelId);
    case 'github':
      return github(modelId);
    case 'deepseek':
      return deepseek(modelId);
    case 'huggingface':
      return huggingface(modelId);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
