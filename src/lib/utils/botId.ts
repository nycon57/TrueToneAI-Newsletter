import { checkBotId } from 'botid/server';
import { NextResponse } from 'next/server';

/**
 * Verify request is not from a bot using Vercel Bot ID
 * @returns Object with isBot flag and optional 403 response
 */
export async function verifyNotBot(): Promise<{
  isBot: boolean;
  response: NextResponse | null;
}> {
  const verification = await checkBotId();

  if (verification.isBot) {
    return {
      isBot: true,
      response: NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      ),
    };
  }

  return { isBot: false, response: null };
}
