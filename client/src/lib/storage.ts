import { openDB, type IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';

// Database schema - simplified, subscription-free
export interface UserAccount {
  id: string;
  createdAt: string;
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
  private dbVersion = 2; // Incremented for schema change

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

  // User account management - simplified
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
      // Clean up any old subscription fields that might exist
      const cleanUser: UserAccount = {
        id: user.id,
        createdAt: user.createdAt,
        preferences: user.preferences || {
          defaultLanguage: 'en',
          theme: 'light'
        }
      };
      return cleanUser;
    }

    // User ID exists in localStorage but not in IndexedDB - recreate
    const recreatedUser: UserAccount = {
      id: userId,
      createdAt: new Date().toISOString(),
      preferences: {
        defaultLanguage: 'en',
        theme: 'light'
      }
    };
    
    await this.db!.put('users', recreatedUser);
    return recreatedUser;
  }

  async updateUser(updates: Partial<UserAccount>): Promise<UserAccount> {
    const currentUser = await this.getCurrentUser();
    const updatedUser = { ...currentUser, ...updates };
    await this.db!.put('users', updatedUser);
    return updatedUser;
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
    return await this.db!.get('comparisons', id);
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

  // Session management
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
    return await this.db!.get('sessions', id);
  }

  async updateSession(id: string, updates: Partial<SearchSession>): Promise<SearchSession | undefined> {
    if (!this.db) await this.init();
    const existing = await this.getSession(id);
    if (!existing) return undefined;

    const updated: SearchSession = { ...existing, ...updates };
    await this.db!.put('sessions', updated);
    return updated;
  }

  // Data export and management
  async exportAllData(): Promise<{
    user: UserAccount;
    comparisons: StorageComparisonResult[];
    sessions: SearchSession[];
  }> {
    const user = await this.getCurrentUser();
    const comparisons = await this.getUserComparisons();
    const sessions = await this.getAllSessions();
    
    return { user, comparisons, sessions };
  }

  async getAllSessions(): Promise<SearchSession[]> {
    if (!this.db) await this.init();
    const user = await this.getCurrentUser();
    
    const tx = this.db!.transaction('sessions', 'readonly');
    const index = tx.store.index('userId');
    return await index.getAll(user.id);
  }

  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();
    
    const tx = this.db!.transaction(['users', 'comparisons', 'sessions'], 'readwrite');
    await Promise.all([
      tx.objectStore('users').clear(),
      tx.objectStore('comparisons').clear(),
      tx.objectStore('sessions').clear()
    ]);
    
    localStorage.removeItem('wikiTruthUserId');
  }
}

export const clientStorage = new ClientStorage();