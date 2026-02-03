# UniReviews - University Teacher Review Platform

## Overview

UniReviews is a full-stack university platform where students can review teachers, view teacher profiles, and access previous year question papers (PYQs). The application supports three user types: guests (logged out users who can browse), students (can submit one anonymous review per teacher), and admins (can manage teachers, reviews, and upload PYQs).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom plugins for Replit integration
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Icons**: Lucide React exclusively
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Style**: RESTful endpoints defined in shared route contracts
- **File Uploads**: Multer for handling PYQ document uploads
- **Session Management**: Express-session with PostgreSQL session store (connect-pg-simple)

### Authentication System
- **Strategy**: Passport.js with Local Strategy
- **Password Hashing**: scrypt with random salt
- **Sessions**: Cookie-based sessions stored in PostgreSQL
- **Role-Based Access**: Admin and Student roles with route-level protection

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Migrations**: Drizzle Kit with push command (`db:push`)
- **Connection**: Node-postgres (pg) pool

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks (auth, teachers, reviews, pyqs)
│   │   ├── pages/        # Route components
│   │   └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── auth.ts       # Passport authentication setup
│   ├── db.ts         # Database connection
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Data access layer
│   └── static.ts     # Production static file serving
├── shared/           # Shared code between frontend/backend
│   ├── schema.ts     # Drizzle database schema and Zod types
│   └── routes.ts     # API contract definitions with Zod
└── migrations/       # Drizzle database migrations
```

### API Contract Pattern
The application uses a shared API contract pattern where route definitions, input/output schemas are defined in `shared/routes.ts`. This enables type-safe API calls and consistent validation across frontend and backend.

### Build System
- **Development**: tsx for running TypeScript directly
- **Production Build**: Custom script using esbuild for server and Vite for client
- **Output**: Server bundles to `dist/index.cjs`, client to `dist/public`

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **Session Store**: PostgreSQL-backed session storage via connect-pg-simple

### File Storage
- **Local Storage**: PYQ files stored in `client/public/uploads` directory
- **Served via**: Vite dev server (development) or Express static middleware (production)

### Key NPM Packages
- **@tanstack/react-query**: Server state management
- **drizzle-orm / drizzle-zod**: Database ORM with Zod schema generation
- **passport / passport-local**: Authentication
- **multer**: File upload handling
- **zod**: Runtime type validation
- **shadcn/ui components**: Full suite of Radix UI primitives with Tailwind styling