# AI Website Builder

## Overview

This is an AI-powered website builder that creates complete, responsive websites from business information. The application uses a full-stack architecture with React frontend and Express backend, leveraging OpenAI for content generation and providing a streamlined multi-step workflow for website creation.

The core functionality allows users to:
- Select their industry type from predefined categories
- Input business details through a guided form
- Generate website content automatically using AI
- Preview and customize their website
- Export or publish the final result

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client uses a modern React setup with TypeScript, built with Vite for fast development. The UI is constructed with shadcn/ui components (Radix UI primitives with Tailwind CSS styling) following a "new-york" design system. State management is handled through TanStack Query for server state and React Hook Form for form management. Routing is implemented using Wouter for a lightweight routing solution.

The application follows a page-based architecture with distinct screens for each step:
- Home page with feature overview
- Industry selection and business form onboarding
- AI generation dashboard with real-time progress
- Customization interface for fine-tuning
- Preview and publishing interface

### Backend Architecture
The server uses Express.js with TypeScript in ESM format. The architecture follows a service-oriented pattern with clear separation of concerns:

- **Route handlers** manage HTTP endpoints and validation
- **Storage layer** provides data persistence abstraction (currently in-memory with interface for future database integration)
- **Service layer** handles business logic for AI content generation and website building
- **Middleware** for request logging, error handling, and JSON processing

The API follows RESTful conventions with endpoints for project CRUD operations and specialized generation endpoints.

### Data Storage Solutions
Currently implements an in-memory storage solution through the `MemStorage` class that implements the `IStorage` interface. The schema is defined using Drizzle ORM with PostgreSQL dialect, indicating preparation for database migration. The schema includes a comprehensive projects table with fields for business information, generated content, and website HTML.

Key entities:
- Projects with business details, AI-generated content, images, and final HTML
- Support for tracking generation status through workflow states
- JSON fields for flexible content storage (services, generated content, images)

### Authentication and Authorization
The current implementation does not include authentication mechanisms, suggesting this is either a prototype phase or authentication is planned for future implementation. The session infrastructure (connect-pg-simple) is present in dependencies but not actively used.

### AI Content Generation
Google AI integration through the `GoogleAIService` class provides:
- Website content generation (headlines, about sections, service descriptions)
- SEO optimization (meta titles and descriptions)
- Tone and industry-specific customization
- Structured JSON responses for consistent data handling

The system uses Gemini 1.5 Pro model for content generation with carefully crafted prompts that incorporate business context, industry specifics, and content tone preferences.

### Website Generation
The `WebsiteGenerator` service creates complete HTML websites with:
- Responsive design using Tailwind CSS
- Dynamic color scheme application
- Professional layout with header, hero section, and content areas
- Mobile-first responsive design
- SEO-optimized meta tags and structure

## External Dependencies

### AI Services
- **Google AI API**: Core AI content generation using Gemini 1.5 Pro model
- Requires `GOOGLE_API_KEY` environment variable

### Database
- **Neon Database**: PostgreSQL serverless database (configured but not actively used)
- **Drizzle ORM**: Database toolkit for TypeSQL schema definition and migrations
- Connection configured via `DATABASE_URL` environment variable

### UI and Styling
- **Radix UI**: Accessible component primitives for complex UI components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Pre-built component library combining Radix with Tailwind
- **Lucide React**: Icon library for consistent iconography

### Development and Build Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across the entire stack
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Wouter**: Lightweight React router

### Fonts and Assets
- **Google Fonts**: Inter, DM Sans, Fira Code, Geist Mono, and Architects Daughter
- Font loading optimized with preconnect hints

The application is configured for deployment on Replit with specific plugins and error handling for the Replit environment.