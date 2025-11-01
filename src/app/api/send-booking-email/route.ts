
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// IMPORTANT: Store your Gmail credentials in .env.local
// GMAIL_USER=your_gmail_address@gmail.com
// GMAIL_APP_PASSWORD=your_16_digit_google_app_password
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const RECIPIENT_EMAIL = "akshaya12406@gmail.com";

export async function POST(request: Request) {

  // Step 1: Validate that environment variables are configured
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error('Missing Gmail credentials. Make sure GMAIL_USER and GMAIL_APP_PASSWORD are set in .env.local');
    // Do not expose detailed error messages to the client
    return NextResponse.json({ message: 'Server configuration error. Cannot send email.' }, { status: 500 });
  }

  try {
    // Step 2: Parse the incoming request body
    const body = await request.json();
    const { therapistName, userName, userEmail } = body;

    // Basic validation
    if (!therapistName || !userName || !userEmail) {
      return NextResponse.json({ message: 'Missing required booking information.' }, { status: 400 });
    }

    // Step 3: Configure the Nodemailer transporter
    // IMPORTANT: You MUST use a "Google App Password" for this to work, not your regular password.
    // See: https://support.google.com/accounts/answer/185833
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    // Step 4: Define the email content
    const mailOptions = {
      from: `"HealSpace Bookings" <${GMAIL_USER}>`,
      to: RECIPIENT_EMAIL, // The designated email address to receive booking notifications
      subject: `New HealSpace Booking with ${therapistName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #005A9C; text-align: center;">New Session Request</h2>
          <p>A new booking request has been submitted through the HealSpace platform.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <h3>Details:</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin-bottom: 10px;"><strong>Therapist:</strong> ${therapistName}</li>
            <li style="margin-bottom: 10px;"><strong>Patient Name:</strong> ${userName}</li>
            <li style="margin-bottom: 10px;"><strong>Patient Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></li>
          </ul>
          <p>Please reach out to the patient at their email address to coordinate and confirm the session time.</p>
          <br>
          <p style="font-size: 0.9em; color: #777; text-align: center;"><em>This is an automated notification from the HealSpace platform.</em></p>
        </div>
      `,
    };

    // Step 5: Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Booking request sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Failed to send email:', error);
    // Return a generic error to the client
    return NextResponse.json({ message: 'Failed to send booking email.' }, { status: 500 });
  }
}
