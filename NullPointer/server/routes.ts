import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, updateProjectSchema } from "@shared/schema";
import { googleAIService } from "./services/googleai";
import { websiteGenerator } from "./services/websiteGenerator";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Create a new project
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update project
  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const validatedData = updateProjectSchema.parse(req.body);
      const project = await storage.updateProject(req.params.id, validatedData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Generate content for a project
  app.post("/api/projects/:id/generate-content", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Update status to generating
      await storage.updateProject(req.params.id, { status: "generating" });

      // Generate content using Google AI
      const generatedContent = await googleAIService.generateWebsiteContent(project);
      
      // Update project with generated content
      const updatedProject = await storage.updateProject(req.params.id, {
        generatedContent,
        status: "content_generated"
      });

      res.json(updatedProject);
    } catch (error: any) {
      // Reset status on error
      await storage.updateProject(req.params.id, { status: "pending" });
      res.status(500).json({ message: `Content generation failed: ${error.message}` });
    }
  });

  // Generate images for a project
  app.post("/api/projects/:id/generate-images", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Generate images using Google AI
      const generatedImages = await googleAIService.generateImages(project);
      
      // Update project with generated images
      const updatedProject = await storage.updateProject(req.params.id, {
        generatedImages,
        status: "images_generated"
      });

      res.json(updatedProject);
    } catch (error: any) {
      res.status(500).json({ message: `Image generation failed: ${error.message}` });
    }
  });

  // Generate complete website
  app.post("/api/projects/:id/generate-website", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Generate website HTML
      const websiteHtml = websiteGenerator.generateWebsiteHtml(project);
      
      // Update project with generated website
      const updatedProject = await storage.updateProject(req.params.id, {
        websiteHtml,
        status: "completed"
      });

      res.json(updatedProject);
    } catch (error: any) {
      res.status(500).json({ message: `Website generation failed: ${error.message}` });
    }
  });

  // Publish website
  app.post("/api/projects/:id/publish", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (!project.websiteHtml) {
        return res.status(400).json({ message: "Website not generated yet" });
      }

      // Update project status to published
      const updatedProject = await storage.updateProject(req.params.id, {
        status: "published"
      });

      // In a real implementation, you would deploy the website to a hosting service
      // For now, we'll just return success
      res.json({ 
        ...updatedProject,
        publishedUrl: `https://generated-site-${req.params.id}.example.com`
      });
    } catch (error: any) {
      res.status(500).json({ message: `Publishing failed: ${error.message}` });
    }
  });

  // Get all projects (for listing)
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getUserProjects("default-user"); // In real app, get from auth
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
