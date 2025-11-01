
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    // Step 1: Generate a unique video call link
    const videoCallId = randomUUID();
    const videoCallLink = `https://meet.jit.si/HealSpace-Session-${videoCallId}`;

    // Step 2: Return the link in the response
    return NextResponse.json({ videoCallLink }, { status: 200 });

  } catch (error) {
    console.error('Failed to generate video call link:', error);
    return NextResponse.json({ message: 'Failed to create video session.' }, { status: 500 });
  }
}
