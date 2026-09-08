import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// Helper to get Resend instance dynamically so runtime env changes are respected
function getResendClient() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (key && key !== 're_YOUR_API_KEY_HERE' && key.startsWith('re_')) {
    return new Resend(key);
  }
  return null;
}

// ─── Unified send function ─────────────────────────────────────────
async function sendEmail(to, subject, text, html) {
  const resend = getResendClient();

  // 1) Primary: Resend HTTP API (works from cloud hosts like Render where SMTP ports are blocked)
  if (resend) {
    try {
      console.log(`[EmailService] Attempting to send email via Resend to ${to}...`);
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Ecommerce App <onboarding@resend.dev>';
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [to],
        subject,
        text: text || undefined,
        html: html || undefined,
      });

      if (error) {
        console.error('[EmailService] Resend API error:', error);
        // If Resend fails (e.g. unverified domain or sandbox limitation), fall through to Nodemailer
      } else {
        console.log('[EmailService] Email sent successfully via Resend! ID:', data?.id);
        return { success: true, messageId: data?.id };
      }
    } catch (err) {
      console.error('[EmailService] Resend exception:', err.message);
    }
  } else {
    console.log('[EmailService] RESEND_API_KEY not configured or placeholder detected. Trying Nodemailer...');
  }

  // 2) Fallback: Nodemailer / Gmail SMTP
  // Note: Render free tier blocks outbound SMTP ports (25, 465, 587).
  // Timeouts are set to prevent server hanging indefinitely.
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 8000, // 8 s to establish connection
      greetingTimeout: 8000,   // 8 s for SMTP greeting
      socketTimeout: 10000,    // 10 s for socket inactivity
    });

    console.log(`[EmailService] Attempting to send email via Nodemailer/SMTP to ${to}...`);
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
      html,
    });
    console.log('[EmailService] Email sent successfully via Nodemailer! ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EmailService] Nodemailer error:', error.message, error.code ? `(Code: ${error.code})` : '');
    return { success: false, error: error.message };
  }
}

export default sendEmail;
