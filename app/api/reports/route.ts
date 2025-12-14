// API route for community threat reports
import { NextRequest, NextResponse } from 'next/server';
import { getThreatReports } from '@/lib/reports';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    const reports = await getThreatReports(limit, type || undefined);

    return NextResponse.json({
      success: true,
      reports,
      count: reports.length,
    });
  } catch (error: any) {
    console.error('Reports API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, userEmail, type, title, description, confidence, tags, source } = body;

    if (!userId || !type || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, type, title, description' },
        { status: 400 }
      );
    }

    const { createThreatReport } = await import('@/lib/reports');
    
    const report = await createThreatReport({
      userId,
      userName,
      userEmail,
      type,
      title,
      description,
      confidence: confidence || 0.8,
      tags: tags || [],
      source,
    });

      if (!report) {
        return NextResponse.json(
          { 
            error: 'Failed to create report',
            hint: 'Check COLLECTION_PERMISSIONS.md for setup instructions. Ensure collection permissions allow server API key to write.'
          },
          { status: 500 }
        );
      }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('Create Report API Error:', error);
    
    // Provide helpful error message for authorization issues
    if (error.code === 401 || error.type === 'user_unauthorized') {
      return NextResponse.json(
        { 
          error: 'Authorization failed',
          details: error.message,
          solution: 'See COLLECTION_PERMISSIONS.md - Set collection permissions: Role "any" with Write permission, and ensure API key has databases.write scope'
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create report', details: error.message },
      { status: 500 }
    );
  }
}

