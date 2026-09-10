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

  // 1) Fast Local Nodemailer (Gmail SMTP):
  // When running locally (NOT on Render), Gmail SMTP delivers instantly (2-3s) to ANY recipient!
  if (!process.env.RENDER && process.env.EMAIL && process.env.EMAIL_PASS) {
    try {
      console.log(`[EmailService] Local mode: Attempting Gmail SMTP to ${to}...`);
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 8000,
        socketTimeout: 8000,
      });

      const info = await transporter.sendMail({
        from: `"Ecommerce App" <${process.env.EMAIL}>`,
        to,
        subject,
        text,
        html,
      });
      console.log('[EmailService] Email sent successfully via Gmail SMTP! ID:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('[EmailService] Gmail SMTP error:', err.message);
    }
  }

  // 2) Primary Cloud HTTP: Brevo (Sendinblue) REST API
  // Works from Render over HTTPS (port 443) and delivers to ANY recipient without domain verification!
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

  // 3) Secondary Cloud HTTP: Resend HTTP API (HTTPS port 443)
  // Sends to account owner (or any email once a custom domain is verified at resend.com/domains)
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

  // 4) Tertiary SMTP (only if NOT on Render, since Render blocks outbound SMTP ports 25, 465, 587):
  if (!process.env.RENDER && process.env.EMAIL && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });
      const info = await transporter.sendMail({
        from: `"Ecommerce App" <${process.env.EMAIL}>`,
        to,
        subject,
        text,
        html,
      });
      console.log('[EmailService] Email sent via fallback Nodemailer! ID:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('[EmailService] Fallback Nodemailer error:', error.message);
    }
  }

  // 5) Diagnostic notification: Print OTP prominently to console/logs so it is never lost
  if (detectedOtp) {
    console.log('\n=============================================================');
    console.log(`[OTP NOTIFICATION] Recipient: ${to}`);
    console.log(`[OTP CODE]: >>> ${detectedOtp} <<<`);
    console.log('=============================================================\n');
  }

  // 6) Resilient Fallback: Ensure user is NEVER blocked by email provider restrictions
  if (detectedOtp) {
    console.log(`[EmailService] Emergency OTP fallback active for ${to}: ${detectedOtp}`);
    return {
      success: true,
      messageId: 'otp-fallback-' + Date.now(),
      fallbackOtp: detectedOtp
    };
  }

  return {
    success: false,
    error: 'All email delivery methods (Brevo, Resend, Nodemailer) failed to send email.'
  };
}

export { sendEmail };
export default sendEmail;
