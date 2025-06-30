import { apiRequest } from "./queryClient";

export interface SearchResult {
  title: string;
  snippet: string;
  pageid: number;
}

export interface LanguageLink {
  lang: string;
  title: string;
  url: string;
}

export interface ComparisonRequest {
  articleTitle: string;
  selectedLanguages: string[];
  outputLanguage: string;
  isFunnyMode?: boolean;
}

export interface ComparisonResult {
  id: number;
  articleTitle: string;
  selectedLanguages: string[];
  outputLanguage: string;
  comparisonResult: string;
  isFunnyMode: boolean;
  createdAt: string;
  articles?: Array<{
    language: string;
    title: string;
    contentLength: number;
  }>;
}

export interface SearchSession {
  id: number;
  sessionId: string;
  searchQuery?: string;
  selectedArticle?: any;
  availableLanguages?: LanguageLink[];
  createdAt: string;
}

export const api = {
  // Wikipedia search
  async searchArticles(query: string, language: string = 'en', limit: number = 10): Promise<SearchResult[]> {
    const params = new URLSearchParams({
      query,
      language,
      limit: limit.toString()
    });
    
    const response = await apiRequest('GET', `/api/wikipedia/search?${params}`);
    return response.json();
  },

  // Get language links
  async getLanguageLinks(title: string, language: string = 'en'): Promise<LanguageLink[]> {
    const params = new URLSearchParams({ title, language });
    
    const response = await apiRequest('GET', `/api/wikipedia/languages?${params}`);
    return response.json();
  },

  // Search sessions
  async createSession(sessionData: Partial<SearchSession> = {}): Promise<SearchSession> {
    const response = await apiRequest('POST', '/api/sessions', sessionData);
    return response.json();
  },

  async updateSession(sessionId: string, updates: Partial<SearchSession>): Promise<SearchSession> {
    const response = await apiRequest('PATCH', `/api/sessions/${sessionId}`, updates);
    return response.json();
  },

  async getSession(sessionId: string): Promise<SearchSession> {
    const response = await apiRequest('GET', `/api/sessions/${sessionId}`);
    return response.json();
  },

  // Comparisons
  async compareArticles(comparisonData: ComparisonRequest): Promise<ComparisonResult> {
    const response = await apiRequest('POST', '/api/compare', comparisonData);
    return response.json();
  },

  async getComparison(id: number): Promise<ComparisonResult> {
    const response = await apiRequest('GET', `/api/compare/${id}`);
    return response.json();
  },

  // Export
  async exportComparison(id: number): Promise<Blob> {
    const response = await apiRequest('GET', `/api/compare/${id}/export`);
    return response.blob();
  },

  // Share functionality
  async shareComparison(id: number, platform: string): Promise<string> {
    const comparison = await this.getComparison(id);
    const shareUrl = `${window.location.origin}/comparison/${id}`;
    const shareText = `Check out this Wikipedia comparison: "${comparison.articleTitle}" across ${comparison.selectedLanguages.length} languages. ${shareUrl}`;
    
    // Copy to clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
    }
    
    return shareText;
  }
};
