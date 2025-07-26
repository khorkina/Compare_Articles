import axios from 'axios';
import { WikipediaSearchResult, WikipediaLanguageLink, WikipediaArticle } from '@shared/schema';

export class WikipediaService {
  private baseUrl = 'https://en.wikipedia.org/api/rest_v1';
  private apiUrl = 'https://en.wikipedia.org/w/api.php';

  async searchArticles(query: string, language: string = 'en', limit: number = 10): Promise<WikipediaSearchResult[]> {
    try {
      // Enhanced search with better parameters and filtering
      const response = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
        params: {
          action: 'query',
          list: 'search',
          srsearch: query,
          srlimit: Math.min(limit * 2, 20), // Get more results to filter
          srnamespace: 0, // Main namespace only
          format: 'json',
          srinfo: 'snippet|totalhits|suggestion',
          srprop: 'snippet|size|wordcount|timestamp|categorysnippet',
          srsort: 'relevance',
          srqiprofile: 'engine_autoselect' // Use best search profile
        },
        timeout: 4000,
        headers: {
          'User-Agent': 'WikiTruth/1.0 (https://wikitruth.app)'
        }
      });

      const searchResults = response.data.query?.search || [];
      
      // Filter and score results for better quality
      const filteredResults = searchResults
        .filter((result: any) => {
          // Filter out low-quality results
          if (!result.title || result.title.length < 2) return false;
          if (result.size < 1000) return false; // Skip very short articles
          if (result.wordcount < 100) return false; // Skip stub articles
          
          // Filter out common disambiguation and maintenance pages
          const title = result.title.toLowerCase();
          if (title.includes('disambiguation') || 
              title.includes('(disambiguation)') ||
              title.includes('category:') ||
              title.includes('template:') ||
              title.includes('user:') ||
              title.includes('talk:') ||
              title.includes('file:') ||
              title.includes('wikipedia:')) {
            return false;
          }
          
          return true;
        })
        .map((result: any) => {
          // Calculate relevance score
          let score = 0;
          const title = result.title.toLowerCase();
          const queryLower = query.toLowerCase();
          
          // Exact title match gets highest score
          if (title === queryLower) score += 100;
          // Title starts with query gets high score
          else if (title.startsWith(queryLower)) score += 80;
          // Title contains query gets medium score
          else if (title.includes(queryLower)) score += 60;
          
          // Boost score for longer, more comprehensive articles
          if (result.wordcount > 1000) score += 20;
          if (result.wordcount > 5000) score += 10;
          
          // Boost recent articles slightly
          if (result.timestamp) {
            const articleDate = new Date(result.timestamp);
            const now = new Date();
            const monthsOld = (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
            if (monthsOld < 12) score += 5; // Recent updates
          }
          
          return {
            title: result.title,
            snippet: this.cleanSnippet(result.snippet || ''),
            pageid: result.pageid,
            score: score,
            wordcount: result.wordcount,
            size: result.size
          };
        })
        .sort((a, b) => b.score - a.score) // Sort by relevance score
        .slice(0, limit) // Take only requested amount
        .map(({ score, wordcount, size, ...result }) => result); // Remove scoring fields
      
      return filteredResults;
    } catch (error) {
      console.error('Wikipedia search error:', error);
      // Enhanced fallback with better suggestion handling
      try {
        const fallbackResponse = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
          params: {
            action: 'opensearch',
            search: query,
            limit: Math.min(limit * 2, 15),
            namespace: 0,
            format: 'json',
            suggest: true,
            redirects: 'resolve'
          },
          timeout: 3000,
          headers: {
            'User-Agent': 'WikiTruth/1.0 (https://wikitruth.app)'
          }
        });

        const [, titles, snippets, urls] = fallbackResponse.data;
        
        return titles
          .map((title: string, index: number) => ({
            title,
            snippet: this.cleanSnippet(snippets[index] || ''),
            pageid: index + 1000000,
            url: urls[index]
          }))
          .filter((result: any) => {
            // Apply same quality filters for fallback
            const title = result.title.toLowerCase();
            return !title.includes('disambiguation') && 
                   !title.includes('category:') &&
                   !title.includes('template:') &&
                   result.title.length > 2;
          })
          .slice(0, limit);
      } catch (fallbackError) {
        console.error('Wikipedia fallback search error:', fallbackError);
        throw new Error('Failed to search Wikipedia articles');
      }
    }
  }

  async getLanguageLinks(title: string, language: string = 'en'): Promise<WikipediaLanguageLink[]> {
    try {
      const response = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
        params: {
          action: 'query',
          titles: title,
          prop: 'langlinks',
          lllimit: 500,
          format: 'json'
        },
        timeout: 4000, // Faster language links
        headers: {
          'User-Agent': 'WikiTruth/1.0 (https://wikitruth.app)'
        }
      });

      const pages = response.data.query.pages;
      const page = Object.values(pages)[0] as any;
      
      if (!page.langlinks) {
        return [];
      }

      return page.langlinks.map((link: any) => ({
        lang: link.lang,
        title: link['*'],
        url: `https://${link.lang}.wikipedia.org/wiki/${encodeURIComponent(link['*'])}`
      }));
    } catch (error) {
      console.error('Wikipedia language links error:', error);
      throw new Error('Failed to fetch language links');
    }
  }

  async getArticleContent(title: string, language: string = 'en'): Promise<WikipediaArticle> {
    try {
      const response = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
        params: {
          action: 'query',
          titles: title,
          prop: 'extracts|pageids',
          exintro: false,
          explaintext: true,
          exsectionformat: 'plain',
          format: 'json'
        },
        timeout: 15000
      });

      const pages = response.data.query.pages;
      const page = Object.values(pages)[0] as any;
      
      if (page.missing) {
        throw new Error(`Article "${title}" not found in ${language} Wikipedia`);
      }

      const content = page.extract || '';
      return {
        pageid: page.pageid,
        title: page.title,
        content: content,
        language,
        contentLength: content.length
      };
    } catch (error) {
      console.error('Wikipedia content error:', error);
      throw new Error(`Failed to fetch article content for "${title}" in ${language}`);
    }
  }

  async getMultipleArticleContents(title: string, languages: string[], baseLanguage: string = 'en'): Promise<WikipediaArticle[]> {
    try {
      // First get language links to find the correct titles for each language
      const languageLinks = await this.getLanguageLinks(title, baseLanguage);
      
      // Create a map of language to title
      const languageTitleMap: Record<string, string> = {
        [baseLanguage]: title // Include the base article
      };
      
      languageLinks.forEach(link => {
        languageTitleMap[link.lang] = link.title;
      });

      // Fetch articles for the requested languages
      const promises = languages.map(async (lang) => {
        const articleTitle = languageTitleMap[lang];
        if (!articleTitle) {
          console.warn(`No title found for language ${lang}`);
          return null;
        }
        
        try {
          return await this.getArticleContent(articleTitle, lang);
        } catch (error) {
          console.warn(`Failed to fetch article for ${lang}:`, error);
          return null;
        }
      });
      
      const results = await Promise.allSettled(promises);
      
      return results
        .filter((result): result is PromiseFulfilledResult<WikipediaArticle> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);
    } catch (error) {
      console.error('Multiple articles fetch error:', error);
      throw new Error('Failed to fetch multiple article contents');
    }
  }

  // Helper method to clean and improve snippet display
  private cleanSnippet(snippet: string): string {
    if (!snippet) return '';
    
    // Remove HTML tags but preserve structure
    let cleaned = snippet
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&quot;/g, '"') // Replace HTML entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .trim();
    
    // Ensure snippet ends properly
    if (cleaned.length > 150) {
      cleaned = cleaned.substring(0, 147) + '...';
    }
    
    // Remove incomplete sentences at the end
    const lastPeriod = cleaned.lastIndexOf('.');
    const lastExclamation = cleaned.lastIndexOf('!');
    const lastQuestion = cleaned.lastIndexOf('?');
    const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
    
    if (lastSentenceEnd > 50 && lastSentenceEnd < cleaned.length - 10) {
      cleaned = cleaned.substring(0, lastSentenceEnd + 1);
    }
    
    return cleaned;
  }
}

export const wikipediaService = new WikipediaService();
