// Type definitions for the cybersecurity detection system

export interface CyberattackDetection {
  type: 'phishing' | 'account_compromise' | 'malware' | 'scam' | 'other';
  confidence: number;
  detectedAt: string;
  userMessage: string;
  aiResponse: string;
  userId?: string;
  userEmail?: string;
  entities?: {
    urls: string[];
    emails: string[];
  };
}

export interface EmailAlert {
  to: string[];
  subject: string;
  html: string;
  text: string;
  alertType: CyberattackDetection['type'];
  detectionData: CyberattackDetection;
}

export interface AlertLog {
  $id?: string;
  type: CyberattackDetection['type'];
  confidence: number;
  userMessage: string;
  aiResponse: string;
  userId?: string;
  userEmail?: string;
  emailSent: boolean;
  emailRecipients: string[];
  createdAt: string;
}

export interface VAPIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface VAPIResponse {
  message: string;
  intent?: string;
  confidence?: number;
  detectedThreat?: boolean;
  threatType?: CyberattackDetection['type'];
  entities?: {
    urls: string[];
    emails: string[];
  };
  verdict?: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS';
  riskScore?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  threatDetected?: boolean;
  threatType?: CyberattackDetection['type'];
  entities?: {
    urls: string[];
    emails: string[];
  };
  verdict?: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS';
  riskScore?: number;
}

// Community features
export interface ThreatReport {
  $id?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  type: CyberattackDetection['type'];
  title: string;
  description: string;
  confidence: number;
  status: 'pending' | 'verified' | 'false_positive' | 'resolved';
  upvotes: number;
  downvotes: number;
  userVotes: string[]; // Array of user IDs who voted
  verifiedBy?: string[]; // Array of expert user IDs who verified
  tags: string[];
  screenshots?: string[]; // URLs to screenshots
  source?: string; // Email, website, etc.
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  $id?: string;
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  reputation: number;
  reportsCount: number;
  verifiedReportsCount: number;
  expert: boolean;
  createdAt: string;
}

export interface Comment {
  $id?: string;
  reportId: string;
  userId: string;
  userName?: string;
  content: string;
  upvotes: number;
  createdAt: string;
}

export interface Vote {
  reportId: string;
  userId: string;
  type: 'upvote' | 'downvote';
  createdAt: string;
}

