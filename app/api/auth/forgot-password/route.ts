import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json({ message: 'If an account with that email exists, we sent a password reset link.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetToken = resetTokenHash;
    user.resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Create reset URL
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const resetUrl = `${appUrl}?resetToken=${resetToken}&email=${encodeURIComponent(email)}`;

    // Set up nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Use your SMTP provider
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"DramaGhar Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'DramaGhar Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your DramaGhar password.</p>
        <p>Click the link below to reset it. This link is valid for 1 hour.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    // If EMAIL_USER and EMAIL_PASS are missing, we log it to console instead of failing (for development)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('--- PASSWORD RESET EMAIL (Simulated) ---');
      console.log(`To: ${user.email}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('----------------------------------------');
    } else {
      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({ message: 'If an account with that email exists, we sent a password reset link.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
