# Wiki Truth - AI-Powered Wikipedia Comparison Platform

## Overview

Wiki Truth is a full-stack web application that enables users to compare Wikipedia articles across multiple languages using artificial intelligence. The platform reveals how the same topic can be presented differently in various linguistic and cultural contexts, providing insights into cultural biases and narrative variations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom Wikipedia-inspired design system
- **Component Library**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with structured error handling
- **File Upload**: Built-in Express middleware for JSON/form data
- **Development**: tsx for TypeScript execution in development

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: Type-safe database operations with Drizzle Kit migrations
- **Connection**: Neon Database serverless PostgreSQL
- **Session Storage**: In-memory storage with fallback to PostgreSQL sessions

## Key Components

### Search and Discovery System
- **Wikipedia Integration**: Direct API integration with Wikipedia's OpenSearch and LangLinks APIs
- **Real-time Search**: Debounced search with autocomplete suggestions
- **Multi-language Support**: 35+ supported languages with native name display
- **Article Selection**: Type-ahead search with snippet previews

### AI Comparison Engine
- **Model**: OpenAI GPT-4o for article analysis
- **Comparison Modes**: Standard academic analysis and "funny mode" for entertaining insights
- **Content Processing**: Structured JSON input with comprehensive analysis output
- **Cultural Analysis**: Focus on factual differences, framing variations, and cultural perspectives

### Export and Sharing
- **Document Export**: DOCX generation using docx library
- **Comparison Reports**: Formatted documents with metadata and analysis
- **Share Functionality**: URL-based sharing of comparison results

### User Interface Components
- **Responsive Design**: Mobile-first approach with grid-based layouts
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Toast Notifications**: User feedback system for actions and errors
- **Loading States**: Skeleton loading and progress indicators

## Data Flow

1. **Article Search**: User searches for articles in selected language
2. **Language Discovery**: System fetches available language versions via Wikipedia API
3. **Language Selection**: User chooses 2-5 languages for comparison
4. **Content Retrieval**: System fetches full article content for selected languages
5. **AI Processing**: Articles sent to OpenAI for comparative analysis
6. **Result Display**: Formatted comparison displayed with export options
7. **Session Management**: Search sessions and comparisons stored for continuity

## External Dependencies

### APIs and Services
- **Wikipedia API**: Article search, language links, and content retrieval
- **OpenAI API**: GPT-4o for article comparison and analysis
- **Neon Database**: Serverless PostgreSQL hosting

### Development and Build Tools
- **Vite**: Build tool with React plugin and development server
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Production bundling for server-side code

### UI and Styling
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Libre Baskerville font family

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with React Fast Refresh
- **Database**: Local PostgreSQL or Neon development instance
- **Environment Variables**: API keys and database URLs via .env

### Production Build
- **Client Build**: Vite builds optimized React bundle to `dist/public`
- **Server Build**: ESBuild bundles Express server to `dist/index.js`
- **Static Assets**: Client bundle served by Express in production
- **Database**: Production PostgreSQL with connection pooling

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **OpenAI API Key**: Required for AI comparison functionality
- **Node Environment**: Development/production mode switching

## Changelog

### Recent Changes
- June 30, 2025: Fixed Wikipedia article fetching to use correct language-specific titles
- June 30, 2025: Improved language display to show native names prominently 
- June 30, 2025: Added debugging logs for OpenAI comparison service
- June 30, 2025: Fixed import errors and type issues preventing application startup
- June 30, 2025: Initial setup and core functionality implementation

## User Preferences

Preferred communication style: Simple, everyday language.