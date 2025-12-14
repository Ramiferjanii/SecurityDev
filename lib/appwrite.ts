// Appwrite client configuration and utilities
import { Client, Databases, Account, Functions } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const databases = new Databases(client);
export const account = new Account(client);
export const functions = new Functions(client);

export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || '';
export const ALERTS_COLLECTION_ID = process.env.APPWRITE_ALERTS_COLLECTION_ID || '';
export const USERS_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID || '';

// Server-side client (with API key)
export function getServerClient() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
  const apiKey = process.env.APPWRITE_API_KEY || '';
  
  const serverClient = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);
  
  // Set API key for server-side authentication
  // In Appwrite SDK v21+, use setDevKey method for server-side API key
  if (apiKey) {
    serverClient.setDevKey(apiKey);
  }
  
  return {
    databases: new Databases(serverClient),
    functions: new Functions(serverClient),
  };
}

