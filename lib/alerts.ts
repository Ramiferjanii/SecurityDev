// Alert logging and database utilities
import { getServerClient } from './appwrite';
import { Query } from 'appwrite';
import type { AlertLog, CyberattackDetection } from '@/types';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || '';
const ALERTS_COLLECTION_ID = process.env.APPWRITE_ALERTS_COLLECTION_ID || '';

export async function logAlert(
  detection: CyberattackDetection,
  emailSent: boolean,
  emailRecipients: string[]
): Promise<AlertLog | null> {
  try {
    if (!DATABASE_ID || !ALERTS_COLLECTION_ID) {
      console.warn('Appwrite database not configured. Alert not logged.');
      return null;
    }

    const { databases } = getServerClient();
    const alertLog: Omit<AlertLog, '$id'> = {
      type: detection.type,
      confidence: detection.confidence,
      userMessage: detection.userMessage,
      aiResponse: detection.aiResponse,
      userId: detection.userId,
      userEmail: detection.userEmail,
      emailSent,
      emailRecipients,
      createdAt: new Date().toISOString(),
    };

    const result = await databases.createDocument(
      DATABASE_ID,
      ALERTS_COLLECTION_ID,
      'unique()',
      alertLog
    );

    return result as unknown as AlertLog;
  } catch (error) {
    console.error('Error logging alert:', error);
    return null;
  }
}

export async function getAlerts(limit: number = 50): Promise<AlertLog[]> {
  try {
    if (!DATABASE_ID || !ALERTS_COLLECTION_ID) {
      return [];
    }

    const { databases } = getServerClient();
    const response = await databases.listDocuments(
      DATABASE_ID,
      ALERTS_COLLECTION_ID,
      [],
      limit.toString()
    );

    return (response.documents as unknown as AlertLog[]).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
}

export async function getAlertsByType(type: CyberattackDetection['type']): Promise<AlertLog[]> {
  try {
    if (!DATABASE_ID || !ALERTS_COLLECTION_ID) {
      return [];
    }

    const { databases } = getServerClient();
    const response = await databases.listDocuments(
      DATABASE_ID,
      ALERTS_COLLECTION_ID,
      [Query.equal('type', type)],
      '100'
    );

    return response.documents as unknown as AlertLog[];
  } catch (error) {
    console.error('Error fetching alerts by type:', error);
    return [];
  }
}

