// Authentication utilities using Appwrite
import { account } from './appwrite';
import type { Models } from 'appwrite';

export interface User extends Models.User<Models.Preferences> {}

export async function signUp(email: string, password: string, name: string) {
  try {
    const user = await account.create('unique()', email, password, name);
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return { success: true, session };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signOut() {
  try {
    await account.deleteSession('current');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    await account.get();
    return true;
  } catch {
    return false;
  }
}

