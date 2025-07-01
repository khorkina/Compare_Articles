import { openDB, type IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';

// Database schema
export interface UserAccount {
  id: string;
  createdAt: string;
  openaiApiKey?: string;
  isPremium: boolean;
  subscriptionTimestamp?: string;
  preferences: {
    defaultLanguage: string;
    theme: 'light' | 'dark';
  };
}

export interface StorageComparisonResult {
  id: string;
  userId: string;
  articleTitle: string;
  selectedLanguages: string[];
  outputLanguage: string;
  baseLanguage: string;
  comparisonResult: string;
  isFunnyMode: boolean;
  createdAt: string;
  articles: Array<{
    language: string;
    title: string;
    content: string;
    contentLength: number;
  }>;
}

export interface SearchSession {
  id: string;
  userId: string;
  searchQuery?: string;
  selectedArticle?: any;
  availableLanguages?: Array<{
    lang: string;
    title: string;
    url: string;
  }>;
  createdAt: string;
}

class ClientStorage {
  private db: IDBPDatabase | null = null;
  private dbName = 'WikiTruthDB';
  private dbVersion = 1;

  async init(): Promise<void> {
    this.db = await openDB(this.dbName, this.dbVersion, {
      upgrade(db) {
        // User accounts store
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }

        // Comparisons store
        if (!db.objectStoreNames.contains('comparisons')) {
          const comparisonsStore = db.createObjectStore('comparisons', { keyPath: 'id' });
          comparisonsStore.createIndex('userId', 'userId', { unique: false });
          comparisonsStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Search sessions store
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionsStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionsStore.createIndex('userId', 'userId', { unique: false });
        }
      },
    });
  }

  // User account management
  async getCurrentUser(): Promise<UserAccount> {
    if (!this.db) await this.init();
    
    // Check localStorage for existing user ID
    let userId = localStorage.getItem('wikiTruthUserId');
    
    if (!userId) {
      // Create new user
      userId = uuidv4();
      localStorage.setItem('wikiTruthUserId', userId);
      
      const newUser: UserAccount = {
        id: userId,
        createdAt: new Date().toISOString(),
        isPremium: false,
        preferences: {
          defaultLanguage: 'en',
          theme: 'light'
        }
      };
      
      await this.db!.put('users', newUser);
      return newUser;
    }

    // Get existing user
    const user = await this.db!.get('users', userId);
    if (user) {
      return user;
    }

    // User ID exists in localStorage but not in IndexedDB - recreate
    const recreatedUser: UserAccount = {
      id: userId,
      createdAt: new Date().toISOString(),
      isPremium: false,
      preferences: {
        defaultLanguage: 'en',
        theme: 'light'
      }
    };
    
    await this.db!.put('users', recreatedUser);
    return recreatedUser;
  }

  async updateUser(updates: Partial<UserAccount>): Promise<UserAccount> {
    if (!this.db) await this.init();
    
    const currentUser = await this.getCurrentUser();
    const updatedUser = { ...currentUser, ...updates };
    
    await this.db!.put('users', updatedUser);
    return updatedUser;
  }

  async setOpenAIKey(apiKey: string): Promise<void> {
    await this.updateUser({ openaiApiKey: apiKey || undefined });
  }

  async getOpenAIKey(): Promise<string | undefined> {
    const user = await this.getCurrentUser();
    return user.openaiApiKey;
  }

  // Subscription management
  async setPremiumStatus(isPremium: boolean, timestamp?: string): Promise<void> {
    await this.updateUser({ 
      isPremium, 
      subscriptionTimestamp: timestamp || new Date().toISOString() 
    });
  }

  async isSubscriptionValid(): Promise<boolean> {
    const user = await this.getCurrentUser();
    
    if (!user.isPremium || !user.subscriptionTimestamp) {
      return false;
    }

    const subscriptionDate = new Date(user.subscriptionTimestamp);
    const now = new Date();
    const daysDiff = (now.getTime() - subscriptionDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysDiff <= 30;
  }

  async getSubscriptionInfo(): Promise<{
    isPremium: boolean;
    isValid: boolean;
    daysRemaining: number;
    subscriptionDate?: string;
  }> {
    const user = await this.getCurrentUser();
    const isValid = await this.isSubscriptionValid();
    
    let daysRemaining = 0;
    if (user.isPremium && user.subscriptionTimestamp) {
      const subscriptionDate = new Date(user.subscriptionTimestamp);
      const now = new Date();
      const daysPassed = (now.getTime() - subscriptionDate.getTime()) / (1000 * 60 * 60 * 24);
      daysRemaining = Math.max(0, 30 - daysPassed);
    }

    return {
      isPremium: user.isPremium,
      isValid,
      daysRemaining: Math.floor(daysRemaining),
      subscriptionDate: user.subscriptionTimestamp
    };
  }

  // Comparison management
  async saveComparison(comparison: Omit<StorageComparisonResult, 'id' | 'userId' | 'createdAt'>): Promise<StorageComparisonResult> {
    if (!this.db) await this.init();
    
    const user = await this.getCurrentUser();
    const fullComparison: StorageComparisonResult = {
      id: uuidv4(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      ...comparison
    };
    
    await this.db!.put('comparisons', fullComparison);
    return fullComparison;
  }

  async getComparison(id: string): Promise<StorageComparisonResult | undefined> {
    if (!this.db) await this.init();
    return this.db!.get('comparisons', id);
  }

  async getUserComparisons(): Promise<StorageComparisonResult[]> {
    if (!this.db) await this.init();
    
    const user = await this.getCurrentUser();
    const tx = this.db!.transaction('comparisons', 'readonly');
    const index = tx.store.index('userId');
    const comparisons = await index.getAll(user.id);
    
    return comparisons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async deleteComparison(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('comparisons', id);
  }

  // Search session management
  async saveSession(session: Omit<SearchSession, 'id' | 'userId' | 'createdAt'>): Promise<SearchSession> {
    if (!this.db) await this.init();
    
    const user = await this.getCurrentUser();
    const fullSession: SearchSession = {
      id: uuidv4(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      ...session
    };
    
    await this.db!.put('sessions', fullSession);
    return fullSession;
  }

  async getSession(id: string): Promise<SearchSession | undefined> {
    if (!this.db) await this.init();
    return this.db!.get('sessions', id);
  }

  async updateSession(id: string, updates: Partial<SearchSession>): Promise<SearchSession | undefined> {
    if (!this.db) await this.init();
    
    const session = await this.getSession(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    await this.db!.put('sessions', updatedSession);
    return updatedSession;
  }

  // Data export for user
  async exportAllData(): Promise<{
    user: UserAccount;
    comparisons: StorageComparisonResult[];
    sessions: SearchSession[];
  }> {
    const user = await this.getCurrentUser();
    const comparisons = await this.getUserComparisons();
    
    if (!this.db) await this.init();
    const tx = this.db!.transaction('sessions', 'readonly');
    const index = tx.store.index('userId');
    const sessions = await index.getAll(user.id);
    
    return { user, comparisons, sessions };
  }

  // Clear all user data
  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();
    
    const user = await this.getCurrentUser();
    
    // Clear IndexedDB data
    const tx = this.db!.transaction(['comparisons', 'sessions', 'users'], 'readwrite');
    
    const comparisonsIndex = tx.objectStore('comparisons').index('userId');
    const userComparisons = await comparisonsIndex.getAllKeys(user.id);
    for (const key of userComparisons) {
      await tx.objectStore('comparisons').delete(key);
    }
    
    const sessionsIndex = tx.objectStore('sessions').index('userId');
    const userSessions = await sessionsIndex.getAllKeys(user.id);
    for (const key of userSessions) {
      await tx.objectStore('sessions').delete(key);
    }
    
    await tx.objectStore('users').delete(user.id);
    await tx.done;
    
    // Clear localStorage
    localStorage.removeItem('wikiTruthUserId');
  }
}

export const clientStorage = new ClientStorage();