export interface WikipediaSearchResult {
  title: string;
  snippet: string;
  pageid: number;
}

export interface WikipediaLanguageLink {
  lang: string;
  title: string;
  url: string;
}

export interface WikipediaArticle {
  title: string;
  content: string;
  language: string;
  contentLength: number;
}

class WikipediaClient {
  private getCorsProxyUrl(url: string): string {
    // Use a CORS proxy to bypass browser CORS restrictions
    return `https://corsproxy.io/?${encodeURIComponent(url)}`;
  }

  private getApiUrl(language: string): string {
    return `https://${language}.wikipedia.org/w/api.php`;
  }

  async searchArticles(query: string, language: string = 'en', limit: number = 10): Promise<WikipediaSearchResult[]> {
    try {
      const apiUrl = this.getApiUrl(language);
      const params = new URLSearchParams({
        action: 'opensearch',
        search: query,
        limit: limit.toString(),
        namespace: '0',
        format: 'json',
        origin: '*'
      });

      const url = `${apiUrl}?${params}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Wikipedia API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data) || data.length < 4) {
        return [];
      }

      const [, titles, snippets, urls] = data;
      
      return titles.map((title: string, index: number) => ({
        title,
        snippet: snippets[index] || '',
        pageid: index + 1
      }));
    } catch (error) {
      console.error('Wikipedia search error:', error);
      return [];
    }
  }

  async getLanguageLinks(title: string, language: string = 'en'): Promise<WikipediaLanguageLink[]> {
    try {
      const apiUrl = this.getApiUrl(language);
      const params = new URLSearchParams({
        action: 'query',
        titles: title,
        prop: 'langlinks',
        lllimit: '500',
        format: 'json',
        origin: '*'
      });

      const url = `${apiUrl}?${params}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Wikipedia API error: ${response.status}`);
      }

      const data = await response.json();
      const pages = data.query?.pages;
      
      if (!pages) return [];

      const pageId = Object.keys(pages)[0];
      const langlinks = pages[pageId]?.langlinks || [];

      const languageLinks = langlinks.map((link: any) => ({
        lang: link.lang,
        title: link['*'],
        url: `https://${link.lang}.wikipedia.org/wiki/${encodeURIComponent(link['*'])}`
      }));

      // Add the current language version
      languageLinks.unshift({
        lang: language,
        title: title,
        url: `https://${language}.wikipedia.org/wiki/${encodeURIComponent(title)}`
      });

      return languageLinks;
    } catch (error) {
      console.error('Wikipedia language links error:', error);
      return [];
    }
  }

  async getArticleContent(title: string, language: string = 'en'): Promise<WikipediaArticle> {
    try {
      const apiUrl = this.getApiUrl(language);
      const params = new URLSearchParams({
        action: 'query',
        titles: title,
        prop: 'extracts',
        exintro: 'false',
        explaintext: 'true',
        exsectionformat: 'plain',
        format: 'json',
        origin: '*'
      });

      const url = `${apiUrl}?${params}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Wikipedia API error: ${response.status}`);
      }

      const data = await response.json();
      const pages = data.query?.pages;
      
      if (!pages) {
        throw new Error('No page data found');
      }

      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];
      
      if (pageId === '-1' || !page.extract) {
        throw new Error('Article not found');
      }

      const content = page.extract;
      
      return {
        title: page.title,
        content,
        language,
        contentLength: content.length
      };
    } catch (error) {
      console.error(`Wikipedia content error for ${language}:${title}:`, error);
      throw error;
    }
  }

  async getMultipleArticleContents(
    articlesByLanguage: Record<string, string>, // language -> title
    baseLanguage: string = 'en'
  ): Promise<WikipediaArticle[]> {
    const articles: WikipediaArticle[] = [];
    
    for (const [language, title] of Object.entries(articlesByLanguage)) {
      try {
        const article = await this.getArticleContent(title, language);
        articles.push(article);
      } catch (error) {
        console.error(`Failed to fetch ${language} article:`, error);
        // Continue with other languages even if one fails
      }
    }
    
    return articles;
  }
}

export const wikipediaClient = new WikipediaClient();