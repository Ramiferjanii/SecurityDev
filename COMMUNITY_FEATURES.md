# Community Features Guide

This platform is now a **Community-Driven Cyber Threat & Scam Reporting Platform** where users can collaborate to identify and share threats.

## 🎯 Core Community Features

### 1. User Authentication
- **Sign Up**: Create an account to participate in the community
- **Sign In**: Access your profile and contribute
- **User Profiles**: Build your reputation in the community

### 2. Public Threat Reports
- **Report Threats**: Share threats you've encountered
- **View Reports**: Browse all community-reported threats
- **Filter by Type**: Filter reports by threat type (phishing, malware, etc.)
- **Status Tracking**: Reports can be pending, verified, false positive, or resolved

### 3. Community Voting
- **Upvote/Downvote**: Help verify threat reports by voting
- **Credibility System**: Reports with more upvotes are more credible
- **Community Verification**: Multiple votes help verify threats

### 4. Expert Verification
- **Expert Users**: Designated experts can verify reports
- **Verification Badge**: Verified reports are marked and trusted
- **Quality Control**: Ensures accurate threat information

### 5. Threat Sharing
- **Auto-Sharing**: When chatbot detects a threat, users can share it
- **Manual Reports**: Users can manually create detailed reports
- **Tags & Categories**: Organize threats with tags

## 📋 How It Works

### For Regular Users

1. **Sign Up** → Create an account
2. **Report Threats** → Use chatbot or manual reporting
3. **Vote on Reports** → Help verify community reports
4. **Build Reputation** → Earn reputation by contributing

### For Experts

1. **Get Expert Status** → (Admin assigns)
2. **Verify Reports** → Mark reports as verified
3. **Help Community** → Guide threat identification

### For Admins

1. **Monitor Reports** → View all community activity
2. **Manage Users** → Assign expert status
3. **Verify Threats** → Mark critical threats
4. **Analytics** → Track community engagement

## 🗄️ Database Setup

You need to create a new collection in Appwrite for threat reports:

### Reports Collection

**Collection ID:** `reports` (or set `APPWRITE_REPORTS_COLLECTION_ID`)

**Attributes:**
- `userId` (String, 255, Required)
- `userName` (String, 255, Optional)
- `userEmail` (String, 255, Optional)
- `type` (String, 50, Required) - phishing, account_compromise, malware, scam, other
- `title` (String, 500, Required)
- `description` (String, 10000, Required)
- `confidence` (Double, Required)
- `status` (String, 50, Required) - pending, verified, false_positive, resolved
- `upvotes` (Integer, Required, default: 0)
- `downvotes` (Integer, Required, default: 0)
- `userVotes` (String[], Required, default: [])
- `verifiedBy` (String[], Required, default: [])
- `tags` (String[], Required, default: [])
- `screenshots` (String[], Optional)
- `source` (String, 255, Optional)
- `createdAt` (String, 255, Required)
- `updatedAt` (String, 255, Required)

**Indexes:**
- `type` (for filtering)
- `status` (for filtering)
- `createdAt` (for sorting)
- `upvotes` (for sorting by popularity)

**Permissions:**
- Read: Any (public reports)
- Write: Users (authenticated users can create reports)
- Update: Users (users can vote on their own reports)

## 🔧 Environment Variables

Add to your `.env.local`:

```env
# Reports Collection
APPWRITE_REPORTS_COLLECTION_ID=your_reports_collection_id
```

## 📱 Pages & Routes

### Public Pages
- `/` - Homepage with chatbot
- `/reports` - Public threat reports feed
- `/login` - Sign in page
- `/register` - Sign up page

### Protected Pages (coming soon)
- `/profile` - User profile
- `/report/new` - Create new report
- `/admin` - Admin dashboard

## 🚀 Getting Started

1. **Set up Appwrite Collections**
   - Create the `reports` collection with attributes above
   - Set proper permissions

2. **Configure Environment**
   - Add `APPWRITE_REPORTS_COLLECTION_ID` to `.env.local`

3. **Test the Features**
   - Sign up a new account
   - Report a threat via chatbot
   - View reports on `/reports` page
   - Vote on reports

## 💡 Best Practices

### For Reporters
- Provide detailed descriptions
- Include screenshots if possible
- Use relevant tags
- Be accurate and honest

### For Voters
- Vote based on credibility
- Upvote verified threats
- Downvote false positives
- Help maintain quality

### For Experts
- Verify only confirmed threats
- Provide context when verifying
- Help educate the community

## 🔮 Future Enhancements

- [ ] User profiles with reputation scores
- [ ] Comments on reports
- [ ] Report sharing on social media
- [ ] Email notifications for new reports
- [ ] Threat statistics and trends
- [ ] Expert badges and achievements
- [ ] Report categories and subcategories
- [ ] Search functionality
- [ ] Report moderation tools

## 📊 Community Metrics

Track community engagement:
- Total reports
- Verified reports
- Active users
- Votes cast
- Expert verifications

## 🛡️ Security Considerations

- User authentication required for voting
- Rate limiting on reports
- Content moderation
- Spam detection
- User reputation system

