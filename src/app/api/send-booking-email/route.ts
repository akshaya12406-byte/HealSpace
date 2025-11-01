
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    // Generate a unique video call link using Jitsi Meet
    const videoCallId = randomUUID();
    const videoCallLink = `https://meet.jit.si/HealSpace-Session-${videoCallId}`;

    // Return the link to the frontend
    return NextResponse.json({ videoCallLink }, { status: 200 });

  } catch (error) {
    console.error('Failed to generate video call link:', error);
    // Return a generic error message to the client
    return NextResponse.json({ message: 'Failed to create video session.' }, { status: 500 });
  }
}
