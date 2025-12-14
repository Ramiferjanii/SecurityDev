# Email Provider Configuration Guide

This application supports multiple email providers. You can choose from:

- **Resend** (Recommended - Modern, easy to use)
- **Mailgun** (Popular, reliable)
- **SMTP** (Any SMTP server - Gmail, Outlook, custom)
- **SendGrid** (Legacy support)

## Quick Setup

### 1. Choose Your Provider

Set the `EMAIL_PROVIDER` environment variable to one of:
- `resend` (default)
- `mailgun`
- `smtp`
- `sendgrid`

### 2. Configure Provider-Specific Settings

Add the required environment variables for your chosen provider to `.env.local`:

---

## Resend (Recommended)

**Why Resend?** Modern API, great developer experience, free tier available.

### Setup Steps:

1. **Sign up at https://resend.com**
2. **Get your API key** from the dashboard
3. **Verify your domain** (optional but recommended)

### Environment Variables:

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### Free Tier:
- 3,000 emails/month
- 100 emails/day

---

## Mailgun

**Why Mailgun?** Reliable, good deliverability, detailed analytics.

### Setup Steps:

1. **Sign up at https://www.mailgun.com**
2. **Verify your domain** (required)
3. **Get your API key** from Settings → API Keys
4. **Get your domain** from Sending → Domains

### Environment Variables:

```env
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=key-xxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.yourdomain.com
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### Free Tier:
- 5,000 emails/month (first 3 months)
- 1,000 emails/month (after)

---

## SMTP (Gmail, Outlook, Custom)

**Why SMTP?** Use your existing email server, no third-party service needed.

### Setup Steps:

#### For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password as `SMTP_PASSWORD`

#### For Outlook/Office 365:
1. Use your email and password
2. Or create an app password if 2FA is enabled

#### For Custom SMTP:
1. Get SMTP settings from your email provider
2. Configure host, port, and credentials

### Environment Variables:

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_SECURE=false
FROM_EMAIL=your-email@gmail.com
ADMIN_EMAIL=admin@yourdomain.com
```

### Common SMTP Settings:

| Provider | Host | Port | Secure |
|----------|------|------|--------|
| Gmail | smtp.gmail.com | 587 | false |
| Outlook | smtp-mail.outlook.com | 587 | false |
| Office 365 | smtp.office365.com | 587 | false |
| Yahoo | smtp.mail.yahoo.com | 587 | false |
| Custom | your-smtp-server.com | 587/465 | true for 465 |

**Note:** For SMTP, you'll need to install `nodemailer`:
```bash
npm install nodemailer
```

---

## SendGrid (Legacy)

**Why SendGrid?** If you're already using it, you can keep using it.

### Environment Variables:

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### Free Tier:
- 100 emails/day

---

## Complete .env.local Example

```env
# Email Provider Configuration
EMAIL_PROVIDER=resend

# Resend (if using Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Mailgun (if using Mailgun)
# MAILGUN_API_KEY=key-xxxxxxxxxxxxx
# MAILGUN_DOMAIN=mg.yourdomain.com

# SMTP (if using SMTP)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password
# SMTP_SECURE=false

# SendGrid (if using SendGrid)
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

# Common Settings
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

---

## Switching Providers

To switch providers:

1. Change `EMAIL_PROVIDER` in `.env.local`
2. Add the new provider's API keys/credentials
3. Restart your development server
4. Test sending an email

No code changes needed! The system automatically uses the configured provider.

---

## Testing Your Email Setup

1. Start your app: `npm run dev`
2. Go to the chatbot
3. Send a test message like: "I received a suspicious email"
4. Check your email inbox (admin email)
5. Check the console for any errors

---

## Troubleshooting

### "Email provider not configured"
- ✅ Check `EMAIL_PROVIDER` is set correctly
- ✅ Verify provider-specific API keys are set
- ✅ Check environment variable names match exactly

### "SMTP connection failed"
- ✅ Verify SMTP host and port are correct
- ✅ Check username and password
- ✅ For Gmail, use App Password (not regular password)
- ✅ Check firewall/network allows SMTP connections

### "Resend/Mailgun API error"
- ✅ Verify API key is correct
- ✅ Check domain is verified (if required)
- ✅ Review provider's dashboard for errors
- ✅ Check rate limits

### "Emails going to spam"
- ✅ Verify your sender domain (SPF, DKIM records)
- ✅ Use a verified sender email
- ✅ Avoid spam trigger words
- ✅ Warm up your domain (send gradually)

---

## Provider Comparison

| Feature | Resend | Mailgun | SMTP | SendGrid |
|---------|--------|---------|------|----------|
| Free Tier | ✅ 3K/month | ✅ 1K/month | ✅ Free | ✅ 100/day |
| Setup Difficulty | Easy | Medium | Medium | Easy |
| Deliverability | Excellent | Excellent | Varies | Excellent |
| Analytics | Good | Excellent | None | Excellent |
| API Quality | Modern | Good | N/A | Good |
| Recommended | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

---

## Recommendation

**For most users:** Use **Resend**
- Modern API
- Great developer experience
- Good free tier
- Easy setup

**For enterprise:** Use **Mailgun**
- Better analytics
- More features
- Higher limits

**For simple needs:** Use **SMTP**
- No third-party service
- Use existing email
- Free (if you have email)

