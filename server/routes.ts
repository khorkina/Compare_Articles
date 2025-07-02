import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { wikipediaService } from "./services/wikipedia";
import { openaiService } from "./services/openai";
import { openRouterService } from "./services/openrouter";
import { exportService } from "./services/export";
import { insertComparisonSchema, insertSearchSessionSchema } from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Wikipedia search endpoint
  app.get("/api/wikipedia/search", async (req, res) => {
    try {
      const { query, language = 'en', limit = 10 } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Query parameter is required" });
      }

      const results = await wikipediaService.searchArticles(
        query,
        language as string,
        Number(limit)
      );
      
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: "Failed to search articles" });
    }
  });

  // Get language links for an article
  app.get("/api/wikipedia/languages", async (req, res) => {
    try {
      const { title, language = 'en' } = req.query;
      
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: "Title parameter is required" });
      }

      const languageLinks = await wikipediaService.getLanguageLinks(
        title,
        language as string
      );
      
      res.json(languageLinks);
    } catch (error) {
      console.error('Language links error:', error);
      res.status(500).json({ error: "Failed to fetch language links" });
    }
  });

  // Create search session
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = {
        sessionId: nanoid(),
        searchQuery: null,
        selectedArticle: null,
        availableLanguages: null,
        ...req.body
      };

      const validatedData = insertSearchSessionSchema.parse(sessionData);
      const session = await storage.createSearchSession(validatedData);
      
      res.json(session);
    } catch (error) {
      console.error('Session creation error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid session data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  // Update search session
  app.patch("/api/sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const updates = req.body;

      const session = await storage.updateSearchSession(sessionId, updates);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      console.error('Session update error:', error);
      res.status(500).json({ error: "Failed to update session" });
    }
  });

  // Get search session
  app.get("/api/sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getSearchSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      console.error('Session fetch error:', error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // Compare articles with plan selection support
  app.post("/api/compare", async (req, res) => {
    try {
      const { 
        articleTitle, 
        selectedLanguages, 
        outputLanguage, 
        baseLanguage = 'en',
        isFunnyMode = false,
        isPremium = false
      } = req.body;

      if (!articleTitle || !selectedLanguages || !outputLanguage) {
        return res.status(400).json({ 
          error: "Missing required fields: articleTitle, selectedLanguages, outputLanguage" 
        });
      }

      if (selectedLanguages.length < 2 || selectedLanguages.length > 5) {
        return res.status(400).json({ 
          error: "Must select between 2 and 5 languages for comparison" 
        });
      }

      // Fetch article contents for all selected languages
      const articles = await wikipediaService.getMultipleArticleContents(
        articleTitle, 
        selectedLanguages,
        baseLanguage
      );

      if (articles.length < 2) {
        return res.status(400).json({ 
          error: "Could not fetch articles for at least 2 languages" 
        });
      }

      // Prepare articles for AI processing
      const articleData: Record<string, string> = {};
      articles.forEach(article => {
        articleData[article.language] = article.content;
      });

      // Generate comparison using selected plan
      let comparisonResult: string;
      if (isPremium) {
        console.log('Using premium AI service for enhanced analysis');
        comparisonResult = await openaiService.compareArticles({
          articles: articleData,
          outputLanguage,
          isFunnyMode
        });
      } else {
        console.log('Using free AI service for standard analysis');
        comparisonResult = await openRouterService.compareArticles({
          articles: articleData,
          outputLanguage,
          isFunnyMode
        });
      }

      // Save comparison to storage
      const comparisonData = insertComparisonSchema.parse({
        articleTitle,
        selectedLanguages,
        outputLanguage,
        comparisonResult,
        isFunnyMode,
        isPremium
      });

      const savedComparison = await storage.createComparison(comparisonData);
      
      res.json({
        ...savedComparison,
        articles: articles.map(a => ({ 
          language: a.language, 
          title: a.title,
          contentLength: a.content.length 
        }))
      });
    } catch (error) {
      console.error('Comparison error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid comparison data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to generate comparison" });
    }
  });

  // OpenRouter comparison endpoint - Free for all users
  app.post("/api/openrouter/compare", async (req, res) => {
    try {
      const { articles, outputLanguage, isFunnyMode = false } = req.body;
      
      if (!articles || typeof articles !== 'object') {
        return res.status(400).json({ error: "Articles data is required" });
      }
      
      if (!outputLanguage) {
        return res.status(400).json({ error: "Output language is required" });
      }

      // Generate comparison using OpenRouter API - completely free
      const comparisonResult = await openRouterService.compareArticles({
        articles,
        outputLanguage,
        isFunnyMode
      });

      res.json({ comparisonResult });
    } catch (error) {
      console.error('OpenRouter comparison error:', error);
      res.status(500).json({ error: "Failed to generate comparison using OpenRouter" });
    }
  });

  // Legacy OpenAI endpoint for premium users (deprecated - keeping for compatibility)
  app.post("/api/openai/compare", async (req, res) => {
    try {
      const { articles, outputLanguage, isFunnyMode = false } = req.body;
      
      if (!articles || typeof articles !== 'object') {
        return res.status(400).json({ error: "Articles data is required" });
      }
      
      if (!outputLanguage) {
        return res.status(400).json({ error: "Output language is required" });
      }

      // Generate comparison using server's OpenAI API key
      const comparisonResult = await openaiService.compareArticles({
        articles,
        outputLanguage,
        isFunnyMode
      });

      res.json({ comparisonResult });
    } catch (error) {
      console.error('OpenAI comparison error:', error);
      res.status(500).json({ error: "Failed to generate comparison using OpenAI" });
    }
  });

  // Payment session creation endpoint (Smart Glocal integration)
  app.post("/api/payments/create-session", async (req, res) => {
    try {
      const { amount, currency, orderId, customerId, description, returnUrl } = req.body;
      
      if (!amount || !currency || !orderId || !customerId) {
        return res.status(400).json({ error: "Missing required payment parameters" });
      }

      // For now, return demo payment URL since we need proper Smart Glocal credentials
      // In production, this would create a real Smart Glocal session
      const demoPaymentUrl = `${returnUrl}?demo=true&order_id=${orderId}&amount=${amount}`;
      
      res.json({ 
        paymentUrl: demoPaymentUrl,
        sessionId: `demo_session_${orderId}`,
        message: "Demo payment session created. In production, this would create a real Smart Glocal payment session."
      });
    } catch (error) {
      console.error('Payment session creation error:', error);
      res.status(500).json({ error: "Failed to create payment session" });
    }
  });

  // Get comparison by ID
  app.get("/api/compare/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const comparison = await storage.getComparison(Number(id));
      
      if (!comparison) {
        return res.status(404).json({ error: "Comparison not found" });
      }
      
      res.json(comparison);
    } catch (error) {
      console.error('Comparison fetch error:', error);
      res.status(500).json({ error: "Failed to fetch comparison" });
    }
  });

  // Export comparison as DOCX
  app.get("/api/compare/:id/export", async (req, res) => {
    try {
      const { id } = req.params;
      const comparison = await storage.getComparison(Number(id));
      
      if (!comparison) {
        return res.status(404).json({ error: "Comparison not found" });
      }

      const docxBuffer = await exportService.generateDocx({
        articleTitle: comparison.articleTitle,
        languages: comparison.selectedLanguages as string[],
        outputLanguage: comparison.outputLanguage,
        content: comparison.comparisonResult || "No comparison available",
        isFunnyMode: comparison.isFunnyMode || false
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="wiki-truth-comparison.docx"');
      res.send(docxBuffer);
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ error: "Failed to export comparison" });
    }
  });

  // Share comparison endpoint
  app.get("/api/compare/:id/share", async (req, res) => {
    try {
      const { id } = req.params;
      const { platform } = req.query;
      const comparison = await storage.getComparison(Number(id));
      
      if (!comparison) {
        return res.status(404).json({ error: "Comparison not found" });
      }

      const shareUrl = `${req.protocol}://${req.get('host')}/comparison/${id}`;
      const selectedLangs = comparison.selectedLanguages as string[];
      const languageList = selectedLangs.join(', ');
      
      let shareText = '';
      
      switch (platform) {
        case 'twitter':
        case 'x':
          shareText = `Fascinating Wikipedia comparison: "${comparison.articleTitle}" across ${selectedLangs.length} languages reveals cultural differences! ${shareUrl} #WikiTruth #Wikipedia`;
          break;
        case 'linkedin':
          shareText = `I just compared the Wikipedia article "${comparison.articleTitle}" across ${selectedLangs.length} languages (${languageList}). The AI analysis reveals interesting cultural perspectives and factual variations. Check it out: ${shareUrl}`;
          break;
        case 'whatsapp':
        case 'telegram':
          shareText = `Check out this interesting Wikipedia comparison: "${comparison.articleTitle}" across ${selectedLangs.length} languages. The differences are quite revealing! ${shareUrl}`;
          break;
        case 'reddit':
          shareText = `TIL: The Wikipedia article for "${comparison.articleTitle}" varies significantly across ${selectedLangs.length} languages. Here's an AI analysis of the differences: ${shareUrl}`;
          break;
        default:
          shareText = `Wikipedia Comparison: "${comparison.articleTitle}" across ${selectedLangs.length} languages (${languageList}). See the cultural differences and perspectives: ${shareUrl}`;
      }

      res.json({ 
        shareText, 
        shareUrl,
        title: comparison.articleTitle,
        languages: selectedLangs.length
      });
    } catch (error) {
      console.error('Share error:', error);
      res.status(500).json({ error: "Failed to generate share content" });
    }
  });

  // OpenAI API proxy endpoints for CORS bypass
  app.post('/api/openai/chat/completions', async (req, res) => {
    try {
      const { apiKey, ...requestBody } = req.body;
      
      if (!apiKey) {
        return res.status(400).json({ error: 'API key is required' });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error('OpenAI proxy error:', error);
      res.status(500).json({ error: 'Failed to process OpenAI request' });
    }
  });

  // OpenAI models endpoint proxy
  app.get('/api/openai/models', async (req, res) => {
    try {
      const apiKey = req.headers.authorization?.replace('Bearer ', '');
      
      if (!apiKey) {
        return res.status(400).json({ error: 'Authorization header with API key is required' });
      }

      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error('OpenAI models proxy error:', error);
      res.status(500).json({ error: 'Failed to fetch models' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
