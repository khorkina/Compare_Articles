import { clientStorage } from './storage';
import { wikipediaClient, type WikipediaSearchResult, type WikipediaLanguageLink } from './wikipedia-client';
import { openaiClient } from './openai-client';

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
  baseLanguage?: string;
  isFunnyMode?: boolean;
  languageTitles: Record<string, string>; // language -> article title
}

export interface ComparisonResult {
  id: string;
  articleTitle: string;
  selectedLanguages: string[];
  outputLanguage: string;
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
  searchQuery?: string;
  selectedArticle?: any;
  availableLanguages?: LanguageLink[];
  createdAt: string;
}

export const api = {
  async searchArticles(query: string, language: string = 'en', limit: number = 10): Promise<SearchResult[]> {
    try {
      const results = await wikipediaClient.searchArticles(query, language, limit);
      return results.map(result => ({
        title: result.title,
        snippet: result.snippet,
        pageid: result.pageid
      }));
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },

  async getLanguageLinks(title: string, language: string = 'en'): Promise<LanguageLink[]> {
    try {
      const links = await wikipediaClient.getLanguageLinks(title, language);
      return links.map(link => ({
        lang: link.lang,
        title: link.title,
        url: link.url
      }));
    } catch (error) {
      console.error('Language links error:', error);
      return [];
    }
  },

  async createSession(sessionData: Partial<SearchSession> = {}): Promise<SearchSession> {
    try {
      return await clientStorage.saveSession(sessionData);
    } catch (error) {
      console.error('Create session error:', error);
      throw error;
    }
  },

  async updateSession(sessionId: string, updates: Partial<SearchSession>): Promise<SearchSession> {
    try {
      const result = await clientStorage.updateSession(sessionId, updates);
      if (!result) {
        throw new Error('Session not found');
      }
      return result;
    } catch (error) {
      console.error('Update session error:', error);
      throw error;
    }
  },

  async getSession(sessionId: string): Promise<SearchSession> {
    try {
      const session = await clientStorage.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      throw error;
    }
  },

  async compareArticles(comparisonData: ComparisonRequest): Promise<ComparisonResult> {
    try {
      console.log('Starting comparison with data:', comparisonData);
      
      // Fetch article content for each language
      console.log('Fetching articles for languages:', comparisonData.languageTitles);
      const articles = await wikipediaClient.getMultipleArticleContents(
        comparisonData.languageTitles,
        comparisonData.baseLanguage
      );

      console.log('Fetched articles:', articles.length, articles.map(a => `${a.language}: ${a.title} (${a.contentLength} chars)`));

      if (articles.length < 1) {
        throw new Error(`No articles could be fetched. Please verify the article exists and try again.`);
      }
      
      if (articles.length < 2) {
        console.warn(`Only ${articles.length} article(s) fetched, proceeding with comparison`);
      }

      // Prepare content for OpenAI
      const articleContents: Record<string, string> = {};
      articles.forEach(article => {
        articleContents[article.language] = article.content;
      });

      // Get AI comparison
      const comparisonResult = await openaiClient.compareArticles({
        articles: articleContents,
        outputLanguage: comparisonData.outputLanguage,
        isFunnyMode: comparisonData.isFunnyMode
      });

      // Save comparison to local storage
      const comparison = await clientStorage.saveComparison({
        articleTitle: comparisonData.articleTitle,
        selectedLanguages: comparisonData.selectedLanguages,
        outputLanguage: comparisonData.outputLanguage,
        baseLanguage: comparisonData.baseLanguage || comparisonData.selectedLanguages[0],
        comparisonResult,
        isFunnyMode: comparisonData.isFunnyMode || false,
        articles
      });

      return comparison;
    } catch (error) {
      console.error('Compare articles error:', error);
      throw error;
    }
  },

  async getComparison(id: string): Promise<ComparisonResult> {
    try {
      const comparison = await clientStorage.getComparison(id);
      if (!comparison) {
        throw new Error('Comparison not found');
      }
      return comparison;
    } catch (error) {
      console.error('Get comparison error:', error);
      throw error;
    }
  },

  async getUserComparisons(): Promise<ComparisonResult[]> {
    try {
      return await clientStorage.getUserComparisons();
    } catch (error) {
      console.error('Get user comparisons error:', error);
      return [];
    }
  },

  async deleteComparison(id: string): Promise<void> {
    try {
      await clientStorage.deleteComparison(id);
    } catch (error) {
      console.error('Delete comparison error:', error);
      throw error;
    }
  },

  async exportComparison(id: string): Promise<Blob> {
    try {
      const comparison = await clientStorage.getComparison(id);
      if (!comparison) {
        throw new Error('Comparison not found');
      }

      // Create a simple text export since we can't generate DOCX in browser without additional libraries
      const exportContent = `
Wiki Truth Comparison Report
===========================

Article: ${comparison.articleTitle}
Languages Compared: ${comparison.selectedLanguages.join(', ')}
Output Language: ${comparison.outputLanguage}
Mode: ${comparison.isFunnyMode ? 'Funny Mode' : 'Standard Analysis'}
Created: ${new Date(comparison.createdAt).toLocaleString()}

COMPARISON RESULTS:
${comparison.comparisonResult}

ARTICLE DETAILS:
${comparison.articles.map((article: any) => `
${article.language.toUpperCase()} - ${article.title}
Content Length: ${article.contentLength} characters
---
${article.content.slice(0, 1000)}...
`).join('\n')}
`;

      return new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    } catch (error) {
      console.error('Export comparison error:', error);
      throw error;
    }
  },

  async shareComparison(id: string, platform: string): Promise<string> {
    try {
      const comparison = await clientStorage.getComparison(id);
      if (!comparison) {
        throw new Error('Comparison not found');
      }

      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/comparison/${id}`;
      
      const platformMessages: Record<string, string> = {
        twitter: `Check out this fascinating comparison of "${comparison.articleTitle}" across ${comparison.selectedLanguages.length} languages! 🌍 #WikiTruth #Wikipedia`,
        linkedin: `Interesting cultural perspectives on "${comparison.articleTitle}" revealed through multi-language Wikipedia analysis.`,
        whatsapp: `Found some interesting differences in how "${comparison.articleTitle}" is presented across different Wikipedia languages!`,
        telegram: `Multi-language Wikipedia comparison: "${comparison.articleTitle}" - revealing cultural perspectives and narrative differences`,
        reddit: `Cultural differences in "${comparison.articleTitle}" across ${comparison.selectedLanguages.length} Wikipedia languages`
      };

      const message = platformMessages[platform] || `Check out this Wikipedia comparison: "${comparison.articleTitle}"`;
      
      // Create platform-specific share URLs
      const shareUrls: Record<string, string> = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(message)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(message + ' ' + shareUrl)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`,
        reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(message)}`
      };

      return shareUrls[platform] || shareUrl;
    } catch (error) {
      console.error('Share comparison error:', error);
      throw error;
    }
  }
};