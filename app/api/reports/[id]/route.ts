// API route for individual threat report
import { NextRequest, NextResponse } from 'next/server';
import { getServerClient } from '@/lib/appwrite';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || '';
const REPORTS_COLLECTION_ID = process.env.APPWRITE_REPORTS_COLLECTION_ID || process.env.APPWRITE_ALERTS_COLLECTION_ID || '';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!DATABASE_ID || !REPORTS_COLLECTION_ID) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { databases } = getServerClient();
    const report = await databases.getDocument(
      DATABASE_ID,
      REPORTS_COLLECTION_ID,
      id
    );

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('Get Report API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report', details: error.message },
      { status: 500 }
    );
  }
}

