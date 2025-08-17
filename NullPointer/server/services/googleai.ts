import { GoogleGenerativeAI } from "@google/generative-ai";
import { Project } from "@shared/schema";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export class GoogleAIService {
  async generateWebsiteContent(project: Project): Promise<{
    headline: string;
    about: string;
    services: Array<{name: string; description: string}>;
    metaTitle: string;
    metaDescription: string;
  }> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

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

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format from Google AI");
      }

      const content = JSON.parse(jsonMatch[0]);
      
      return {
        headline: content.headline || `Welcome to ${project.businessName}`,
        about: content.about || `${project.businessName} is a leading provider in the ${project.industry} industry.`,
        services: content.services || project.services.map(service => ({
          name: service,
          description: `Professional ${service} services tailored to your needs.`
        })),
        metaTitle: content.metaTitle || `${project.businessName} - ${project.industry}`,
        metaDescription: content.metaDescription || `Discover ${project.businessName} - your trusted partner for ${project.services.join(', ')} services.`
      };
    } catch (error) {
      console.error("Error generating content:", error);
      
      // Fallback content generation
      return {
        headline: `Welcome to ${project.businessName}`,
        about: `${project.businessName} is a professional ${project.industry} company dedicated to providing exceptional services to our clients. With years of experience and a commitment to excellence, we deliver results that exceed expectations. Our team is passionate about what we do and focused on helping you achieve your goals.`,
        services: project.services.map(service => ({
          name: service,
          description: `Professional ${service} services designed to meet your specific needs and deliver outstanding results.`
        })),
        metaTitle: `${project.businessName} - Professional ${project.industry} Services`,
        metaDescription: `Discover ${project.businessName} - your trusted partner for ${project.services.join(', ')} services. Quality results delivered with excellence.`
      };
    }
  }

  async generateImages(project: Project): Promise<string[]> {
    try {
      // Google AI doesn't have image generation capabilities like DALL-E
      // Return placeholder images or use a different service
      const placeholderImages = [
        `https://picsum.photos/400/300?random=1&text=${encodeURIComponent(project.businessName)}`,
        `https://picsum.photos/400/300?random=2&text=${encodeURIComponent(project.industry)}`,
        `https://picsum.photos/400/300?random=3&text=${encodeURIComponent(project.services[0] || 'Service')}`
      ];

      return placeholderImages;
    } catch (error) {
      console.error("Error generating images:", error);
      return [
        "https://picsum.photos/400/300?random=1",
        "https://picsum.photos/400/300?random=2",
        "https://picsum.photos/400/300?random=3"
      ];
    }
  }
}

export const googleAIService = new GoogleAIService();