import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ComparisonRequest {
  articles: Record<string, string>; // language code -> article content
  outputLanguage: string;
  isFunnyMode?: boolean;
}

export class OpenAIService {
  async compareArticles(request: ComparisonRequest): Promise<string> {
    const { articles, outputLanguage, isFunnyMode = false } = request;
    
    // Log the articles being compared for debugging
    console.log('Articles being compared:', Object.keys(articles));
    console.log('Article lengths:', Object.entries(articles).map(([lang, content]) => 
      `${lang}: ${content.length} characters`
    ));
    
    const articleData = JSON.stringify(articles, null, 2);
    
    const systemPrompt = isFunnyMode 
      ? this.getFunnyModeSystemPrompt(outputLanguage)
      : this.getStandardSystemPrompt(outputLanguage);
    
    const userPrompt = `Please analyze and compare these Wikipedia articles about the same topic across different languages:

${articleData}

Please provide a comprehensive comparison focusing on:
1. Factual differences and variations in information
2. Cultural perspectives and framing differences
3. Narrative emphasis and tone variations
4. Structural and organizational differences
5. Missing or additional information in each version

${isFunnyMode 
  ? 'Make this comparison humorous, sarcastic, and entertaining while still being informative. Point out absurd differences and cultural quirks in a witty way.'
  : 'Provide a scholarly, detailed analysis that would be suitable for academic or research purposes.'
}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: isFunnyMode ? 0.8 : 0.3,
      });

      return response.choices[0].message.content || "No comparison generated";
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate article comparison');
    }
  }

  private getStandardSystemPrompt(outputLanguage: string): string {
    return `You are an expert comparative linguist and cultural analyst specializing in Wikipedia content analysis. Your task is to provide detailed, scholarly comparisons of the same Wikipedia article across different languages.

Your analysis should be:
- Objective and academically rigorous
- Focused on factual differences, cultural perspectives, and narrative variations
- Well-structured with clear sections
- Written in ${outputLanguage}
- Comprehensive and detailed

Identify specific examples where different language versions:
- Present different facts or emphasis
- Reflect cultural biases or perspectives  
- Use different organizational structures
- Include or exclude certain information
- Frame topics differently

Provide specific quotes and examples to support your analysis.`;
  }

  private getFunnyModeSystemPrompt(outputLanguage: string): string {
    return `You are a witty, sarcastic cultural commentator with a PhD in "Wikipedia Weirdness Studies." Your job is to hilariously roast the differences between Wikipedia articles across languages while still being informative.

Your tone should be:
- Sarcastic and humorous but not mean-spirited
- Entertaining and engaging
- Written in ${outputLanguage}
- Like a comedy writer who happens to be really smart about cultural differences

Point out:
- Absurd cultural biases in a funny way
- Ridiculous differences in what each culture considers important
- Hilarious omissions or additions
- Cultural stereotypes reflected in the content
- Funny ways different cultures frame the same facts

Use humor, pop culture references, and witty observations while still providing genuine insights into cultural differences.`;
  }
}

export const openaiService = new OpenAIService();
