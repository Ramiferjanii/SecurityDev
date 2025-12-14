# 🛡️ Community-Driven Cyber Threat & Scam Reporting Platform

A comprehensive Next.js application that enables communities to detect, report, and share information about cyberattacks and scams. Users can report threats, vote on reports, and help protect others through a collaborative platform.

## Features

### Community Features
- 👥 **User Authentication**: Sign up, sign in, and manage profiles
- 📋 **Public Threat Reports**: Share and view community-reported threats
- 👍 **Voting System**: Upvote/downvote reports to verify credibility
- ✅ **Expert Verification**: Community experts can verify threat reports
- 🏆 **Reputation System**: Build reputation by reporting and verifying threats
- 📊 **Public Dashboard**: View all community reports with filtering

### Detection & Alerts
- 🤖 **AI-Powered Threat Detection**: Integrates with VAPI AI for intelligent threat detection
- 📧 **Automatic Email Alerts**: Sends detailed email notifications when threats are detected
- 💬 **Interactive Chatbot**: User-friendly chatbot interface for reporting security issues
- 📊 **Admin Dashboard**: Comprehensive dashboard for monitoring alerts and analytics
- 🗄️ **Alert Logging**: Stores all alerts in Appwrite database for tracking and analysis

### Threat Types Detected
- Phishing attacks
- Account compromise
- Malware detection
- Scam attempts
- Other security threats

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Appwrite (Database, Functions, User Management)
- **AI Integration**: VAPI AI (with fallback rule-based detection)
- **Email Service**: Multiple providers supported (Resend, Mailgun, SMTP, SendGrid)
- **Deployment**: Vercel-ready

## Quick Start

> **⚡ Need a quick setup?** See [QUICK_SETUP.md](./QUICK_SETUP.md) for a 5-step guide (15 minutes)
> 
> **🚀 Ready to deploy?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions

### Prerequisites

- Node.js 18+
- Appwrite Cloud account (free at https://cloud.appwrite.io)
- Email service account (Resend, Mailgun, SMTP, or SendGrid - see [EMAIL_PROVIDERS.md](./EMAIL_PROVIDERS.md))
- VAPI AI account (optional)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your Appwrite, Email provider, and VAPI AI credentials
   - See [EMAIL_PROVIDERS.md](./EMAIL_PROVIDERS.md) for email provider setup
   - See [QUICK_SETUP.md](./QUICK_SETUP.md) for step-by-step instructions
   - Or [SETUP.md](./SETUP.md) for detailed configuration

3. **Set up Appwrite:**
   - Create database and collections (see [QUICK_SETUP.md](./QUICK_SETUP.md) or [SETUP.md](./SETUP.md))
   - Deploy Appwrite Function (optional, see `appwrite-functions/`)

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Project Structure

```
v3/
├── app/
│   ├── api/
│   │   ├── chat/          # Chatbot API endpoint
│   │   ├── detect/        # Threat detection & alert API
│   │   └── alerts/        # Alerts retrieval API
│   ├── admin/             # Admin dashboard
│   ├── page.tsx           # Main homepage with chatbot
│   └── layout.tsx
├── components/
│   └── ChatBot.tsx        # Main chatbot component
├── lib/
│   ├── appwrite.ts       # Appwrite client configuration
│   ├── vapi.ts           # VAPI AI integration
│   ├── email.ts          # Email alert utilities
│   └── alerts.ts         # Alert logging utilities
├── types/
│   └── index.ts          # TypeScript type definitions
├── appwrite-functions/
│   └── send-email-alert/  # Appwrite Function for emails
└── SETUP.md              # Detailed setup guide
```

## API Endpoints

### POST `/api/chat`
Send a message to the chatbot
```json
{
  "message": "I received a suspicious email",
  "conversationHistory": []
}
```

### POST `/api/detect`
Detect cyberattacks and trigger email alerts
```json
{
  "message": "I think my account was hacked",
  "userId": "optional_user_id",
  "userEmail": "user@example.com",
  "conversationHistory": []
}
```

### GET `/api/alerts`
Get all alerts (with optional filtering)
```
/api/alerts?type=phishing&limit=50
```

## Documentation

- **[QUICK_SETUP.md](./QUICK_SETUP.md)** - ⚡ 5-step quick setup guide (15 minutes)
- **[EMAIL_PROVIDERS.md](./EMAIL_PROVIDERS.md)** - 📧 Email provider setup (Resend, Mailgun, SMTP, SendGrid)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - 🚀 Complete deployment guide for Appwrite Cloud
- **[SETUP.md](./SETUP.md)** - 📖 Detailed setup and configuration guide
- **[HOSTNAME_CONFIG.md](./HOSTNAME_CONFIG.md)** - 🔧 Hostname configuration reference

## Key Features Explained

### Threat Detection
The system uses a combination of:
- **VAPI AI**: Advanced AI-powered detection (when configured)
- **Rule-based patterns**: Keyword matching for common threats
- **Confidence scoring**: Each detection includes a confidence level

### Email Alerts
When a threat is detected:
1. System generates a detailed email with threat information
2. Email is sent to admin and user (if email provided)
3. Alert is logged to database
4. User receives confirmation

### Admin Dashboard
Access at `/admin` to:
- View all security alerts
- Filter by threat type
- See statistics and trends
- Monitor email delivery status

## Environment Variables

See `.env.example` for all required variables. Key ones:
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- `APPWRITE_API_KEY`
- `EMAIL_PROVIDER` (resend, mailgun, smtp, or sendgrid)
- Provider-specific keys (see [EMAIL_PROVIDERS.md](./EMAIL_PROVIDERS.md))
- `VAPI_AI_API_KEY` (optional)

## Security Considerations

- ✅ API keys stored in environment variables
- ✅ Input validation on all endpoints
- ✅ Type-safe with TypeScript
- ✅ Server-side threat detection
- ⚠️ Add authentication for production use
- ⚠️ Implement rate limiting
- ⚠️ Add request validation middleware

## Development

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint
```

## Next Steps

1. Add user authentication
2. Implement rate limiting
3. Add more threat detection patterns
4. Enhance AI training
5. Add real-time notifications
6. Implement alert escalation

## License

MIT

## Support

For setup help, see [SETUP.md](./SETUP.md) or check the documentation files.
