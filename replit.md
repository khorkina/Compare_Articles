# Wiki Truth - Privacy-First Wikipedia Comparison Platform

## Overview

Wiki Truth is a freemium web application that enables users to compare Wikipedia articles across multiple languages using artificial intelligence. The platform offers both free and premium tiers - free users get Meta Llama AI analysis while premium subscribers ($5/month) receive OpenAI GPT-4o analysis with enhanced features. The platform is designed with privacy-first principles, storing all user data locally in the browser while revealing how the same topic can be presented differently in various linguistic and cultural contexts.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom Wikipedia-inspired design system
- **Component Library**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express.js framework (minimal server for static files only)
- **Language**: TypeScript with ES modules
- **Static Serving**: Express serves built React application
- **Development**: tsx for TypeScript execution in development

### Data Storage Solutions
- **Client Storage**: IndexedDB with idb library for structured data
- **User Accounts**: UUID-based accounts stored in browser localStorage with premium subscription tracking
- **Session Management**: Local browser storage only
- **Subscription Management**: Browser-based premium subscription with 30-day validation and Smart Glocal payment integration
- **Privacy**: No server-side data storage or tracking

## Key Components

### Search and Discovery System
- **Wikipedia Integration**: Direct API integration with Wikipedia's OpenSearch and LangLinks APIs
- **Real-time Search**: Debounced search with autocomplete suggestions
- **Multi-language Support**: 35+ supported languages with native name display
- **Article Selection**: Type-ahead search with snippet previews

### AI Comparison Engine
- **Free Tier**: OpenRouter.ai with Meta Llama 3.1 8B Instruct (unlimited usage)
- **Premium Tier**: OpenAI GPT-4o with full article processing and enhanced analysis ($5/month)
- **Comparison Modes**: Standard academic analysis and "funny mode" for entertaining insights
- **Content Processing**: Browser-to-server API communication with plan-based routing
- **Cultural Analysis**: Focus on factual differences, framing variations, and cultural perspectives
- **Payment Processing**: Smart Glocal integration with browser-based subscription validation

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

1. **User Initialization**: UUID-based account automatically created and stored in localStorage
2. **Article Search**: Direct browser calls to Wikipedia API with CORS proxy
3. **Language Discovery**: Wikipedia language links fetched client-side
4. **Language Selection**: User chooses 2-5 languages for comparison
5. **Content Retrieval**: Multiple Wikipedia articles fetched directly in browser
6. **AI Processing**: Direct browser-to-OpenAI API calls for comparison analysis
7. **Local Storage**: Results saved to IndexedDB with full user control
8. **Privacy Compliance**: No server-side data storage or user tracking

## External Dependencies

### APIs and Services
- **Wikipedia API**: Direct client-side calls for article search, language links, and content retrieval
- **OpenRouter.ai API**: Server-side calls to free Llama models for article comparison and analysis
- **CORS Proxy**: AllOrigins service for bypassing browser CORS restrictions with Wikipedia

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
- **Database URL**: Optional environment variable for PostgreSQL connection (using in-memory storage by default)
- **OpenRouter API Key**: Required for free AI comparison functionality
- **Node Environment**: Development/production mode switching

## Changelog

### Recent Changes
- January 2, 2025: **COMPLETED** - Enhanced premium user workflow to require settings configuration before comparison starts
- January 2, 2025: **COMPLETED** - Added visual indicators and helpful text for premium users about required configuration step
- January 2, 2025: **COMPLETED** - Improved button text to clearly indicate premium settings configuration requirement
- January 2, 2025: **IN PROGRESS** - Premium comparison features: output format selection, focus points, formality levels, AI model choice, analysis modes
- January 2, 2025: **IN PROGRESS** - Post-comparison chat functionality for premium users using free OpenRouter API
- January 2, 2025: **COMPLETED** - Fixed main page routing to show MainPage by default instead of Home page
- January 2, 2025: **COMPLETED** - Enhanced search suggestions loading by adding proper query invalidation on language changes
- January 2, 2025: **COMPLETED** - Improved AI prompts with strict language requirements to prevent mixed-language responses
- January 2, 2025: **COMPLETED** - Enhanced desktop PC experience for Contact Us, Terms of Service, and Report Issues pages
- January 2, 2025: **COMPLETED** - Added keyboard shortcuts (Ctrl+Enter, Escape), click-to-copy emails, and system detection
- January 2, 2025: **COMPLETED** - Created comprehensive Terms of Service, Contact Us, and Report Issues pages
- January 2, 2025: **COMPLETED** - Fixed JavaScript error with undefined contentLength property in comparison results
- January 2, 2025: **COMPLETED** - Enhanced Wikipedia service to include proper article metadata validation
- January 2, 2025: **COMPLETED** - Streamlined subscription flow without interrupting user comparisons
- January 2, 2025: **COMPLETED** - Removed all AI model mentions from user interface (privacy-focused design)
- January 2, 2025: **COMPLETED** - Fixed subscription status detection after premium upgrade
- January 2, 2025: **COMPLETED** - Implemented demo Smart Glocal payment simulation (3-second redirect)
- January 2, 2025: **COMPLETED** - Auto-start comparisons based on current subscription status
- January 2, 2025: **COMPLETED** - Optional upgrade button that doesn't disrupt user workflow
- January 2, 2025: **COMPLETED** - Premium subscription system with Smart Glocal payment integration ($5/month)
- January 2, 2025: **COMPLETED** - Freemium model: Free OpenRouter vs Premium OpenAI analysis (hidden from users)
- January 2, 2025: **COMPLETED** - Browser-based subscription validation with 30-day expiration tracking
- January 2, 2025: **COMPLETED** - Policy acceptance dialog with subscription terms and conditions
- January 2, 2025: **COMPLETED** - Plan selection interface with feature comparison
- January 2, 2025: **COMPLETED** - Subscription status component in settings with upgrade options
- December 30, 2024: **COMPLETED** - Subscription system implementation with Smart Glocal payment integration
- December 30, 2024: **COMPLETED** - Premium subscription model ($1/month) replacing API key requirements
- December 30, 2024: **COMPLETED** - Subscription validation and 30-day expiration tracking
- December 30, 2024: **COMPLETED** - Subscription gate on comparison features
- December 30, 2024: **COMPLETED** - Thank-you page with automatic premium activation
- December 30, 2024: **COMPLETED** - CORS proxy implementation for OpenAI API calls
- June 30, 2025: **COMPLETED** - Full client-side architecture conversion for privacy compliance
- June 30, 2025: **COMPLETED** - UUID-based user accounts stored in browser localStorage
- June 30, 2025: **COMPLETED** - IndexedDB integration for local data storage
- June 30, 2025: **COMPLETED** - Client-side Wikipedia content fetching with CORS proxy
- June 30, 2025: **COMPLETED** - Settings dialog for subscription management and data export
- June 30, 2025: **COMPLETED** - Text-based export functionality (client-side)
- June 30, 2025: **COMPLETED** - Platform-specific social sharing functionality  
- June 30, 2025: **COMPLETED** - Wikipedia article fetching with correct language-specific titles
- June 30, 2025: **COMPLETED** - Native language display throughout interface
- June 30, 2025: Initial setup and core functionality implementation

### Project Status
✅ **COMPLETELY FREE & FULLY FUNCTIONAL** - Complete privacy-first architecture with unlimited features:
- UUID-based user accounts (browser localStorage only)
- All data stored locally in IndexedDB (no server storage)
- Wikipedia API calls from browser with CORS proxy
- OpenRouter.ai API calls for free unlimited comparisons
- No subscription or registration required
- Multi-language Wikipedia article comparison (2-5 languages)
- AI-powered analysis using Meta Llama 3.1 8B with cultural insights
- Text export functionality and social media sharing
- Wikipedia-styled responsive design with real-time search
- Full data export and deletion capabilities for users
- GDPR and privacy law compliant architecture

## User Preferences

Preferred communication style: Simple, everyday language.

### Subscription Flow Preferences
- Free users should not see which AI model is being used (hide technical details)
- Don't interrupt users with plan selection during comparison workflow
- Auto-start comparisons with user's current plan (free or premium)
- Provide optional upgrade button that doesn't disrupt user experience
- Use demo payment links for Smart Glocal integration testing