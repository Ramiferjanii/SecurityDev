# Appwrite Cloud Setup - Step by Step

This guide shows exactly what to configure in Appwrite Cloud for your cybersecurity detection system.

## 🎯 What You'll Create

1. ✅ Project
2. ✅ Database
3. ✅ Collection (with attributes)
4. ✅ API Key

## Step 1: Create Project

1. Go to https://cloud.appwrite.io
2. Sign up or log in
3. Click **"Create Project"**
4. Enter project name: `cybersecurity-detection`
5. Click **"Create"**
6. **Copy the Project ID** (looks like: `67a1b2c3d4e5f6g7h8i9j0`)

**Save this ID - you'll need it for `.env.local`**

---

## Step 2: Create Database

1. In your project, go to **"Databases"** (left sidebar)
2. Click **"Create Database"**
3. Enter name: `security-alerts`
4. Click **"Create"**
5. **Copy the Database ID** (looks like: `67a1b2c3d4e5f6g7h8i9j0`)

**Save this ID - you'll need it for `.env.local`**

---

## Step 3: Create Collection

1. Inside your database, click **"Create Collection"**
2. Collection ID: `alerts` (or use auto-generated)
3. Name: `Alerts`
4. Click **"Create"**
5. **Copy the Collection ID** (looks like: `67a1b2c3d4e5f6g7h8i9j0`)

**Save this ID - you'll need it for `.env.local`**

---

## Step 4: Add Attributes to Collection

Go to the **"Attributes"** tab in your collection and add these one by one:

### Attribute 1: `type`
- **Attribute ID:** `type`
- **Type:** String
- **Size:** `50`
- **Required:** ✅ Yes
- **Array:** ❌ No
- Click **"Create"**

### Attribute 2: `confidence`
- **Attribute ID:** `confidence`
- **Type:** Double
- **Required:** ✅ Yes
- Click **"Create"**

### Attribute 3: `userMessage`
- **Attribute ID:** `userMessage`
- **Type:** String
- **Size:** `10000`
- **Required:** ✅ Yes
- **Array:** ❌ No
- Click **"Create"**

### Attribute 4: `aiResponse`
- **Attribute ID:** `aiResponse`
- **Type:** String
- **Size:** `10000`
- **Required:** ✅ Yes
- **Array:** ❌ No
- Click **"Create"**

### Attribute 5: `userId`
- **Attribute ID:** `userId`
- **Type:** String
- **Size:** `255`
- **Required:** ❌ No
- **Array:** ❌ No
- Click **"Create"**

### Attribute 6: `userEmail`
- **Attribute ID:** `userEmail`
- **Type:** String
- **Size:** `255`
- **Required:** ❌ No
- **Array:** ❌ No
- Click **"Create"**

### Attribute 7: `emailSent`
- **Attribute ID:** `emailSent`
- **Type:** Boolean
- **Required:** ✅ Yes
- Click **"Create"**

### Attribute 8: `emailRecipients`
- **Attribute ID:** `emailRecipients`
- **Type:** String
- **Size:** `1000`
- **Required:** ✅ Yes
- **Array:** ✅ Yes (Important: Check this!)
- Click **"Create"**

### Attribute 9: `createdAt`
- **Attribute ID:** `createdAt`
- **Type:** String
- **Size:** `255`
- **Required:** ✅ Yes
- **Array:** ❌ No
- Click **"Create"**

**✅ You should now have 9 attributes total**

---

## Step 5: Set Collection Permissions

1. Go to **"Settings"** tab in your collection
2. Scroll to **"Permissions"** section
3. Click **"Add Role"**
4. Select **"Any"** (or specific roles if you have authentication)
5. Check these permissions:
   - ✅ **Read**
   - ✅ **Write**
6. Click **"Update"**

> **Note:** For production, restrict write access to authenticated users only.

---

## Step 6: Create API Key

1. Go to **"Settings"** (project settings, not collection settings)
2. Click **"API Keys"** in the left sidebar
3. Click **"Create API Key"**
4. Name: `Server API Key`
5. Select these scopes:
   - ✅ `databases.read`
   - ✅ `databases.write`
   - ✅ `functions.read` (if using Appwrite Functions)
   - ✅ `functions.execute` (if using Appwrite Functions)
6. Click **"Create"**
7. **Copy the API Key** (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`)

> **⚠️ IMPORTANT:** You can only see this key once! Save it immediately.

**Save this key - you'll need it for `.env.local`**

---

## Step 7: Copy Your Values

You should now have these 4 values:

1. ✅ **Project ID** - From Step 1
2. ✅ **Database ID** - From Step 2
3. ✅ **Collection ID** - From Step 3
4. ✅ **API Key** - From Step 6

---

## Step 8: Add to `.env.local`

Create or update your `.env.local` file with:

```env
# Appwrite Cloud Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_from_step_1
APPWRITE_API_KEY=your_api_key_from_step_6
APPWRITE_DATABASE_ID=your_database_id_from_step_2
APPWRITE_ALERTS_COLLECTION_ID=your_collection_id_from_step_3
```

Replace the placeholders with your actual values.

---

## ✅ Verification Checklist

- [ ] Project created
- [ ] Database created
- [ ] Collection created
- [ ] All 9 attributes added
- [ ] Permissions set (Read + Write for "Any")
- [ ] API Key created with correct scopes
- [ ] All IDs copied to `.env.local`
- [ ] `.env.local` file saved

---

## 🧪 Test Your Setup

1. Run your app: `npm run dev`
2. Send a test message in the chatbot
3. Go to Appwrite Console → Databases → Your Database → Your Collection → Documents
4. You should see a new document created!

---

## 🆘 Troubleshooting

**"Collection not found"**
- ✅ Check Collection ID is correct in `.env.local`
- ✅ Verify collection exists in Appwrite Console

**"Permission denied"**
- ✅ Check API key has `databases.read` and `databases.write` scopes
- ✅ Verify collection permissions allow writes

**"Attribute missing"**
- ✅ Check all 9 attributes are created
- ✅ Verify attribute IDs match exactly (case-sensitive)

**"Cannot create document"**
- ✅ Check all required attributes are provided
- ✅ Verify attribute types match (String, Double, Boolean, etc.)

---

## 📚 Next Steps

1. ✅ Set up SendGrid (see [QUICK_SETUP.md](./QUICK_SETUP.md))
2. ✅ Test locally
3. ✅ Deploy to production (see [DEPLOYMENT.md](./DEPLOYMENT.md))

---

## 💡 Pro Tips

- **Keep your API key secure** - Never commit it to git
- **Use environment variables** - Always use `.env.local` for local development
- **Test permissions** - Make sure your API key has the right scopes
- **Check logs** - Appwrite Console shows all API requests and errors

