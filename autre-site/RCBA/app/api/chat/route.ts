import { streamText } from 'ai';
import { getLLM } from '@/lib/llm';
import { NextResponse } from 'next/server';

// Set the runtime to edge for better performance if deploying on Vercel
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, provider = 'google', modelId = 'gemini-1.5-flash' } = await req.json();

    if (!messages) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // Initialize the appropriate model using our factory
    const model = getLLM(provider, modelId);

    // Call the Vercel AI SDK to stream the text response
    const result = await streamText({
      model,
      messages,
      // Optional: add a system prompt here if needed
      // system: 'You are a helpful AI assistant.',
    });

    // Return the response as a stream
    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('LLM API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during the LLM request' },
      { status: 500 }
    );
  }
}
