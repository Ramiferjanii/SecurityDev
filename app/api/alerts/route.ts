// API route for fetching alert logs
import { NextRequest, NextResponse } from 'next/server';
import { getAlerts, getAlertsByType } from '@/lib/alerts';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    let alerts;
    if (type) {
      alerts = await getAlertsByType(type as any);
    } else {
      alerts = await getAlerts(limit);
    }

    return NextResponse.json({
      success: true,
      alerts,
      count: alerts.length,
    });
  } catch (error: any) {
    console.error('Alerts API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts', details: error.message },
      { status: 500 }
    );
  }
}

