
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import nodemailer from 'nodemailer';

// Interface for the request body
interface BookingRequestBody {
  therapistName: string;
  userName: string;
  userEmail: string;
}

export async function POST(request: Request) {
  try {
    const { therapistName, userName, userEmail } = (await request.json()) as BookingRequestBody;

    // Validate essential data
    if (!therapistName || !userName || !userEmail) {
      return NextResponse.json({ message: 'Missing required booking information.' }, { status: 400 });
    }

    // Step 1: Generate a unique video call link
    const videoCallId = randomUUID();
    const videoCallLink = `https://meet.jit.si/HealSpace-Session-${videoCallId}`;

    // Step 2: Configure Nodemailer transporter
    // IMPORTANT: Use environment variables for credentials in a real app
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address from .env.local
        pass: process.env.GMAIL_PASS, // Your Gmail App Password from .env.local
      },
    });

    // Step 3: Send email to the patient
    await transporter.sendMail({
      from: `"HealSpace" <${process.env.GMAIL_USER}>`,
      to: userEmail, // Patient's email
      subject: `Your HealSpace Session with ${therapistName} is Confirmed`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #007bff;">Booking Confirmed!</h2>
          <p>Hi ${userName},</p>
          <p>Your therapy session with <strong>${therapistName}</strong> has been successfully booked.</p>
          <p>Please use the link below to join your video call at the scheduled time.</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="${videoCallLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Video Session</a>
          </p>
          <p>If you have any questions, please don't hesitate to reach out.</p>
          <p>Sincerely,<br/>The HealSpace Team</p>
        </div>
      `,
    });

    // Step 4: Send a notification email to the therapist
    await transporter.sendMail({
        from: `"HealSpace" <${process.env.GMAIL_USER}>`,
        to: 'akshaya12406@gmail.com', // Therapist's email
        subject: `New HealSpace Video Session Booking with ${userName}`,
        html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #28a745;">New Booking Notification</h2>
            <p>Hi ${therapistName},</p>
            <p>You have a new session booking from <strong>${userName}</strong> (email: ${userEmail}).</p>
            <p>The video call link is: <a href="${videoCallLink}">${videoCallLink}</a></p>
            <p>Please be ready to join at the scheduled time.</p>
            <p>- The HealSpace Team</p>
        </div>
      `,
    });


    // Step 5: Return a success response
    return NextResponse.json({ message: 'Booking successful and email sent.' }, { status: 200 });

  } catch (error) {
    console.error('Failed to send booking email:', error);
    // Return a generic error message to the client
    return NextResponse.json({ message: 'Failed to send booking confirmation.' }, { status: 500 });
  }
}
