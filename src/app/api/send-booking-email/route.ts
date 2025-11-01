
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { userName, userEmail, therapistName } = await request.json();

    if (!userName || !userEmail || !therapistName) {
      return NextResponse.json({ message: 'Missing user or therapist information.' }, { status: 400 });
    }

    // 1. Generate a unique video call link
    const videoCallId = randomUUID();
    const videoCallLink = `https://meet.jit.si/HealSpace-Session-${videoCallId}`;

    // 2. Set up Nodemailer transporter
    // IMPORTANT: Use environment variables for credentials in production
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address from .env.local
        pass: process.env.GMAIL_PASS, // Your Gmail App Password from .env.local
      },
    });

    // 3. Send email to the patient
    const patientMailOptions = {
      from: `"HealSpace" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: 'Your HealSpace Session Booking Confirmed',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #60a5fa;">Hello ${userName},</h1>
          <p>Your therapy session with <strong>${therapistName}</strong> has been booked.</p>
          <p>You can join the video call using the link below at your scheduled time.</p>
          <a 
            href="${videoCallLink}" 
            style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 10px;"
          >
            Join Video Session
          </a>
          <p style="margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p><a href="${videoCallLink}">${videoCallLink}</a></p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };

    // 4. Send notification email to the therapist
    const therapistMailOptions = {
      from: `"HealSpace Booking" <${process.env.GMAIL_USER}>`,
      to: 'akshaya12406@gmail.com', // Therapist's email address
      subject: 'New HealSpace Video Session Booking',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #60a5fa;">New Booking Request</h1>
          <p>You have a new therapy session request from a HealSpace user.</p>
          <ul>
            <li><strong>Patient Name:</strong> ${userName}</li>
            <li><strong>Patient Email:</strong> ${userEmail}</li>
          </ul>
          <p>You can join the video call using the link below at the scheduled time:</p>
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

    // Send both emails
    await transporter.sendMail(patientMailOptions);
    await transporter.sendMail(therapistMailOptions);

    // Return success response
    return NextResponse.json({ message: 'Booking successful. Emails sent.' }, { status: 200 });

  } catch (error) {
    console.error('Failed to send booking email:', error);
    // Return a generic error message to the client
    return NextResponse.json({ message: 'Failed to create video session and send email.' }, { status: 500 });
  }
}
