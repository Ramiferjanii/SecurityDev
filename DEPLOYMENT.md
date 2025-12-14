# Deployment Guide - Appwrite Cloud Setup

This guide walks you through setting up your cybersecurity detection system with Appwrite Cloud and deploying it to production.

## Prerequisites

- ✅ Appwrite Cloud account (free at https://cloud.appwrite.io)
- ✅ SendGrid account (for email alerts)
- ✅ Vercel account (recommended) or another hosting platform
- ✅ Domain name (optional, but recommended for production)

## Step 1: Appwrite Cloud Setup

### 1.1 Create Appwrite Project

1. **Sign up/Login to Appwrite Cloud:**
   - Go to https://cloud.appwrite.io
   - Sign up or log in

2. **Create a New Project:**
   - Click "Create Project"
   - Name it: `cybersecurity-detection` (or your preferred name)
   - Copy the **Project ID** (you'll need this for `.env.local`)

3. **Get Your Endpoint:**
   - Your endpoint is: `https://cloud.appwrite.io/v1`
   - This is the same for all Appwrite Cloud projects

### 1.2 Create Database

1. **Navigate to Databases:**
   - In your Appwrite project, go to **Databases** → **Create Database**
   - Name: `security-alerts`
   - Copy the **Database ID**

2. **Create Alerts Collection:**
   - Click **Create Collection**
   - Collection ID: `alerts` (or use auto-generated)
   - Name: `Alerts`
   - Copy the **Collection ID**

3. **Add Attributes to Alerts Collection:**
   
   Go to **Attributes** tab and add these one by one:

   | Attribute ID | Type | Size | Required | Array |
   |-------------|------|------|----------|-------|
   | `type` | String | 50 | ✅ Yes | ❌ No |
   | `confidence` | Double | - | ✅ Yes | ❌ No |
   | `userMessage` | String | 10000 | ✅ Yes | ❌ No |
   | `aiResponse` | String | 10000 | ✅ Yes | ❌ No |
   | `userId` | String | 255 | ❌ No | ❌ No |
   | `userEmail` | String | 255 | ❌ No | ❌ No |
   | `emailSent` | Boolean | - | ✅ Yes | ❌ No |
   | `emailRecipients` | String | 1000 | ✅ Yes | ✅ Yes |
   | `createdAt` | String | 255 | ✅ Yes | ❌ No |

4. **Set Collection Permissions:**
   - Go to **Settings** → **Permissions**
   - Add role: **Any** with **Read** and **Write** access
   - Or set specific roles based on your needs
   - **Important:** For production, restrict write access to authenticated users only

5. **Create Indexes (Optional but Recommended):**
   - Go to **Indexes** tab
   - Create index on `type` (for filtering)
   - Create index on `createdAt` (for sorting)

### 1.3 Create API Key

1. **Go to Settings → API Keys:**
   - Click **Create API Key**
   - Name: `Server API Key`
   - Scopes: Select:
     - ✅ `databases.read`
     - ✅ `databases.write`
     - ✅ `functions.read` (if using Appwrite Functions)
     - ✅ `functions.execute` (if using Appwrite Functions)
   - Copy the **API Key** (you can only see it once!)

### 1.4 (Optional) Create Appwrite Function

If you want to use Appwrite Functions for email sending:

1. **Go to Functions → Create Function:**
   - Name: `send-email-alert`
   - Runtime: `Node.js 20.0`
   - Timeout: `15 seconds`

2. **Upload Function Code:**
   - Use the code from `appwrite-functions/send-email-alert/`
   - Or create manually in Appwrite console

3. **Set Environment Variables:**
   - Go to **Settings** → **Environment Variables**
   - Add:
     - `SENDGRID_API_KEY`: Your SendGrid API key
     - `SENDGRID_FROM_EMAIL`: Your sender email

4. **Deploy the Function:**
   - Click **Deploy**
   - Copy the **Function ID**

## Step 2: SendGrid Setup

### 2.1 Create SendGrid Account

1. **Sign up at https://sendgrid.com**
   - Free tier: 100 emails/day

2. **Verify Sender Email:**
   - Go to **Settings** → **Sender Authentication**
   - Click **Verify a Single Sender**
   - Enter your email and verify it

### 2.2 Create API Key

1. **Go to Settings → API Keys:**
   - Click **Create API Key**
   - Name: `Cybersecurity Alerts`
   - Permissions: **Full Access** (or just **Mail Send**)
   - Copy the API key (save it securely!)

## Step 3: Environment Variables

### 3.1 Create `.env.local` File

Create a `.env.local` file in your project root:

```env
# Appwrite Cloud Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_API_KEY=your_api_key_here
APPWRITE_DATABASE_ID=your_database_id_here
APPWRITE_ALERTS_COLLECTION_ID=your_collection_id_here

# SendGrid Email Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# VAPI AI Configuration (Optional)
VAPI_AI_API_KEY=your_vapi_key_here
VAPI_AI_ASSISTANT_ID=your_assistant_id_here

# Appwrite Function (Optional)
APPWRITE_FUNCTION_EMAIL_ALERT_ID=your_function_id_here
```

### 3.2 Fill in Your Values

Replace the placeholders with your actual values from:
- Appwrite Console (Project ID, Database ID, Collection ID, API Key)
- SendGrid Dashboard (API Key)
- VAPI AI Dashboard (if using)

## Step 4: Test Locally

1. **Install dependencies:**
   ```bash
   cd v3
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Test the application:**
   - Open http://localhost:3000
   - Try sending a test message like: "I received a suspicious email asking for my password"
   - Check if alert is created in Appwrite
   - Check if email is sent (check SendGrid Activity)

## Step 5: Deploy to Vercel

### 5.1 Prepare for Deployment

1. **Create `.env.example` (already exists):**
   - This file should NOT contain real values
   - Only variable names for reference

2. **Ensure `.env.local` is in `.gitignore`:**
   - Check that `.env.local` is not committed to git

### 5.2 Deploy to Vercel

1. **Install Vercel CLI (optional):**
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard:**
   - Go to https://vercel.com
   - Click **New Project**
   - Import your Git repository
   - Or drag and drop your project folder

3. **Configure Environment Variables in Vercel:**
   - Go to **Settings** → **Environment Variables**
   - Add ALL variables from your `.env.local`:
     - `NEXT_PUBLIC_APPWRITE_ENDPOINT`
     - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
     - `APPWRITE_API_KEY`
     - `APPWRITE_DATABASE_ID`
     - `APPWRITE_ALERTS_COLLECTION_ID`
     - `SENDGRID_API_KEY`
     - `SENDGRID_FROM_EMAIL`
     - `ADMIN_EMAIL`
     - `VAPI_AI_API_KEY` (if using)
     - `VAPI_AI_ASSISTANT_ID` (if using)

4. **Deploy:**
   - Click **Deploy**
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

### 5.3 Deploy via CLI

```bash
cd v3
vercel
# Follow the prompts
# When asked about environment variables, add them or configure later in dashboard
```

## Step 6: Post-Deployment Checklist

### ✅ Verify Deployment

1. **Test the Application:**
   - Visit your deployed URL
   - Test the chatbot
   - Try detecting a threat

2. **Check Appwrite:**
   - Go to Appwrite Console → Databases → Your Collection
   - Verify alerts are being created

3. **Check SendGrid:**
   - Go to SendGrid → Activity
   - Verify emails are being sent

4. **Test Admin Dashboard:**
   - Visit `https://your-domain.com/admin`
   - Verify alerts are displayed

### ✅ Security Checklist

- [ ] `.env.local` is NOT in git repository
- [ ] Environment variables are set in Vercel
- [ ] Appwrite API key has minimal required permissions
- [ ] SendGrid API key is secure
- [ ] Admin dashboard should have authentication (add later)
- [ ] Rate limiting should be implemented (add later)

## Step 7: Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to **Settings** → **Domains**
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables:**
   - If using webhooks, update URLs to use custom domain

## Troubleshooting

### Issue: "Appwrite connection failed"
- ✅ Check `NEXT_PUBLIC_APPWRITE_ENDPOINT` is correct
- ✅ Verify `NEXT_PUBLIC_APPWRITE_PROJECT_ID` is correct
- ✅ Check API key has correct permissions
- ✅ Ensure database and collection IDs are correct

### Issue: "Emails not sending"
- ✅ Verify SendGrid API key is correct
- ✅ Check sender email is verified in SendGrid
- ✅ Review SendGrid Activity logs
- ✅ Check spam folder

### Issue: "Alerts not saving"
- ✅ Verify database and collection IDs
- ✅ Check collection permissions
- ✅ Ensure all required attributes exist
- ✅ Check Appwrite logs

### Issue: "Build fails on Vercel"
- ✅ Check all environment variables are set
- ✅ Verify Node.js version (should be 18+)
- ✅ Check build logs for specific errors

## Quick Reference

### Appwrite Cloud URLs
- **Endpoint:** `https://cloud.appwrite.io/v1`
- **Console:** https://cloud.appwrite.io/console
- **Documentation:** https://appwrite.io/docs

### Important IDs to Collect
1. Project ID (from Appwrite project settings)
2. Database ID (from Databases section)
3. Collection ID (from your collection)
4. API Key (from Settings → API Keys)

### Environment Variables Summary
```env
# Required
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=xxx
APPWRITE_API_KEY=xxx
APPWRITE_DATABASE_ID=xxx
APPWRITE_ALERTS_COLLECTION_ID=xxx
SENDGRID_API_KEY=xxx
SENDGRID_FROM_EMAIL=xxx
ADMIN_EMAIL=xxx

# Optional
VAPI_AI_API_KEY=xxx
VAPI_AI_ASSISTANT_ID=xxx
APPWRITE_FUNCTION_EMAIL_ALERT_ID=xxx
```

## Next Steps After Deployment

1. ✅ Add user authentication
2. ✅ Implement rate limiting
3. ✅ Add monitoring/analytics
4. ✅ Set up error tracking (Sentry, etc.)
5. ✅ Configure custom domain
6. ✅ Add SSL certificate (automatic with Vercel)

## Support

- Appwrite Docs: https://appwrite.io/docs
- SendGrid Docs: https://docs.sendgrid.com
- Vercel Docs: https://vercel.com/docs

