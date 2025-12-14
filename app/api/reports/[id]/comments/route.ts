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

    if (!DATABASE_ID || !process.env.APPWRITE_REPORTS_COLLECTION_ID) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Fetch the current report to get existing comments
    const report = await databases.getDocument(
      DATABASE_ID,
      process.env.APPWRITE_REPORTS_COLLECTION_ID,
      reportId
    );

    // Get existing comments or initialize empty array
    const existingComments = report.comments || [];
    
    // Parse existing comments from JSON strings
    const parsedComments = existingComments.map((c: string) => {
      try {
        return typeof c === 'string' ? JSON.parse(c) : c;
      } catch {
        return c;
      }
    });

    // Create new comment object
    const newComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      content,
      createdAt: new Date().toISOString(),
    };

    // Convert all comments to JSON strings for Appwrite
    const commentsAsStrings = [...parsedComments, newComment].map(c => 
      typeof c === 'string' ? c : JSON.stringify(c)
    );

    // Update the report with the new comment
    await databases.updateDocument(
      DATABASE_ID,
      process.env.APPWRITE_REPORTS_COLLECTION_ID,
      reportId,
      {
        comments: commentsAsStrings
      }
    );

    return NextResponse.json({
      success: true,
      comment: newComment,
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

    if (!DATABASE_ID || !process.env.APPWRITE_REPORTS_COLLECTION_ID) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Fetch the report to get comments
    const report = await databases.getDocument(
      DATABASE_ID,
      process.env.APPWRITE_REPORTS_COLLECTION_ID,
      reportId
    );

    // Parse comments from JSON strings
    const comments = (report.comments || []).map((c: string) => {
      try {
        return typeof c === 'string' ? JSON.parse(c) : c;
      } catch {
        return c;
      }
    });

    return NextResponse.json({
      success: true,
      comments,
    });
  } catch (error: any) {
    console.error('Get Comments API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments', details: error.message },
      { status: 500 }
    );
  }
}


