# Appwrite Collection Permissions Setup

## Issue: "User not authorized" Error

If you're getting `user_unauthorized` errors when creating reports, you need to configure the collection permissions correctly in Appwrite.

## Solution: Set Collection Permissions

### For Reports Collection

1. **Go to Appwrite Console** → Your Database → Reports Collection
2. **Click on "Settings"** tab
3. **Scroll to "Permissions"** section
4. **Add the following permissions:**

#### Option 1: Allow Server API Key (Recommended for Server-Side Operations)

- **Role:** `any` (or create a custom role)
- **Permissions:**
  - ✅ **Read** - Allow anyone to read reports
  - ✅ **Write** - Allow server API key to create/update reports
  - ✅ **Update** - Allow server API key to update reports
  - ✅ **Delete** - (Optional) Allow server API key to delete reports

#### Option 2: Allow Authenticated Users

- **Role:** `users` (authenticated users)
- **Permissions:**
  - ✅ **Read** - Allow authenticated users to read
  - ✅ **Write** - Allow authenticated users to create
  - ✅ **Update** - Allow authenticated users to update their own reports

#### Option 3: Public Read, Authenticated Write (Best for Community)

- **For Reading:**
  - **Role:** `any`
  - **Permission:** ✅ **Read**
  
- **For Writing:**
  - **Role:** `users` (authenticated users)
  - **Permissions:** ✅ **Write**, ✅ **Update**

- **For Server Operations:**
  - **Role:** `any` (or custom server role)
  - **Permissions:** ✅ **Write**, ✅ **Update** (for API key operations)

## Recommended Setup

For a community platform, use this configuration:

### Reports Collection Permissions:

1. **Public Read Access:**
   - Role: `any`
   - Permission: ✅ Read

2. **Authenticated User Write:**
   - Role: `users`
   - Permissions: ✅ Write, ✅ Update

3. **Server API Key Access:**
   - Role: `any` (or create custom role)
   - Permissions: ✅ Write, ✅ Update, ✅ Delete
   - **Note:** The server API key (setDevKey) should bypass these permissions, but if it doesn't, ensure the API key has `databases.write` scope.

## Check API Key Scopes

1. Go to **Appwrite Console** → **Settings** → **API Keys**
2. Find your server API key
3. Ensure it has these scopes:
   - ✅ `databases.read`
   - ✅ `databases.write`
   - ✅ `databases.update`
   - ✅ `databases.delete` (optional)

## Alternative: Use User Session (Client-Side)

If server-side API key doesn't work, you can create reports from the client-side using user sessions:

```typescript
// In your API route, forward the user session
// Or create reports directly from client-side
```

But this requires the user to be authenticated and the collection to allow `users` role to write.

## Quick Fix

The easiest solution is to:

1. **Set Reports Collection Permissions:**
   - Go to Collection → Settings → Permissions
   - Add: **Role: `any`** with **Read** and **Write** permissions
   - This allows both public access and server API key access

2. **Verify API Key:**
   - Ensure your `APPWRITE_API_KEY` has `databases.write` scope
   - The API key should bypass collection permissions

## Testing

After setting permissions:

1. Try creating a report via the form
2. Check the console for any errors
3. Verify the report appears in Appwrite Console

If you still get errors, check:
- API key is correct in `.env.local`
- API key has proper scopes
- Collection permissions are saved
- Collection ID is correct in `.env.local`

