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
- January 3, 2025: **COMPLETED** - Fixed desktop loading page layout with proper responsive design and reduced excessive padding/spacing
- January 3, 2025: **COMPLETED** - Implemented search filtering to show only articles available in multiple languages
- January 3, 2025: **COMPLETED** - Added language link validation during search with user-friendly messaging
- January 3, 2025: **COMPLETED** - Enhanced search endpoint to fetch more initial results and filter single-language articles
- January 3, 2025: **COMPLETED** - Added clear notifications explaining multi-language filtering in search interface
- January 3, 2025: **COMPLETED** - Fixed mobile responsiveness issues on recent comparisons page
- January 3, 2025: **COMPLETED** - Improved mobile layout with stacked buttons, better text wrapping, and responsive typography
- January 3, 2025: **COMPLETED** - Enhanced summary statistics display with centered mobile layout and larger number displays
- January 3, 2025: **COMPLETED** - Fixed DOCX export functionality - files were empty due to client-side text generation instead of server DOCX creation
- January 3, 2025: **COMPLETED** - Created new /api/export/docx endpoint for proper server-side DOCX generation with docx library
- January 3, 2025: **COMPLETED** - Enhanced DOCX formatting to handle HTML cleanup, bullet points, headers, and symbol removal
- January 3, 2025: **COMPLETED** - Fixed mobile display issues with problematic symbols (equal signs, dashes) in AI-generated content
- January 3, 2025: **COMPLETED** - Enhanced markdown formatting to remove divider symbols that display incorrectly on mobile
- January 3, 2025: **COMPLETED** - Added mobile-specific CSS for better text wrapping and symbol handling
- January 3, 2025: **COMPLETED** - Removed "Completely Free" section from about page and "100% Free" text from main page
- January 3, 2025: **COMPLETED** - Updated messaging to reflect freemium model with premium features available
- January 3, 2025: **COMPLETED** - Added premium crown indicators throughout the interface for premium users
- January 3, 2025: **COMPLETED** - Crown appears on settings button, in navbar, and sidebar for premium subscribers
- January 3, 2025: **COMPLETED** - Green premium badge with golden crown icon for visual premium status
- January 3, 2025: **COMPLETED** - Fixed language selection to show only language versions where the specific article exists (corrected from showing all 270+ languages)
- January 3, 2025: **COMPLETED** - Added language search functionality to help users find specific available languages quickly
- January 3, 2025: **COMPLETED** - Search language automatically included first with special "Search Language" badge
- January 3, 2025: **COMPLETED** - Added "Article Available" indicators for all language versions of the specific article
- January 3, 2025: **COMPLETED** - Enhanced language selection system with 270+ Wikipedia languages support
- January 3, 2025: **COMPLETED** - Added clear 2-5 language selection requirement with visual counter and validation
- January 3, 2025: **COMPLETED** - Search language automatically included and protected from removal in comparisons
- January 3, 2025: **COMPLETED** - Improved article search interface with better summaries and visual enhancements
- January 3, 2025: **COMPLETED** - Fixed mobile responsiveness for premium comparison settings and results pages
- January 3, 2025: **COMPLETED** - Enhanced premium comparison options with improved mobile layout and green theme
- January 3, 2025: **COMPLETED** - Optimized comparison results page for mobile with responsive social sharing buttons
- January 3, 2025: **COMPLETED** - Fixed chat functionality with same robust fallback mechanism as comparisons
- January 3, 2025: **COMPLETED** - Added shared helper function for OpenRouter API calls with automatic model fallback
- January 3, 2025: **COMPLETED** - Premium users can now chat about comparisons using free models (hidden from user interface)
- January 3, 2025: **COMPLETED** - Fixed OpenRouter API comparison failures with robust fallback mechanism
- January 3, 2025: **COMPLETED** - Updated OpenRouter service to use working free models (Gemini 2.0 Flash, Qwen 2.5, Phi-3.5, Mistral)
- January 3, 2025: **COMPLETED** - Implemented automatic model fallback when endpoints are unavailable
- January 3, 2025: **COMPLETED** - Enhanced error handling and logging for better debugging
- January 3, 2025: **COMPLETED** - Fixed mobile and desktop responsive design across comparison loading, contact-us, and report-issues pages
- January 3, 2025: **COMPLETED** - Updated comparison loading page with proper mobile breakpoints and responsive typography
- January 3, 2025: **COMPLETED** - Enhanced mobile navigation headers with condensed layouts and responsive badges
- January 3, 2025: **COMPLETED** - Removed all mentions of free models from premium user interface (only model selection options remain)
- January 3, 2025: **COMPLETED** - Added clear messaging for single language articles with proper user guidance
- January 3, 2025: **COMPLETED** - Updated premium comparison options to hide free model references and use "Standard Model" terminology
- January 2, 2025: **COMPLETED** - Updated premium notification window in language selection to green theme
- January 2, 2025: **COMPLETED** - Changed "Premium Plan Active" message background and text to green colors
- January 2, 2025: **COMPLETED** - Changed all premium plan notifications from yellow to green color scheme
- January 2, 2025: **COMPLETED** - Updated premium badges, buttons, and status indicators across all components
- January 2, 2025: **COMPLETED** - Applied green theme to plan selection, thank-you page, and subscription status
- January 2, 2025: **COMPLETED** - Updated social sharing buttons to round circular design with X logo for Twitter
- January 2, 2025: **COMPLETED** - Added platform labels below each round social button for clarity
- January 2, 2025: **COMPLETED** - Enhanced visual design with perfect circles and improved hover effects
- January 2, 2025: **COMPLETED** - Created unique, attractive social sharing buttons with proper platform integration
- January 2, 2025: **COMPLETED** - Implemented comprehensive clipboard copying with Wiki Truth link inclusion
- January 2, 2025: **COMPLETED** - Added platform-specific messaging and sharing URLs for all major social networks
- January 2, 2025: **COMPLETED** - Enhanced social button design with hover animations and brand colors
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