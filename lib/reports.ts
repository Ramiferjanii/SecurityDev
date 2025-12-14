// Community threat reports utilities
import { getServerClient } from './appwrite';
import { Query } from 'appwrite';
import type { ThreatReport, CyberattackDetection } from '@/types';
import { logAlert } from './alerts';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || '';
const REPORTS_COLLECTION_ID = process.env.APPWRITE_REPORTS_COLLECTION_ID || '';

// Get databases client (call getServerClient inside functions to ensure fresh client)
function getDatabases() {
  return getServerClient().databases;
}

export async function createThreatReport(report: Omit<ThreatReport, '$id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'downvotes' | 'userVotes' | 'verifiedBy' | 'status'>): Promise<ThreatReport | null> {
  try {
    if (!DATABASE_ID) {
      console.warn('Appwrite database not configured. Report not saved.');
      return null;
    }

    // Use reports collection if configured, otherwise fallback to alerts collection
    const collectionId = REPORTS_COLLECTION_ID || process.env.APPWRITE_ALERTS_COLLECTION_ID;
    
    if (!collectionId) {
      console.warn('No collection configured for reports. Please set APPWRITE_REPORTS_COLLECTION_ID or APPWRITE_ALERTS_COLLECTION_ID');
      return null;
    }

    // Check if we're using alerts collection (different schema) or reports collection
    // Note: We don't generate reportId - Appwrite's $id will serve as the unique identifier
    const isAlertsCollection = collectionId === process.env.APPWRITE_ALERTS_COLLECTION_ID && !REPORTS_COLLECTION_ID;
    
    let newReport: any;
    
    if (isAlertsCollection) {
      // Map to alerts collection schema (simpler schema without confidence, upvotes, etc.)
      newReport = {
        type: report.type,
        userMessage: `${report.title}\n\n${report.description}`,
        aiResponse: `Community report submitted: ${report.title}`,
        userId: report.userId,
        userEmail: report.userEmail,
        emailSent: false,
        emailRecipients: [],
        createdAt: new Date().toISOString(),
      };
    } else {
      // Use reports collection schema (full community features)
      // Build explicitly to avoid sending unsupported attributes
      // Note: reportId is not included - Appwrite's $id will be used as the unique identifier
      newReport = {
        userId: report.userId,
        userName: report.userName,
        userEmail: report.userEmail,
        type: report.type,
        title: report.title,
        description: report.description,
        // reportId removed - not in collection schema, use $id instead
        upvotes: 0,
        downvotes: 0,
        userVotes: [],
        verifiedBy: [],
        status: 'pending',
        tags: report.tags || [],
        source: report.source,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Note: Not including 'confidence' as it may not exist in collection schema
      };
    }

    const databases = getDatabases();
    
    // Log for debugging
    console.log('Creating report in collection:', collectionId);
    console.log('Report data:', JSON.stringify(newReport, null, 2));
    
    const result = await databases.createDocument(
      DATABASE_ID,
      collectionId,
      'unique()',
      newReport
    );

    // Also log as an alert so it shows up in the Admin Dashboard
    if (!isAlertsCollection) {
      try {
        const detection: CyberattackDetection = {
          type: report.type,
          confidence: report.confidence || 0.8,
          detectedAt: new Date().toISOString(),
          userMessage: `[REPORT] ${report.title}\n\n${report.description}`,
          aiResponse: 'Manual Report submitted by user.',
          userId: report.userId,
          userEmail: report.userEmail,
        };
        await logAlert(detection, false, []);
      } catch (alertError) {
        console.warn('Failed to auto-log report as alert:', alertError);
        // Don't fail the report creation just because alert logging failed
      }
    }

    return result as unknown as ThreatReport;
  } catch (error: any) {
    console.error('Error creating threat report:', error);
    
    // Provide helpful error message
    if (error.code === 401 || error.type === 'user_unauthorized') {
      console.error('Authorization Error:');
      console.error('1. Check that APPWRITE_API_KEY is set in .env.local');
      console.error('2. Verify API key has "databases.write" scope in Appwrite Console');
      console.error('3. Set collection permissions: Role "any" with Write permission');
      console.error('4. See COLLECTION_PERMISSIONS.md for detailed instructions');
    } else if (error.code === 400 && error.type === 'document_invalid_structure') {
      console.error('Schema Mismatch Error:');
      console.error('The collection schema requires different attributes than provided.');
      console.error('Error details:', error.message);
      console.error('Report data that was sent:', JSON.stringify({
        ...report,
        // reportId removed - not in collection schema
        upvotes: 0,
        downvotes: 0,
        userVotes: [],
        verifiedBy: [],
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, null, 2));
      console.error('Tip: Check your collection attributes in Appwrite Console');
      console.error('Required attributes may differ from the ThreatReport interface');
    }
    
    throw error; // Re-throw so API route can handle it
  }
}

export async function getThreatReports(limit: number = 50, type?: string): Promise<ThreatReport[]> {
  try {
    if (!DATABASE_ID) {
      return [];
    }

    // Use reports collection if configured, otherwise fallback to alerts collection
    const collectionId = REPORTS_COLLECTION_ID || process.env.APPWRITE_ALERTS_COLLECTION_ID;
    
    if (!collectionId) {
      return [];
    }

    const queries = [];
    if (type) {
      queries.push(Query.equal('type', type));
    }
    // Don't order by createdAt in query - will sort manually to avoid schema errors
    queries.push(Query.limit(limit));

    const databases = getDatabases();
    const response = await databases.listDocuments(
      DATABASE_ID,
      collectionId,
      queries
    );

    const reports = response.documents as unknown as ThreatReport[];
    
    // Sort manually by createdAt (if exists) or $createdAt (Appwrite's built-in)
    return reports.sort((a, b) => {
      // Try createdAt first, then $createdAt (Appwrite's built-in timestamp)
      const aTime = a.createdAt || (a as any).$createdAt || '';
      const bTime = b.createdAt || (b as any).$createdAt || '';
      
      if (!aTime || !bTime) return 0; // Keep order if no timestamp
      
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  } catch (error: any) {
    console.error('Error fetching threat reports:', error);
    return [];
  }
}

export async function voteOnReport(reportId: string, userId: string, voteType: 'upvote' | 'downvote'): Promise<boolean> {
  try {
    if (!reportId) {
      console.error('voteOnReport: reportId is missing');
      return false;
    }

    if (!DATABASE_ID) {
      console.error('voteOnReport: DATABASE_ID is not configured');
      return false;
    }

    const collectionId = REPORTS_COLLECTION_ID || process.env.APPWRITE_ALERTS_COLLECTION_ID;
    if (!collectionId) {
      console.error('voteOnReport: Collection ID is not configured');
      return false;
    }

    // Check if we're using alerts collection (which doesn't support voting)
    const isAlertsCollection = collectionId === process.env.APPWRITE_ALERTS_COLLECTION_ID && !REPORTS_COLLECTION_ID;
    if (isAlertsCollection) {
      console.warn('voteOnReport: Voting is not supported for alerts collection. Use reports collection for voting features.');
      return false;
    }

    const databases = getDatabases();
    
    // Get current report
    console.log('voteOnReport: Fetching document with ID:', reportId, 'from collection:', collectionId);
    const report = await databases.getDocument(
      DATABASE_ID,
      collectionId,
      reportId
    ) as unknown as ThreatReport;

    // Track votes: userVotes stores "userId:voteType" to track which type each user voted
    // This allows us to prevent duplicate votes and handle vote switching
    const currentVotes = (report.userVotes || []) as string[];
    const userVoteEntry = currentVotes.find(v => v.startsWith(`${userId}:`));
    const hasVoted = !!userVoteEntry;
    const previousVoteType = userVoteEntry ? userVoteEntry.split(':')[1] : null;
    
    let newVotes = [...currentVotes];
    let upvotes = report.upvotes || 0;
    let downvotes = report.downvotes || 0;

    // If user already voted for the same type, do nothing (prevent duplicate votes)
    if (hasVoted && previousVoteType === voteType) {
      console.log(`User ${userId} already ${voteType}d this report. Ignoring duplicate vote.`);
      return true; // Return true but don't change anything
    }

    // If user voted for different type, switch their vote
    if (hasVoted && previousVoteType !== voteType) {
      // Remove previous vote
      newVotes = newVotes.filter(v => !v.startsWith(`${userId}:`));
      if (previousVoteType === 'upvote') {
        upvotes = Math.max(0, upvotes - 1);
      } else if (previousVoteType === 'downvote') {
        downvotes = Math.max(0, downvotes - 1);
      }
      // Add new vote type
      newVotes.push(`${userId}:${voteType}`);
      if (voteType === 'upvote') {
        upvotes += 1;
      } else {
        downvotes += 1;
      }
    } else if (!hasVoted) {
      // User hasn't voted yet, add their vote
      newVotes.push(`${userId}:${voteType}`);
      if (voteType === 'upvote') {
        upvotes += 1;
      } else {
        downvotes += 1;
      }
    }

    // Update report
    await databases.updateDocument(
      DATABASE_ID,
      collectionId,
      reportId,
      {
        upvotes,
        downvotes,
        userVotes: newVotes,
        updatedAt: new Date().toISOString(),
      }
    );

    return true;
  } catch (error) {
    console.error('Error voting on report:', error);
    return false;
  }
}

export async function verifyReport(reportId: string, expertUserId: string): Promise<boolean> {
  try {
    if (!DATABASE_ID) {
      return false;
    }

    const collectionId = REPORTS_COLLECTION_ID || process.env.APPWRITE_ALERTS_COLLECTION_ID;
    if (!collectionId) {
      return false;
    }

    const databases = getDatabases();
    const report = await databases.getDocument(
      DATABASE_ID,
      collectionId,
      reportId
    ) as unknown as ThreatReport;

    const verifiedBy = [...(report.verifiedBy || []), expertUserId];

    await databases.updateDocument(
      DATABASE_ID,
      collectionId,
      reportId,
      {
        verifiedBy,
        status: verifiedBy.length >= 2 ? 'verified' : 'pending',
        updatedAt: new Date().toISOString(),
      }
    );

    return true;
  } catch (error) {
    console.error('Error verifying report:', error);
    return false;
  }
}

