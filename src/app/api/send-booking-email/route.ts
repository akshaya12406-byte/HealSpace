
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// IMPORTANT: Store these in your .env.local file
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const RECIPIENT_EMAIL = "akshaya12406@gmail.com";

export async function POST(request: Request) {

  // Step 1: Validate Environment Variables
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error('Missing Gmail credentials in environment variables.');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  try {
    // Step 2: Parse Request Body
    const body = await request.json();
    const { therapistName, userName, userEmail } = body;

    if (!therapistName || !userName || !userEmail) {
      return NextResponse.json({ message: 'Missing required booking information.' }, { status: 400 });
    }

    // Step 3: Set up Nodemailer Transporter
    // Note: You must generate a "Google App Password" for this to work.
    // Your regular password will not work.
    // See: https://support.google.com/accounts/answer/185833
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    // Step 4: Define Email Options
    const mailOptions = {
      from: `"HealSpace Bookings" <${GMAIL_USER}>`,
      to: RECIPIENT_EMAIL, // The email address you want to receive bookings
      subject: `New HealSpace Booking with ${therapistName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #333;">New Session Request</h2>
          <p>A new booking request has been submitted through the HealSpace platform.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <h3>Details:</h3>
          <ul>
            <li><strong>Therapist:</strong> ${therapistName}</li>
            <li><strong>Patient Name:</strong> ${userName}</li>
            <li><strong>Patient Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></li>
          </ul>
          <p>Please reach out to the patient at their email address to coordinate and confirm the session time.</p>
          <br>
          <p style="font-size: 0.9em; color: #777;"><em>This is an automated notification from the HealSpace platform.</em></p>
        </div>
      `,
    };

    // Step 5: Send the Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Booking request sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ message: 'Failed to send booking email.' }, { status: 500 });
  }
}
