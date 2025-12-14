// Email service utilities - Supports multiple providers
import type { EmailAlert, CyberattackDetection } from '@/types';

// Email provider configuration
const EMAIL_PROVIDER = (process.env.EMAIL_PROVIDER || 'resend').toLowerCase();
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.SENDGRID_FROM_EMAIL || 'noreply@cybersecurity-alerts.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';

// Provider-specific API keys
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || '';
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || '';

// SMTP configuration
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';

export function generateAlertEmail(detection: CyberattackDetection): EmailAlert {
  const threatTypeLabels: Record<CyberattackDetection['type'], string> = {
    phishing: 'Phishing Attack',
    account_compromise: 'Account Compromise',
    malware: 'Malware Detection',
    scam: 'Scam Attempt',
    other: 'Security Threat'
  };

  const subject = `🚨 Security Alert: ${threatTypeLabels[detection.type]} Detected`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .alert-box { background-color: #ff4444; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .info-box { background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .threat-type { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .details { margin: 10px 0; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="alert-box">
          <div class="threat-type">${threatTypeLabels[detection.type]} Detected</div>
          <p>Confidence Level: ${Math.round(detection.confidence * 100)}%</p>
        </div>
        
        <div class="info-box">
          <h3>Detection Details:</h3>
          <div class="details">
            <p><strong>Type:</strong> ${threatTypeLabels[detection.type]}</p>
            <p><strong>Detected At:</strong> ${new Date(detection.detectedAt).toLocaleString()}</p>
            <p><strong>User Message:</strong></p>
            <p style="background: white; padding: 10px; border-left: 3px solid #ff4444;">${detection.userMessage}</p>
            <p><strong>AI Response:</strong></p>
            <p style="background: white; padding: 10px; border-left: 3px solid #007bff;">${detection.aiResponse}</p>
          </div>
        </div>
        
        <div class="info-box">
          <h3>Recommended Actions:</h3>
          <ul>
            <li>Verify the legitimacy of any suspicious communications</li>
            <li>Do not click on suspicious links or download attachments</li>
            <li>Change passwords if account compromise is suspected</li>
            <li>Run antivirus scans if malware is detected</li>
            <li>Report the incident to your IT security team</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>This is an automated security alert. Please take appropriate action immediately.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
SECURITY ALERT: ${threatTypeLabels[detection.type]} DETECTED

Type: ${threatTypeLabels[detection.type]}
Confidence: ${Math.round(detection.confidence * 100)}%
Detected At: ${new Date(detection.detectedAt).toLocaleString()}

User Message:
${detection.userMessage}

AI Response:
${detection.aiResponse}

Recommended Actions:
- Verify the legitimacy of any suspicious communications
- Do not click on suspicious links or download attachments
- Change passwords if account compromise is suspected
- Run antivirus scans if malware is detected
- Report the incident to your IT security team

This is an automated security alert. Please take appropriate action immediately.
  `;

  const recipients = [ADMIN_EMAIL];
  if (detection.userEmail) {
    recipients.push(detection.userEmail);
  }

  return {
    to: recipients,
    subject,
    html,
    text,
    alertType: detection.type,
    detectionData: detection
  };
}

// Send email using the configured provider
export async function sendEmailAlert(alert: EmailAlert): Promise<boolean> {
  try {
    switch (EMAIL_PROVIDER) {
      case 'resend':
        return await sendViaResend(alert);
      case 'mailgun':
        return await sendViaMailgun(alert);
      case 'smtp':
        return await sendViaSMTP(alert);
      case 'sendgrid':
        return await sendViaSendGrid(alert);
      default:
        console.error(`Unknown email provider: ${EMAIL_PROVIDER}. Supported: resend, mailgun, smtp, sendgrid`);
        return false;
    }
  } catch (error: any) {
    console.error('Error sending email alert:', error);
    return false;
  }
}

export async function sendContactEmail(name: string, userEmail: string, subject: string, message: string): Promise<boolean> {
  const adminEmail = "ramiferjani80@gmail.com"; 
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #007bff; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .info-box { background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .details { margin: 10px 0; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Support Request</h2>
        </div>
        
        <div class="info-box">
          <h3>Contact Details:</h3>
          <div class="details">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
        </div>

        <div class="info-box">
          <h3>Message:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        
        <div class="footer">
          <p>Sent via BLUEFORT Support Form</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
New Support Request
-------------------
Name: ${name}
Email: ${userEmail}
Subject: ${subject}

Message:
${message}

Sent via BLUEFORT Support Form
  `;

  const alert: EmailAlert = {
    to: [adminEmail],
    subject: `Support: ${subject}`,
    html: emailHtml,
    text: emailText,
    alertType: 'other',
    // @ts-ignore - Partial object for contact form
    detectionData: {} 
  };
  
  return sendEmailAlert(alert);
}

// Resend provider
async function sendViaResend(alert: EmailAlert): Promise<boolean> {
  try {
    if (!RESEND_API_KEY) {
      console.warn('Resend API key not configured. Email alert not sent.');
      return false;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: alert.to,
        subject: alert.subject,
        html: alert.html,
        text: alert.text,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend error:', error);
      return false;
    }

    console.log('Email alert sent via Resend to:', alert.to);
    return true;
  } catch (error: any) {
    console.error('Resend error:', error);
    return false;
  }
}

// Mailgun provider
async function sendViaMailgun(alert: EmailAlert): Promise<boolean> {
  try {
    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      console.warn('Mailgun API key or domain not configured. Email alert not sent.');
      return false;
    }

    const formData = new URLSearchParams();
    formData.append('from', FROM_EMAIL);
    alert.to.forEach(email => formData.append('to', email));
    formData.append('subject', alert.subject);
    formData.append('html', alert.html);
    formData.append('text', alert.text);

    // Create basic auth header (Node.js compatible)
    const authString = `api:${MAILGUN_API_KEY}`;
    const auth = typeof Buffer !== 'undefined' 
      ? Buffer.from(authString).toString('base64')
      : btoa(authString);

    const response = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Mailgun error:', error);
      return false;
    }

    console.log('Email alert sent via Mailgun to:', alert.to);
    return true;
  } catch (error: any) {
    console.error('Mailgun error:', error);
    return false;
  }
}

// SMTP provider (using nodemailer)
async function sendViaSMTP(alert: EmailAlert): Promise<boolean> {
  try {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
      console.warn('SMTP configuration incomplete. Email alert not sent.');
      return false;
    }

    // Dynamic import to avoid loading nodemailer if not using SMTP
    // Use type assertion to avoid TypeScript error if nodemailer is not installed
    let nodemailer: any;
    try {
      // @ts-ignore - nodemailer is optional, only needed for SMTP provider
      nodemailer = await import('nodemailer');
    } catch (importError: any) {
      console.error('nodemailer module not found. Install it with: npm install nodemailer');
      console.error('Or use a different email provider (resend, mailgun, sendgrid)');
      return false;
    }
    
    if (!nodemailer || !nodemailer.default) {
      console.error('nodemailer module not properly loaded');
      return false;
    }
    
    const transporter = nodemailer.default.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: alert.to.join(', '),
      subject: alert.subject,
      text: alert.text,
      html: alert.html,
    });

    console.log('Email alert sent via SMTP to:', alert.to);
    return true;
  } catch (error: any) {
    console.error('SMTP error:', error);
    return false;
  }
}

// SendGrid provider (legacy support)
async function sendViaSendGrid(alert: EmailAlert): Promise<boolean> {
  try {
    if (!SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured. Email alert not sent.');
      return false;
    }

    // Dynamic import to avoid loading sendgrid if not using it
    const sgMail = (await import('@sendgrid/mail')).default;
    sgMail.setApiKey(SENDGRID_API_KEY);

    const msg = {
      to: alert.to,
      from: FROM_EMAIL,
      subject: alert.subject,
      text: alert.text,
      html: alert.html,
    };

    await sgMail.send(msg);
    console.log('Email alert sent via SendGrid to:', alert.to);
    return true;
  } catch (error: any) {
    console.error('SendGrid error:', error);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    return false;
  }
}

