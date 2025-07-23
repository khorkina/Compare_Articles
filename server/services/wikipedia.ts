import axios from 'axios';
import { WikipediaSearchResult, WikipediaLanguageLink, WikipediaArticle } from '@shared/schema';

export class WikipediaService {
  private baseUrl = 'https://en.wikipedia.org/api/rest_v1';
  private apiUrl = 'https://en.wikipedia.org/w/api.php';

  async searchArticles(query: string, language: string = 'en', limit: number = 10): Promise<WikipediaSearchResult[]> {
    try {
      // Use more robust search API that provides better results
      const response = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
        params: {
          action: 'query',
          list: 'search',
          srsearch: query,
          srlimit: limit,
          srnamespace: 0,
          format: 'json',
          srinfo: 'snippet|totalhits',
          srprop: 'snippet|size|wordcount|timestamp',
          srsort: 'relevance'
        },
        timeout: 8000
      });

      const searchResults = response.data.query?.search || [];
      
      return searchResults.map((result: any) => ({
        title: result.title,
        snippet: result.snippet || '',
        pageid: result.pageid
      }));
    } catch (error) {
      console.error('Wikipedia search error:', error);
      // Fallback to opensearch if query API fails
      try {
        const fallbackResponse = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
          params: {
            action: 'opensearch',
            search: query,
            limit,
            namespace: 0,
            format: 'json',
            suggest: true
          },
          timeout: 6000
        });

        const [, titles, snippets] = fallbackResponse.data;
        
        return titles.map((title: string, index: number) => ({
          title,
          snippet: snippets[index] || '',
          pageid: index + 1000000 // Use high number to avoid conflicts
        }));
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
        timeout: 10000
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
}

export const wikipediaService = new WikipediaService();
