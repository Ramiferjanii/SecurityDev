// API route for cyberattack detection
import { NextRequest, NextResponse } from 'next/server';
import { sendMessageToGroq } from '@/lib/groq';
import { logAlert } from '@/lib/alerts';
import type { CyberattackDetection } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId, userEmail, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Send message to Groq AI and detect threats
    const vapiResponse = await sendMessageToGroq(message, conversationHistory);

    // If threat detected, create detection record and send alerts
    if (vapiResponse.detectedThreat && vapiResponse.threatType) {
      const detection: CyberattackDetection = {
        type: vapiResponse.threatType,
        confidence: vapiResponse.confidence || 0.8,
        detectedAt: new Date().toISOString(),
        userMessage: message,
        aiResponse: vapiResponse.message,
        userId,
        userEmail,
      };

      // Log the alert to database (no email sending)
      await logAlert(detection, false, []);

      return NextResponse.json({
        success: true,
        threatDetected: true,
        threatType: detection.type,
        confidence: detection.confidence,
        message: vapiResponse.message,
      });
    }

    // No threat detected
    return NextResponse.json({
      success: true,
      threatDetected: false,
      message: vapiResponse.message,
    });
  } catch (error: any) {
    console.error('Detection API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process detection', details: error.message },
      { status: 500 }
    );
  }
}

