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

// Helper to sanitize Resend from address
function getResendFromAddress() {
  let from = process.env.RESEND_FROM_EMAIL?.trim();
  // Resend will strictly reject public webmail domains (gmail.com, yahoo.com, outlook.com, etc.)
  if (
    !from ||
    from.includes('@gmail.com') ||
    from.includes('@yahoo.com') ||
    from.includes('@outlook.com') ||
    from.includes('@hotmail.com')
  ) {
    return 'Ecommerce App <onboarding@resend.dev>';
  }
  return from;
}

// ─── Unified send function ─────────────────────────────────────────
async function sendEmail(toOrOptions, subject, text, html) {
  let to = toOrOptions;
  if (typeof toOrOptions === 'object' && toOrOptions !== null) {
    to = toOrOptions.to;
    subject = toOrOptions.subject;
    text = toOrOptions.text;
    html = toOrOptions.html;
  }

  // Extract 6-digit OTP if present in subject or HTML for diagnostic logging
  const otpMatch = ((subject || '') + ' ' + (html || '') + ' ' + (text || '')).match(/\b\d{6}\b/);
  const detectedOtp = otpMatch ? otpMatch[0] : null;

  // 1) Primary HTTP: Brevo (formerly Sendinblue) REST API (works from Render, sends to ANY recipient)
  const brevoKey = process.env.BREVO_API_KEY?.trim();
  if (brevoKey && !brevoKey.includes('YOUR_')) {
    try {
      console.log(`[EmailService] Attempting to send email via Brevo REST API to ${to}...`);
      const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim() || process.env.EMAIL || 'noreply@ecommerceapp.com';
      const senderName = process.env.BREVO_SENDER_NAME?.trim() || 'Ecommerce App';

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: to }],
          subject,
          htmlContent: html || `<p>${text}</p>`
        })
      });

      const data = await response.json();
      if (response.ok) {
        console.log('[EmailService] Email sent successfully via Brevo API! Message ID:', data.messageId);
        return { success: true, messageId: data.messageId };
      } else {
        console.error('[EmailService] Brevo API error:', data);
      }
    } catch (err) {
      console.error('[EmailService] Brevo API exception:', err.message);
    }
  }

  // 2) Secondary HTTP: Resend HTTP API (works on Render, sends to account owner or verified domain)
  const resend = getResendClient();
  if (resend) {
    try {
      console.log(`[EmailService] Attempting to send email via Resend to ${to}...`);
      const fromEmail = getResendFromAddress();
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [to],
        subject,
        text: text || undefined,
        html: html || undefined,
      });

      if (error) {
        console.error('[EmailService] Resend API error:', error.message || error);
      } else {
        console.log('[EmailService] Email sent successfully via Resend! ID:', data?.id);
        return { success: true, messageId: data?.id };
      }
    } catch (err) {
      console.error('[EmailService] Resend exception:', err.message);
    }
  }

  // 3) Tertiary SMTP: Nodemailer / Gmail SMTP
  // Note: Render free tier blocks outbound SMTP ports (25, 465, 587).
  // Works reliably in local development or hosts with open SMTP ports.
  if (process.env.EMAIL && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 7000,
        greetingTimeout: 7000,
        socketTimeout: 8000,
      });

      console.log(`[EmailService] Attempting to send email via Nodemailer/SMTP to ${to}...`);
      const info = await transporter.sendMail({
        from: `Ecommerce App <${process.env.EMAIL}>`,
        to,
        subject,
        text,
        html,
      });
      console.log('[EmailService] Email sent successfully via Nodemailer! ID:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('[EmailService] Nodemailer error:', error.message, error.code ? `(Code: ${error.code})` : '');
    }
  }

  // 4) Development fallback: if all providers failed, log clearly in console
  if (detectedOtp) {
    console.log('\n=============================================================');
    console.log(`[LOCAL DEV OTP NOTIFICATION] To: ${to}`);
    console.log(`[LOCAL DEV OTP CODE]: >>> ${detectedOtp} <<<`);
    console.log('=============================================================\n');
  }

  // If in development or locally, return success so developers are not blocked
  if (process.env.NODE_ENV !== 'production' || !process.env.RENDER) {
    if (detectedOtp) {
      console.log(`[EmailService] Development fallback active: OTP ${detectedOtp} logged to console above.`);
      return { success: true, messageId: 'dev-fallback-' + Date.now() };
    }
  }

  return {
    success: false,
    error: 'All email delivery methods (Brevo, Resend, Nodemailer) failed to send email.'
  };
}

export { sendEmail };
export default sendEmail;
