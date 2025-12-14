// Appwrite Function: Send Email Alert
// This function can be deployed to Appwrite Functions to send email alerts
// Make sure to set environment variables: SENDGRID_API_KEY, SENDGRID_FROM_EMAIL

const sgMail = require('@sendgrid/mail');

export default async function(context) {
  try {
    const { req, res, log, error } = context;
    
    // Parse request body
    const payload = JSON.parse(req.bodyRaw || '{}');
    const { to, subject, html, text } = payload;

    if (!to || !subject || !html) {
      return res.json({
        success: false,
        error: 'Missing required fields: to, subject, html'
      }, 400);
    }

    // Get SendGrid API key from environment
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@cybersecurity-alerts.com';

    if (!apiKey) {
      return res.json({
        success: false,
        error: 'SendGrid API key not configured'
      }, 500);
    }

    sgMail.setApiKey(apiKey);

    // Prepare email message
    const msg = {
      to: Array.isArray(to) ? to : [to],
      from: fromEmail,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
      html,
    };

    // Send email
    await sgMail.send(msg);

    log('Email alert sent successfully to: ' + JSON.stringify(to));

    return res.json({
      success: true,
      message: 'Email alert sent successfully',
      recipients: msg.to
    });
  } catch (err) {
    error('Error sending email alert: ' + err.message);
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
}

