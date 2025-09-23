import { NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api/auth';

export async function GET() {
  try {
    const user = await getApiUser();
    return NextResponse.json(user);
  } catch (error) {
    // User not authenticated
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
}