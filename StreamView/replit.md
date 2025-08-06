# Replit.md

## Overview

This is a full-stack movie streaming platform called "StreamFlix" built with a modern tech stack. The application features a Netflix-like interface for browsing movies, managing watchlists, and streaming content. It uses a monorepo structure with shared schemas and a clear separation between frontend and backend concerns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom dark theme optimized for streaming experience
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Development Server**: Custom Vite integration for hot reloading

### Project Structure
```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared TypeScript schemas and types
└── migrations/      # Database migrations
```

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` - centralized schema definitions
- **Connection**: Neon serverless database with WebSocket support
- **Tables**: users, movies, genres, movie_genres (junction), watchlist

### API Endpoints
- **Movies**: CRUD operations, search, trending, featured content
- **Users**: Authentication and profile management
- **Watchlist**: Personal movie collections
- **Genres**: Category-based movie organization

### Frontend Features
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Video Player**: Custom video player with controls
- **Search**: Real-time movie search functionality
- **Navigation**: Fixed sidebar with route-based highlighting
- **Modals**: Movie details and video player overlays

## Data Flow

1. **Client Requests**: Frontend makes API calls through TanStack Query
2. **API Processing**: Express routes handle requests and interact with database
3. **Database Operations**: Drizzle ORM executes SQL queries on PostgreSQL
4. **Response Handling**: JSON responses sent back to client
5. **UI Updates**: React components re-render based on new data

### State Management Flow
- Server state managed by TanStack Query with automatic caching
- UI state handled by React hooks and component state
- Form state managed by React Hook Form with Zod validation

## External Dependencies

### Core Runtime Dependencies
- **Database**: `@neondatabase/serverless` - Serverless PostgreSQL client
- **ORM**: `drizzle-orm` - Type-safe database toolkit
- **UI Framework**: React with comprehensive Radix UI component suite
- **HTTP Client**: Built-in fetch API with custom wrapper functions
- **Validation**: Zod for schema validation

### Development Dependencies
- **Build Tools**: Vite for fast development and optimized builds
- **Code Quality**: TypeScript for type safety
- **Styling**: Tailwind CSS with PostCSS processing

### UI Component Library
Complete shadcn/ui implementation including:
- Form components (inputs, selects, buttons)
- Layout components (dialogs, sheets, carousels)
- Feedback components (toasts, tooltips, progress)
- Data display components (tables, cards, badges)

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to static assets
2. **Backend Build**: esbuild bundles Express server for production
3. **Output**: Frontend assets in `dist/public/`, server bundle in `dist/`

### Environment Configuration
- **Development**: Hot reloading with Vite dev server
- **Production**: Optimized builds with static asset serving
- **Database**: Environment-based connection string configuration

### Key Scripts
- `npm run dev` - Development server with hot reloading
- `npm run build` - Production build for both frontend and backend
- `npm run start` - Production server
- `npm run db:push` - Database schema synchronization

## Recent Changes

### Date: January 24, 2025
- **Ma Liste page créée** avec interface complète, tri et gestion des favoris
- **Design amélioré** avec nouvelles animations et effets visuels modernes  
- **Scripts d'installation locale** pour déploiement indépendant
- **Documentation complète** avec README.md, guide d'installation et configuration Docker
- **Structure cohérente** avec carrousels uniformes sur toutes les pages
- **Bandes-annonces limitées** aux pages de détails uniquement
- **Interface responsive** optimisée pour mobile et desktop

### Fonctionnalités Actuelles Complètes
- ✅ Page d'accueil avec films populaires et carrousels
- ✅ Page Films avec recherche et navigation par catégories
- ✅ Pages de détails avec bandes-annonces YouTube intégrées
- ✅ Page Séries avec interface dédiée
- ✅ Page Genres avec navigation par catégories colorées
- ✅ Page Ma Liste avec gestion des favoris et tri
- ✅ Page Historique avec suivi de progression
- ✅ Design Netflix-style avec thème sombre optimisé
- ✅ Intégration TMDB complète avec données authentiques
- ✅ Scripts d'installation pour déploiement local

## Installation Locale

Le projet inclut maintenant tous les fichiers nécessaires pour l'installation locale :
- `install.sh` - Script d'installation automatique
- `start-dev.sh` - Script de démarrage pour développement
- `docker-compose.yml` - Configuration Docker complète
- `Dockerfile` - Container de production
- `.env.example` - Template de configuration
- `init-db.sql` - Initialisation base de données
- `README.md` - Documentation complète
- `local-setup.md` - Guide d'installation détaillé

The application is designed for easy deployment on platforms that support Node.js with PostgreSQL databases, with particular optimization for Replit's environment and now supports full local development setup.