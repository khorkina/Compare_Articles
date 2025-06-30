import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { wikipediaService } from "./services/wikipedia";
import { openaiService } from "./services/openai";
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

  // Compare articles
  app.post("/api/compare", async (req, res) => {
    try {
      const { 
        articleTitle, 
        selectedLanguages, 
        outputLanguage, 
        baseLanguage = 'en',
        isFunnyMode = false 
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

      // Prepare articles for OpenAI
      const articleData: Record<string, string> = {};
      articles.forEach(article => {
        articleData[article.language] = article.content;
      });

      // Generate comparison using OpenAI
      const comparisonResult = await openaiService.compareArticles({
        articles: articleData,
        outputLanguage,
        isFunnyMode
      });

      // Save comparison to storage
      const comparisonData = insertComparisonSchema.parse({
        articleTitle,
        selectedLanguages,
        outputLanguage,
        comparisonResult,
        isFunnyMode
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
      res.setHeader('Content-Disposition', `attachment; filename="wiki-truth-${comparison.articleTitle}-comparison.docx"`);
      res.send(docxBuffer);
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ error: "Failed to export comparison" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
