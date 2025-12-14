# Fix: Add Comments Attribute to Appwrite

## The Problem
Your terminal shows this error:
```
AppwriteException: Invalid document structure: Unknown attribute: "comments"
```

This means the `comments` field doesn't exist in your **Reports** collection in Appwrite.

## The Solution

### Step 1: Go to Appwrite Console
1. Open https://cloud.appwrite.io
2. Select your project
3. Go to **Databases** → Your database → **reports** collection
4. Click the **"Attributes"** tab

### Step 2: Add Comments Attribute
Click **"Create Attribute"** and enter:

- **Attribute ID:** `comments`
- **Type:** **String** (select from dropdown)
- **Size:** `100000` (to allow large comment threads)
- **Required:** ❌ **NO** (uncheck this - existing reports won't have comments)
- **Array:** ✅ **YES** (IMPORTANT: Check this box!)
- **Default:** Leave empty

Click **"Create"**

### Step 3: Wait for Index
Appwrite will create the attribute. Wait for the status to change from "Processing" to "Available" (usually takes 5-10 seconds).

### Step 4: Test
1. Go back to your app
2. Refresh the report page
3. Post a comment
4. It should now appear immediately!

## ✅ Verification
After adding the attribute, your comments will:
- ✅ Save successfully
- ✅ Appear immediately after posting
- ✅ Persist across page reloads
- ✅ Show user names and timestamps

## 🔍 How to Check if it Worked
Look at your terminal - you should **NOT** see this error anymore:
```
AppwriteException: Invalid document structure: Unknown attribute: "comments"
```
