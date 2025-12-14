// API route for chatbot interaction with Groq AI (Llama 3)
import { NextRequest, NextResponse } from 'next/server';
import { sendMessageToGroq } from '@/lib/groq';
import type { VAPIMessage } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const history: VAPIMessage[] = conversationHistory.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await sendMessageToGroq(message, history);

    return NextResponse.json({
      success: true,
      ...response
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message', details: error.message },
      { status: 500 }
    );
  }
}

