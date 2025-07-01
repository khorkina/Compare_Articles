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
    
    // Check subscription status first
    const isValidSubscription = await clientStorage.isSubscriptionValid();
    if (!isValidSubscription) {
      throw new Error('Premium subscription required. Please subscribe to use comparison features.');
    }
    
    // Use environment API key for premium users (our server key)
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    console.log('Environment API key:', envApiKey ? 'Found' : 'Not found');
    if (envApiKey && envApiKey.trim()) {
      return envApiKey.trim();
    }

    throw new Error('Service temporarily unavailable. Please try again later.');
  }

  async compareArticles(request: ComparisonRequest): Promise<string> {
    try {
      console.log('Starting OpenAI comparison with server API key...');
      
      // Check subscription status first
      const isValidSubscription = await clientStorage.isSubscriptionValid();
      if (!isValidSubscription) {
        throw new Error('Premium subscription required. Please subscribe to use comparison features.');
      }
      
      console.log('Valid subscription found, making comparison request...');

      // Use the new server endpoint that uses server's OpenAI API key
      const response = await fetch('/api/openai/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
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
      
      return data.comparisonResult || 'No comparison generated';
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