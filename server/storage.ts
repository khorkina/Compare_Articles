import { 
  comparisons, 
  searchSessions,
  type Comparison, 
  type InsertComparison,
  type SearchSession,
  type InsertSearchSession 
} from "@shared/schema";

export interface IStorage {
  // Comparison operations
  createComparison(comparison: InsertComparison): Promise<Comparison>;
  getComparison(id: number): Promise<Comparison | undefined>;
  
  // Search session operations
  createSearchSession(session: InsertSearchSession): Promise<SearchSession>;
  getSearchSession(sessionId: string): Promise<SearchSession | undefined>;
  updateSearchSession(sessionId: string, updates: Partial<InsertSearchSession>): Promise<SearchSession | undefined>;
}

export class MemStorage implements IStorage {
  private comparisons: Map<number, Comparison>;
  private searchSessions: Map<string, SearchSession>;
  private currentComparisonId: number;
  private currentSessionId: number;

  constructor() {
    this.comparisons = new Map();
    this.searchSessions = new Map();
    this.currentComparisonId = 1;
    this.currentSessionId = 1;
  }

  async createComparison(insertComparison: InsertComparison): Promise<Comparison> {
    const id = this.currentComparisonId++;
    const comparison: Comparison = { 
      id,
      articleTitle: insertComparison.articleTitle,
      selectedLanguages: insertComparison.selectedLanguages,
      outputLanguage: insertComparison.outputLanguage,
      comparisonResult: insertComparison.comparisonResult || null,
      isFunnyMode: insertComparison.isFunnyMode || null,
      createdAt: new Date()
    };
    this.comparisons.set(id, comparison);
    return comparison;
  }

  async getComparison(id: number): Promise<Comparison | undefined> {
    return this.comparisons.get(id);
  }

  async createSearchSession(insertSession: InsertSearchSession): Promise<SearchSession> {
    const id = this.currentSessionId++;
    const session: SearchSession = { 
      id,
      sessionId: insertSession.sessionId,
      searchQuery: insertSession.searchQuery || null,
      selectedArticle: insertSession.selectedArticle || null,
      availableLanguages: insertSession.availableLanguages || null,
      createdAt: new Date()
    };
    this.searchSessions.set(insertSession.sessionId, session);
    return session;
  }

  async getSearchSession(sessionId: string): Promise<SearchSession | undefined> {
    return this.searchSessions.get(sessionId);
  }

  async updateSearchSession(sessionId: string, updates: Partial<InsertSearchSession>): Promise<SearchSession | undefined> {
    const existing = this.searchSessions.get(sessionId);
    if (!existing) return undefined;
    
    const updated: SearchSession = { ...existing, ...updates };
    this.searchSessions.set(sessionId, updated);
    return updated;
  }
}

export const storage = new MemStorage();
