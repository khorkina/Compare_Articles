import { clientStorage } from './storage';
import { wikipediaClient, type WikipediaSearchResult, type WikipediaLanguageLink } from './wikipedia-client';
import { simpleWikipedia } from './wikipedia-simple';
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
  isPremium?: boolean;
  languageTitles: Record<string, string>; // language -> article title
}

export interface ComparisonResult {
  id: string;
  articleTitle: string;
  selectedLanguages: string[];
  outputLanguage: string;
  comparisonResult: string;
  isFunnyMode: boolean;
  isPremium: boolean;
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
      
      // Test Wikipedia connection first
      const connectionOk = await simpleWikipedia.testConnection();
      if (!connectionOk) {
        throw new Error('Cannot connect to Wikipedia API');
      }

      // Fetch articles using simple client
      const articles = [];
      console.log('Fetching articles for languages:', comparisonData.languageTitles);
      
      for (const [language, title] of Object.entries(comparisonData.languageTitles)) {
        try {
          const article = await simpleWikipedia.fetchArticle(title, language);
          articles.push(article);
          console.log(`✓ Fetched ${language}: ${article.title} (${article.contentLength} chars)`);
        } catch (error) {
          console.error(`✗ Failed to fetch ${language}: ${title}`, error);
        }
      }

      if (articles.length < 1) {
        throw new Error(`No articles could be fetched. Please verify the article exists and try again.`);
      }
      
      console.log(`Successfully fetched ${articles.length} articles for comparison`);

      // Prepare content for OpenAI
      const articleContents: Record<string, string> = {};
      articles.forEach((article: any) => {
        articleContents[article.language] = article.content;
      });

      console.log('Sending to OpenAI for comparison...');
      console.log('Article content lengths:', Object.entries(articleContents).map(([lang, content]) => `${lang}: ${content.length} chars`));
      
      // Get AI comparison
      let comparisonResult;
      try {
        comparisonResult = await openaiClient.compareArticles({
          articles: articleContents,
          outputLanguage: comparisonData.outputLanguage,
          isFunnyMode: comparisonData.isFunnyMode
        });
        console.log('OpenAI comparison result length:', comparisonResult.length);
      } catch (openaiError) {
        console.error('OpenAI comparison failed:', openaiError);
        throw new Error(`AI comparison failed: ${openaiError instanceof Error ? openaiError.message : 'Unknown error'}`);
      }

      console.log('OpenAI comparison completed, saving to local storage...');

      // Save comparison to local storage
      const comparison = await clientStorage.saveComparison({
        articleTitle: comparisonData.articleTitle,
        selectedLanguages: comparisonData.selectedLanguages,
        outputLanguage: comparisonData.outputLanguage,
        baseLanguage: comparisonData.baseLanguage || comparisonData.selectedLanguages[0],
        comparisonResult,
        isFunnyMode: comparisonData.isFunnyMode || false,
        isPremium: comparisonData.isPremium || false,
        articles
      });

      console.log('Comparison saved successfully:', comparison.id);
      return comparison;
    } catch (error) {
      console.error('Compare articles error:', error);
      
      // Provide more specific error information
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('OpenAI API key issue: ' + error.message + '. Please check your API key in Settings.');
        } else if (error.message.includes('Wikipedia')) {
          throw new Error('Wikipedia data error: ' + error.message + '. Please try a different article.');
        } else {
          throw new Error('Comparison failed: ' + error.message);
        }
      } else {
        throw new Error('Comparison failed: Unknown error occurred');
      }
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
      const shareUrl = `${baseUrl}/results/${id}`;
      
      // Create full comparison text for clipboard
      const fullComparisonText = `
Wiki Truth Comparison: "${comparison.articleTitle}"
${comparison.selectedLanguages.map(lang => `• ${lang.toUpperCase()}`).join('\n')}
Generated: ${new Date(comparison.createdAt).toLocaleDateString()}

${comparison.comparisonResult}

View full comparison: ${shareUrl}
      `.trim();

      // Copy full text to clipboard
      await navigator.clipboard.writeText(fullComparisonText);

      const platformMessages: Record<string, string> = {
        twitter: `Check out this fascinating comparison of "${comparison.articleTitle}" across ${comparison.selectedLanguages.length} languages! 🌍 #WikiTruth #Wikipedia`,
        linkedin: `Interesting cultural perspectives on "${comparison.articleTitle}" revealed through multi-language Wikipedia analysis.`,
        whatsapp: `Found some interesting differences in how "${comparison.articleTitle}" is presented across different Wikipedia languages!`,
        telegram: `Multi-language Wikipedia comparison: "${comparison.articleTitle}" - revealing cultural perspectives and narrative differences`,
        reddit: `Cultural differences in "${comparison.articleTitle}" across ${comparison.selectedLanguages.length} Wikipedia languages`
      };

      const message = platformMessages[platform] || `Check out this Wikipedia comparison: "${comparison.articleTitle}"`;
      
      // Create platform-specific share URLs (but we've already copied text to clipboard)
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