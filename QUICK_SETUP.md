# Quick Setup Checklist - Appwrite Cloud

Follow these steps to get your cybersecurity detection system up and running with Appwrite Cloud.

## ⚡ Quick Start (5 Steps)

### Step 1: Appwrite Cloud Setup (5 minutes)

1. **Create Appwrite Account:**
   - Go to https://cloud.appwrite.io
   - Sign up (free)

2. **Create Project:**
   - Click "Create Project"
   - Name: `cybersecurity-detection`
   - **Copy Project ID** → Save it!

3. **Create Database:**
   - Go to **Databases** → **Create Database**
   - Name: `security-alerts`
   - **Copy Database ID** → Save it!

4. **Create Collection:**
   - Click **Create Collection**
   - Name: `alerts`
   - **Copy Collection ID** → Save it!

5. **Add Attributes:**
   - Go to **Attributes** tab
   - Add these attributes (click "Create Attribute" for each):
     ```
     type (String, 50, Required)
     confidence (Double, Required)
     userMessage (String, 10000, Required)
     aiResponse (String, 10000, Required)
     userId (String, 255, Optional)
     userEmail (String, 255, Optional)
     emailSent (Boolean, Required)
     emailRecipients (String, 1000, Required, Array)
     createdAt (String, 255, Required)
     ```

6. **Create API Key:**
   - Go to **Settings** → **API Keys** → **Create API Key**
   - Name: `Server Key`
   - Scopes: Select `databases.read` and `databases.write`
   - **Copy API Key** → Save it! (You can only see it once!)

### Step 2: SendGrid Setup (3 minutes)

1. **Sign up:** https://sendgrid.com (free tier: 100 emails/day)

2. **Verify Email:**
   - Go to **Settings** → **Sender Authentication**
   - Click **Verify a Single Sender**
   - Enter your email and verify

3. **Create API Key:**
   - Go to **Settings** → **API Keys** → **Create API Key**
   - Name: `Cybersecurity Alerts`
   - Permission: **Full Access** (or just Mail Send)
   - **Copy API Key** → Save it!

### Step 3: Environment Variables (2 minutes)

1. **Create `.env.local` file** in the `v3` folder:

```env
# Appwrite Cloud (from Step 1)
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=paste_your_project_id_here
APPWRITE_API_KEY=paste_your_api_key_here
APPWRITE_DATABASE_ID=paste_your_database_id_here
APPWRITE_ALERTS_COLLECTION_ID=paste_your_collection_id_here

# SendGrid (from Step 2)
SENDGRID_API_KEY=paste_your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=your_verified_email@example.com
ADMIN_EMAIL=admin@example.com

# Optional - VAPI AI (skip if not using)
# VAPI_AI_API_KEY=your_key_here
# VAPI_AI_ASSISTANT_ID=your_id_here
```

2. **Replace all placeholders** with your actual values from Steps 1 and 2

### Step 4: Install & Run (2 minutes)

```bash
cd v3
npm install
npm run dev
```

Open http://localhost:3000

### Step 5: Test It! (1 minute)

1. Type in the chatbot: `"I received a suspicious email asking for my password"`
2. Check Appwrite Console → Databases → Your Collection → Documents
3. Check your email inbox (admin email) for the alert

## ✅ You're Done!

Your app is now running locally. When ready to deploy:

1. **Deploy to Vercel:**
   - Push code to GitHub
   - Import to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy!

2. **See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide**

## 🔧 Troubleshooting

**"Cannot connect to Appwrite"**
- ✅ Check `NEXT_PUBLIC_APPWRITE_ENDPOINT` is exactly: `https://cloud.appwrite.io/v1`
- ✅ Verify Project ID is correct
- ✅ Check API key has `databases.read` and `databases.write` permissions

**"Email not sending"**
- ✅ Verify SendGrid API key is correct
- ✅ Check sender email is verified in SendGrid
- ✅ Check SendGrid Activity logs

**"Alerts not saving"**
- ✅ Verify Database ID and Collection ID are correct
- ✅ Check all attributes are created in Appwrite
- ✅ Verify collection permissions allow writes

## 📋 What You Need

- ✅ Appwrite Cloud account (free)
- ✅ SendGrid account (free tier available)
- ✅ Node.js 18+ installed
- ✅ 15 minutes of time

## 🎯 Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Read [SETUP.md](./SETUP.md) for detailed configuration
- Customize threat detection patterns in `lib/vapi.ts`

