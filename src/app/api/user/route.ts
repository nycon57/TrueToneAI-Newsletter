import { NextResponse } from 'next/server';
import { getCachedApiUser } from '@/lib/api/auth-cached';

export async function GET() {
  try {
    const user = await getCachedApiUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const response = NextResponse.json(user);

    // Cache user data for 5 minutes
    response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return response;
  } catch (error) {
    // User not authenticated
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
}