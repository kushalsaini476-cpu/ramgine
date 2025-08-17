import OpenAI from "openai";
import { Project } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export class OpenAIService {
  async generateWebsiteContent(project: Project): Promise<{
    headline: string;
    about: string;
    services: Array<{name: string; description: string}>;
    metaTitle: string;
    metaDescription: string;
  }> {
    try {
      const prompt = `You are a professional website copywriter. Generate compelling website content for the following business:

Business Name: ${project.businessName}
Industry: ${project.industry}
Services: ${project.services.join(', ')}
Description: ${project.description || 'No additional description provided'}
Target Audience: ${project.targetAudience || 'General audience'}
Content Tone: ${project.contentTone || 'professional'}
Location: ${project.city ? `${project.city}, ${project.state}` : 'Not specified'}

Generate website content that includes:
1. A compelling headline that captures the business essence
2. An engaging "About Us" section (150-200 words)
3. Service descriptions for each listed service (50-75 words each)
4. SEO-optimized meta title (50-60 characters)
5. SEO-optimized meta description (150-160 characters)

The content should be ${project.contentTone || 'professional'} in tone and tailored to the ${project.industry} industry.
Respond with JSON in this exact format: {
  "headline": "string",
  "about": "string", 
  "services": [{"name": "string", "description": "string"}],
  "metaTitle": "string",
  "metaDescription": "string"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional website copywriter and SEO expert. Generate compelling, conversion-focused content that sounds natural and engaging. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content generated from OpenAI");
      }

      const parsedContent = JSON.parse(content);

      // Validate the response structure
      if (!parsedContent.headline || !parsedContent.about || !parsedContent.services || 
          !parsedContent.metaTitle || !parsedContent.metaDescription) {
        throw new Error("Generated content missing required fields");
      }

      return parsedContent;
    } catch (error: any) {
      console.error("OpenAI content generation error:", error);
      throw new Error(`Content generation failed: ${error.message}`);
    }
  }

  async generateWebsiteImages(project: Project): Promise<string[]> {
    try {
      const images: string[] = [];
      
      // Generate hero/main business image
      const heroPrompt = this.getImagePrompt(project, "hero");
      const heroImage = await this.generateSingleImage(heroPrompt);
      images.push(heroImage);

      // Generate service images (up to 3)
      const servicePrompts = project.services.slice(0, 3).map(service => 
        this.getImagePrompt(project, "service", service)
      );

      for (const prompt of servicePrompts) {
        try {
          const serviceImage = await this.generateSingleImage(prompt);
          images.push(serviceImage);
        } catch (error) {
          console.warn(`Failed to generate image for service: ${error}`);
          // Continue with other images even if one fails
        }
      }

      return images;
    } catch (error: any) {
      console.error("OpenAI image generation error:", error);
      throw new Error(`Image generation failed: ${error.message}`);
    }
  }

  private async generateSingleImage(prompt: string): Promise<string> {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned from DALL-E");
    }

    return imageUrl;
  }

  private getImagePrompt(project: Project, type: "hero" | "service", serviceName?: string): string {
    const baseStyle = "professional, clean, modern, high-quality commercial photography";
    const industryKeywords = this.getIndustryKeywords(project.industry);
    
    if (type === "hero") {
      return `${baseStyle}, ${industryKeywords}, ${project.industry.toLowerCase()} business environment, welcoming atmosphere, no text or logos, suitable for ${project.businessName} website header`;
    } else if (type === "service" && serviceName) {
      return `${baseStyle}, ${industryKeywords}, ${serviceName.toLowerCase()} service, ${project.industry.toLowerCase()} context, professional service delivery, no text or logos`;
    }
    
    return `${baseStyle}, ${industryKeywords}, generic business image, no text or logos`;
  }

  private getIndustryKeywords(industry: string): string {
    const keywords: Record<string, string> = {
      "Health & Wellness": "spa, wellness center, yoga studio, peaceful, serene, natural lighting, plants, calm colors",
      "Retail & E-commerce": "modern retail space, clean product displays, shopping, commercial space, bright lighting",
      "Professional Services": "modern office, business meeting, professional workspace, corporate environment, clean desk",
      "Food & Beverage": "restaurant interior, kitchen, food preparation, dining space, warm lighting, inviting atmosphere",
      "Creative & Arts": "creative studio, artistic workspace, gallery, creative tools, inspiring environment, natural light",
      "Education & Training": "classroom, learning environment, educational space, books, technology, bright and open",
      "Construction & Trade": "construction site, tools, building, renovation, professional tradespeople, safety equipment",
      "Technology": "modern office, computers, servers, tech workspace, innovation, digital environment"
    };

    return keywords[industry] || "professional business environment, modern workspace, clean and organized";
  }

  async analyzeBusinessForSEO(project: Project): Promise<string[]> {
    try {
      const prompt = `Generate 5-7 relevant SEO keywords for the following business:

Business: ${project.businessName}
Industry: ${project.industry}
Services: ${project.services.join(', ')}
Location: ${project.city ? `${project.city}, ${project.state}` : 'Not specified'}

Focus on local SEO if location is provided, and include both broad and specific keywords.
Respond with JSON: {"keywords": ["keyword1", "keyword2", ...]}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system", 
            content: "You are an SEO expert. Generate relevant, high-value keywords that businesses can realistically rank for."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 200
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No keywords generated");
      }

      const result = JSON.parse(content);
      return result.keywords || [];
    } catch (error: any) {
      console.error("SEO keyword generation error:", error);
      return [project.industry.toLowerCase(), project.businessName.toLowerCase()];
    }
  }
}

export const openaiService = new OpenAIService();
