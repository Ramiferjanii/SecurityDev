// API route for comments on threat reports
import { NextRequest, NextResponse } from 'next/server';
import { getServerClient } from '@/lib/appwrite';

const { databases } = getServerClient();
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || '';
const COMMENTS_COLLECTION_ID = process.env.APPWRITE_COMMENTS_COLLECTION_ID || '';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;
    const body = await request.json();
    const { userId, userName, content } = body;

    if (!userId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, content' },
        { status: 400 }
      );
    }

    // For now, return success (comments collection can be added later)
    // In production, create a comments collection and store comments there
    
    return NextResponse.json({
      success: true,
      message: 'Comment posted (feature in development)',
    });
  } catch (error: any) {
    console.error('Comment API Error:', error);
    return NextResponse.json(
      { error: 'Failed to post comment', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;

    // Return empty comments for now
    return NextResponse.json({
      success: true,
      comments: [],
    });
  } catch (error: any) {
    console.error('Get Comments API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments', details: error.message },
      { status: 500 }
    );
  }
}

