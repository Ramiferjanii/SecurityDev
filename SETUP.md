# Cybersecurity Detection System - Setup Guide

## Overview
This application detects cyberattacks and scams using AI, and sends email alerts to users and administrators when threats are detected.

## Prerequisites
- Node.js 18+ installed
- Appwrite account and project
- SendGrid account (for email alerts)
- VAPI AI account (optional, for enhanced AI detection)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_ALERTS_COLLECTION_ID=your_alerts_collection_id
APPWRITE_USERS_COLLECTION_ID=your_users_collection_id

# VAPI AI Configuration (Optional)
VAPI_AI_API_KEY=your_vapi_api_key
VAPI_AI_ASSISTANT_ID=your_assistant_id

# SendGrid Email Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Admin Email (for alerts)
ADMIN_EMAIL=admin@yourdomain.com

# Appwrite Function Configuration (Optional)
APPWRITE_FUNCTION_EMAIL_ALERT_ID=your_function_id
```

### 3. Appwrite Setup

#### Create Database and Collections

1. **Create Database:**
   - Go to Appwrite Console → Databases
   - Create a new database
   - Copy the Database ID to `.env.local`

2. **Create Alerts Collection:**
   - Create a collection named "alerts"
   - Add the following attributes:
     - `type` (String, required)
     - `confidence` (Double, required)
     - `userMessage` (String, required, size: 10000)
     - `aiResponse` (String, required, size: 10000)
     - `userId` (String, optional)
     - `userEmail` (String, optional)
     - `emailSent` (Boolean, required)
     - `emailRecipients` (String[], required)
     - `createdAt` (String, required)
   - Set collection permissions (read/write as needed)
   - Copy the Collection ID to `.env.local`

3. **Create Users Collection (Optional):**
   - Create a collection for user management
   - Copy the Collection ID to `.env.local`

#### Deploy Appwrite Function (Optional)

1. **Create Function:**
   - Go to Appwrite Console → Functions
   - Create a new function named "send-email-alert"
   - Use Node.js runtime
   - Upload the code from `appwrite-functions/send-email-alert/`

2. **Set Environment Variables:**
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `SENDGRID_FROM_EMAIL`: Your sender email address

3. **Deploy the Function:**
   - Deploy the function
   - Copy the Function ID to `.env.local`

### 4. SendGrid Setup

1. **Create SendGrid Account:**
   - Sign up at https://sendgrid.com
   - Verify your sender email address

2. **Create API Key:**
   - Go to Settings → API Keys
   - Create a new API key with "Mail Send" permissions
   - Copy the API key to `.env.local`

### 5. VAPI AI Setup (Optional)

1. **Create VAPI AI Account:**
   - Sign up at https://vapi.ai
   - Create an assistant for cybersecurity detection

2. **Configure Intents:**
   - Create intents for: phishing, account_compromise, malware, scam
   - Train the assistant with examples

3. **Get API Credentials:**
   - Copy API key and Assistant ID to `.env.local`

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## Features

### 1. Chatbot Interface
- Users can report security issues through the chatbot
- Real-time threat detection
- Automatic email alerts when threats are detected

### 2. Threat Detection
The system detects:
- **Phishing**: Suspicious emails, fake verification requests
- **Account Compromise**: Hacked accounts, unauthorized access
- **Malware**: Viruses, trojans, suspicious software
- **Scams**: Fake prizes, lottery scams, job scams

### 3. Email Alerts
- Automatic email alerts sent to admin and user
- Detailed threat information in email
- Recommended actions included

### 4. Admin Dashboard
- View all security alerts
- Filter by threat type
- Statistics and analytics
- Access at `/admin`

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
Detect cyberattacks and send alerts
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

## Security Considerations

1. **API Keys**: Never commit `.env.local` to version control
2. **Rate Limiting**: Implement rate limiting for API endpoints
3. **Authentication**: Add user authentication for admin dashboard
4. **Input Validation**: All user inputs are validated
5. **Email Security**: Use verified sender domains

## Troubleshooting

### Email Not Sending
- Verify SendGrid API key is correct
- Check sender email is verified in SendGrid
- Review SendGrid activity logs

### Appwrite Connection Issues
- Verify endpoint URL is correct
- Check API key has proper permissions
- Ensure database and collections exist

### VAPI AI Not Working
- System falls back to rule-based detection if VAPI is unavailable
- Check API key and assistant ID
- Verify network connectivity

## Next Steps

1. Add user authentication
2. Implement rate limiting
3. Add more threat detection patterns
4. Enhance AI training with more examples
5. Add real-time notifications
6. Implement alert escalation rules

