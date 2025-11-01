
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { therapistName, therapistEmail, userName, userEmail } = body;

    if (!therapistEmail || !userName || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // == In a real app, you would use an email service like Resend, Nodemailer, or EmailJS here. ==
    // This is a mocked implementation for a hackathon to demonstrate the functionality
    // without exposing API keys on the frontend.
    
    console.log('--- NEW THERAPY SESSION BOOKING ---');
    console.log('To:', therapistEmail);
    console.log('Subject: New Therapy Session Booking');
    console.log('Body:');
    console.log(`  User Name: ${userName}`);
    console.log(`  User Email: ${userEmail}`);
    console.log(`  Therapist: ${therapistName}`);
    console.log('--- END OF MOCKED EMAIL ---');

    // Simulate a successful email send
    return NextResponse.json({ message: 'Booking request sent successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error processing booking request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
