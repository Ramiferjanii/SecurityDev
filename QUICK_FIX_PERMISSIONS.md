# Quick Fix: Authorization Error

## The Problem
You're getting: `"The current user is not authorized to perform the requested action"`

This means the Appwrite collection doesn't allow the server API key to write documents.

## ⚡ Quick Fix (2 minutes)

### Option 1: Use Alerts Collection (Easiest - No Setup Needed)

The alerts collection should already have the right permissions. Just use it temporarily:

1. **In `.env.local`, comment out or remove:**
   ```env
   # APPWRITE_REPORTS_COLLECTION_ID=your_reports_collection_id
   ```

2. **The system will automatically use the alerts collection**

3. **Restart your dev server**

### Option 2: Fix Reports Collection Permissions

1. **Go to Appwrite Console:**
   - https://cloud.appwrite.io/console
   - Navigate to: Databases → Your Database → Reports Collection

2. **Click "Settings" tab**

3. **Scroll to "Permissions" section**

4. **Click "Add Role"**

5. **Select "any" from the dropdown**

6. **Check these permissions:**
   - ✅ **Read**
   - ✅ **Write**
   - ✅ **Update**

7. **Click "Update"**

8. **Verify API Key:**
   - Go to Settings → API Keys
   - Check your server API key has:
     - ✅ `databases.read`
     - ✅ `databases.write`
     - ✅ `databases.update`

9. **Restart your dev server**

## ✅ Test It

1. Try creating a report via the form
2. Check the browser console for errors
3. If it works, you should see the report in Appwrite Console

## Still Not Working?

1. **Check `.env.local`:**
   ```env
   APPWRITE_API_KEY=your_api_key_here
   APPWRITE_DATABASE_ID=your_database_id
   APPWRITE_REPORTS_COLLECTION_ID=your_collection_id
   ```

2. **Verify API key is correct:**
   - Copy from Appwrite Console → Settings → API Keys
   - Make sure it has `databases.write` scope

3. **Check collection exists:**
   - Go to Appwrite Console → Databases
   - Verify the collection ID matches your `.env.local`

4. **See detailed guide:** `COLLECTION_PERMISSIONS.md`

