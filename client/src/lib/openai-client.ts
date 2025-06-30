import { clientStorage } from './storage';

export interface ComparisonRequest {
  articles: Record<string, string>; // language code -> article content
  outputLanguage: string;
  isFunnyMode?: boolean;
}

class OpenAIClient {
  private baseUrl = '/api/openai';

  async getApiKey(): Promise<string> {
    console.log('Retrieving OpenAI API key...');
    
    // Check if user has provided their own API key
    try {
      const userApiKey = await clientStorage.getOpenAIKey();
      console.log('User API key from storage:', userApiKey ? 'Found' : 'Not found');
      if (userApiKey && userApiKey.trim()) {
        return userApiKey.trim();
      }
    } catch (error) {
      console.error('Error getting API key from storage:', error);
    }

    // Fall back to environment variable (for server-provided key)
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    console.log('Environment API key:', envApiKey ? 'Found' : 'Not found');
    if (envApiKey && envApiKey.trim()) {
      return envApiKey.trim();
    }

    throw new Error('No OpenAI API key available. Please provide your API key in settings.');
  }

  async compareArticles(request: ComparisonRequest): Promise<string> {
    try {
      console.log('Starting OpenAI comparison...');
      const apiKey = await this.getApiKey();
      
      if (!apiKey) {
        throw new Error('No OpenAI API key available. Please add your API key in Settings.');
      }
      
      console.log('API key retrieved, preparing comparison...');
      
      const systemPrompt = request.isFunnyMode 
        ? this.getFunnyModeSystemPrompt(request.outputLanguage)
        : this.getStandardSystemPrompt(request.outputLanguage);

      // Prepare article content for comparison
      const articleSummary = Object.entries(request.articles)
        .map(([lang, content]) => `**${lang.toUpperCase()} VERSION:**\n${content.slice(0, 3000)}...`)
        .join('\n\n');

      const userPrompt = `Please compare these Wikipedia articles about the same topic across different languages:\n\n${articleSummary}`;

      console.log('Making OpenAI API request...');
      console.log('Articles being compared:', Object.keys(request.articles));
      
      const requestBody = {
        model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: request.isFunnyMode ? 0.8 : 0.3
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...requestBody,
          apiKey
        })
      });

      console.log('OpenAI API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: { message: errorText } };
        }
        
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || errorText}`);
      }

      const data = await response.json();
      console.log('OpenAI comparison completed successfully');
      
      return data.choices[0]?.message?.content || 'No comparison generated';
    } catch (error) {
      console.error('OpenAI comparison error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate comparison');
    }
  }

  private getStandardSystemPrompt(outputLanguage: string): string {
    return `You are an expert cultural and linguistic analyst specializing in Wikipedia content comparison. Your task is to analyze and compare Wikipedia articles about the same topic across different languages, focusing on cultural perspectives, factual differences, and narrative variations.

ANALYSIS FRAMEWORK:
1. **Factual Differences**: Identify any differences in dates, numbers, events, or verifiable facts
2. **Cultural Perspectives**: Highlight how different cultures frame or emphasize aspects of the topic
3. **Narrative Focus**: Note what each language version prioritizes or emphasizes
4. **Missing Information**: Point out significant content present in some versions but absent in others
5. **Bias Detection**: Identify potential cultural, political, or historical biases in presentation

OUTPUT REQUIREMENTS:
- Respond in ${outputLanguage}
- Use clear, academic language
- Organize findings into the 5 categories above
- Provide specific examples with language references
- Maintain objectivity while highlighting differences
- Include a summary of key insights

Be thorough but concise. Focus on meaningful differences that reveal cultural perspectives rather than minor stylistic variations.`;
  }

  private getFunnyModeSystemPrompt(outputLanguage: string): string {
    return `You are a witty cultural commentator with a humorous take on how different cultures present the same topics on Wikipedia. Your job is to find the amusing, ironic, or delightfully weird differences between Wikipedia articles in different languages.

COMEDIC ANALYSIS APPROACH:
1. **Cultural Quirks**: Find funny ways different cultures emphasize unexpected aspects
2. **National Pride Moments**: Spot where countries subtly (or not so subtly) make themselves look better
3. **Lost in Translation**: Highlight amusing differences in how concepts are explained
4. **Bureaucratic Humor**: Point out overly formal or unnecessarily detailed sections
5. **The Elephant in the Room**: Note what some versions awkwardly avoid mentioning

OUTPUT STYLE:
- Respond in ${outputLanguage}
- Use humor while remaining respectful
- Include funny observations and light commentary
- Use analogies and witty comparisons
- Keep it educational but entertaining
- Add emoji where appropriate 😄

Remember: We're laughing WITH cultural differences, not AT them. Keep it light, fun, and insightful while avoiding anything mean-spirited or offensive.`;
  }

  async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing OpenAI API key...');
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      console.log('API key test response:', response.status);
      return response.ok;
    } catch (error) {
      console.error('API key test failed:', error);
      return false;
    }
  }
}

export const openaiClient = new OpenAIClient();