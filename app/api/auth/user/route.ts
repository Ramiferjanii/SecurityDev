// API route to get current user (server-side)
import { NextRequest, NextResponse } from 'next/server';
import { account } from '@/lib/appwrite';

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie/header
    const sessionCookie = request.cookies.get('a_session_')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    // Try to get user (this requires proper session handling)
    // For now, return null - client-side auth will handle this
    return NextResponse.json({ user: null });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}

