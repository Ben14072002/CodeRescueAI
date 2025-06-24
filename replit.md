# CodeBreaker - AI Assistant Rescue Tool

## Overview

CodeBreaker is a full-stack web application designed to help developers get unstuck when AI coding assistants fail or provide inadequate solutions. The platform provides battle-tested strategies, proven prompts, and step-by-step guidance to break through AI limitations and continue productive development.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system and shadcn/ui components
- **State Management**: TanStack Query for server state, local state with React hooks
- **Authentication**: Firebase Auth with Google OAuth integration

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple

### Development Stack
- **Deployment**: Replit with autoscale deployment target
- **Package Manager**: npm
- **Type Checking**: TypeScript with strict mode enabled
- **Development Server**: Concurrent frontend (Vite) and backend (tsx) processes

## Key Components

### Authentication System
- Firebase Authentication for user management
- Google OAuth integration with redirect/popup support
- Backend user registration and synchronization
- Protected routes and subscription-based access control

### Subscription Management
- Stripe integration for payment processing
- Multiple subscription tiers (Free, Pro Monthly, Pro Yearly)
- Trial system with eligibility checking and countdown
- Webhook handling for subscription status updates
- Usage tracking and limits enforcement

### Problem Resolution Engine
- Categorized problem types with strategic solutions
- AI prompt templates optimized for different coding assistants
- Step-by-step action plans with progress tracking
- Custom prompt generator using OpenAI API
- Session persistence and analytics

### User Experience Features
- Interactive problem selection workflow
- Progress tracking with timers and completion metrics
- Recent sessions dashboard and history
- Cost calculator for ROI demonstration
- Responsive design with mobile optimization

## Data Flow

### User Journey
1. **Landing**: User visits homepage and browses features
2. **Authentication**: Sign up/login via Firebase (optional for free tier)
3. **Problem Selection**: Choose from predefined issues or describe custom problem
4. **Solution Generation**: Receive targeted strategies and prompts
5. **Progress Tracking**: Follow step-by-step guidance with time tracking
6. **Completion**: Mark success and rate prompt effectiveness

### Subscription Flow
1. **Trial Eligibility**: Check user's trial status and history
2. **Stripe Checkout**: Create payment session for Pro subscriptions
3. **Webhook Processing**: Handle subscription events and update database
4. **Access Control**: Enforce usage limits based on subscription tier

### Data Persistence
- User sessions stored in PostgreSQL with JSON fields for complex data
- Local storage fallback for unauthenticated users
- Real-time subscription status synchronization
- Prompt rating collection for continuous improvement

## External Dependencies

### Third-Party Services
- **Firebase**: Authentication and user management
- **Stripe**: Payment processing and subscription management
- **Neon**: Serverless PostgreSQL hosting
- **OpenAI**: AI-powered prompt generation (Pro feature)

### Key Libraries
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Form Handling**: React Hook Form with Zod validation
- **Database**: Drizzle ORM with connection pooling
- **State Management**: TanStack Query for API state
- **Styling**: Tailwind CSS with custom design tokens

## Deployment Strategy

### Development Environment
- Replit-hosted with hot reloading
- PostgreSQL database provisioned automatically
- Environment variables for API keys and configuration
- Concurrent development servers (port 5000)

### Production Build
- Vite builds optimized frontend bundle
- esbuild bundles Node.js server for production
- Static assets served from `/dist/public`
- Database migrations via Drizzle Kit

### Configuration
- TypeScript path mapping for clean imports
- PostCSS with Tailwind and Autoprefixer
- ESM modules throughout the stack
- Strict TypeScript configuration with proper type checking

## Changelog
- June 24, 2025: **PRODUCTION ARCHITECTURE REFACTORING COMPLETE** - Implemented comprehensive architectural improvements based on senior developer code review analysis. Broke monolithic 800+ line routes.ts into logical modules (auth.ts, subscriptions.ts, webhooks.ts, wizard.ts, status.ts). Added comprehensive error handling middleware with custom error classes, standardized API response utility, input validation middleware with security helpers, and sophisticated rate limiting system with tiered limits. System now follows enterprise-grade patterns with proper separation of concerns.
- June 23, 2025: **ADVANCED AI PROMPTING STRATEGIES IMPLEMENTED** - Completely upgraded AI Development Wizard prompt generation system to use cutting-edge prompting techniques. Each generated AI prompt now implements Chain-of-Thought reasoning, Role-based prompting, Few-shot learning, Constraint-based instructions, Meta-prompting, and Structured output frameworks. Prompts are now 150-300 words with multiple advanced strategies instead of basic 2-sentence responses.
- June 23, 2025: **AI WIZARD CONVERSATION INTELLIGENCE ENHANCED** - Fixed repetitive generic responses in AI Development Wizard. Implemented intelligent conversation flow with contextual understanding of user requests, specific step elaboration, code examples, and troubleshooting assistance. Added post-solution stage for better follow-up interactions and detailed step breakdowns.
- June 23, 2025: **WIZARD CONVERSATION PERSISTENCE ADDED** - Implemented comprehensive conversation saving system for AI Development Wizard. Each user's conversations are now automatically saved to their account with full message history, classification data, and generated solutions. Added database schema for wizard conversations with proper user relationships and conversation management API endpoints.
- June 23, 2025: **AI DEVELOPMENT WIZARD INTELLIGENCE SYSTEM COMPLETE** - Successfully deployed intelligent AI Development Wizard with OpenAI-powered analysis. System now provides deep technical analysis, context-specific problem classification, and copy-paste ready prompts without placeholders. Fixed JSON parsing issues with OpenAI responses and implemented robust markdown code block handling. Wizard now generates truly customized solutions based on user's specific problem context.
- June 23, 2025: **AI DEVELOPMENT WIZARD INTELLIGENCE UPGRADE** - Completely rebuilt the AI Development Wizard to provide deep technical analysis and intelligent, copy-paste ready prompts. Enhanced backend uses advanced prompting strategies (Chain-of-Thought, Role-based, Few-shot) to generate specific solutions without placeholders. System now performs root cause analysis using proven debugging frameworks and creates context-specific AI prompts that eliminate generic responses.
- June 23, 2025: **CRITICAL DATABASE FIX - PRO ACCESS RESTORED** - Fixed critical production issue where paid Pro users couldn't access features due to data being stored in memory instead of database. Switched from MemStorage to DatabaseStorage, ensuring all subscription data persists across server restarts. Added automatic Pro upgrade detection for users with Stripe subscription IDs and emergency manual activation system.
- June 20, 2025: **LIVE PRODUCTION FIX - NO WEBHOOK SOLUTION** - Solved critical issue where users couldn't access Pro features after Stripe payment due to missing webhook configuration. Implemented robust client-side trial activation that automatically triggers when users return from successful Stripe checkout, completely bypassing webhook dependency. All live users now get immediate trial access after payment completion.
- June 20, 2025: **PRODUCTION TRIAL SYSTEM DEPLOYED** - Implemented comprehensive trial activation system with webhook automation, client-side fallback activation, and manual activation endpoints. All users can now access Pro features after successful Stripe checkout completion. System includes abuse prevention and eligibility validation.
- June 20, 2025: Fixed critical user registration authentication bug - corrected parameter mismatch between frontend (userId) and backend (uid) in Firebase auth flow, resolving "Firebase UID and email are required" errors and enabling successful Pro upgrade checkout
- June 20, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.