// API route for voting on threat reports
import { NextRequest, NextResponse } from 'next/server';
import { voteOnReport } from '@/lib/reports';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing report ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { userId, voteType } = body;

    if (!userId || !voteType) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, voteType' },
        { status: 400 }
      );
    }

    if (voteType !== 'upvote' && voteType !== 'downvote') {
      return NextResponse.json(
        { error: 'voteType must be "upvote" or "downvote"' },
        { status: 400 }
      );
    }

    const success = await voteOnReport(id, userId, voteType);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to vote on report' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Vote recorded',
    });
  } catch (error: any) {
    console.error('Vote API Error:', error);
    return NextResponse.json(
      { error: 'Failed to vote', details: error.message },
      { status: 500 }
    );
  }
}

