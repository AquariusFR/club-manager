import { getLLM, LLMProvider } from '@/lib/llm';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { provider, modelId, prompt } = await request.json();

    if (!provider || !modelId || !prompt) {
      return NextResponse.json(
        { error: 'Missing required parameters: provider, modelId, prompt' },
        { status: 400 }
      );
    }

    const model = getLLM(provider as LLMProvider, modelId);
    
    const { text } = await generateText({
      model,
      prompt,
    });

    return NextResponse.json({ result: text, provider, modelId });
  } catch (error: any) {
    console.error('LLM Test Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during LLM generation' },
      { status: 500 }
    );
  }
}
