
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Explicitly load environment variables
config();

export async function POST(request: Request) {
  // Check for environment variables first
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error('Email service is not configured. GMAIL_USER or GMAIL_PASS environment variables are missing.');
    return NextResponse.json({ message: 'The email booking system is currently offline. Please contact support.' }, { status: 503 });
  }

  // Set up Nodemailer transporter outside the try block to catch setup errors
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    const { userName, userEmail } = await request.json();

    if (!userName || !userEmail) {
      return NextResponse.json({ message: 'Missing user information.' }, { status: 400 });
    }

    // 1. Generate a unique video call link
    const videoCallId = randomUUID();
    const videoCallLink = `https://meet.jit.si/HealSpace-Session-${videoCallId}`;

    // 2. Send notification email to the therapist
    const therapistMailOptions = {
      from: `"HealSpace Booking" <${process.env.GMAIL_USER}>`,
      to: 'akshaya12406@gmail.com', // Therapist's hardcoded email address
      subject: 'New HealSpace Video Session Booking Request',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #60a5fa;">New Booking Request</h1>
          <p>You have a new therapy session request from a HealSpace user.</p>
          <ul>
            <li><strong>Patient Name:</strong> ${userName}</li>
            <li><strong>Patient Email:</strong> ${userEmail}</li>
          </ul>
          <p>When you are ready, you can join the video call using the link below:</p>
          <a 
            href="${videoCallLink}" 
            style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 10px;"
          >
            Join Video Session
          </a>
          <p style="margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p><a href="${videoCallLink}">${videoCallLink}</a></p>
        </div>
      `,
    };

    // Send the email to the therapist
    await transporter.sendMail(therapistMailOptions);

    // 3. Return success response with the video call link for the user
    return NextResponse.json({ videoCallLink: videoCallLink }, { status: 200 });

  } catch (error: any) {
    // Log the detailed error on the server
    console.error('Failed to send booking email. Error: ', error.message);
    // Return a generic error message to the client
    return NextResponse.json({ message: 'Failed to create video session. Could not send notification email.' }, { status: 500 });
  }
}
