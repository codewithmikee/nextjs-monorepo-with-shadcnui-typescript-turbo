# NextJS Monorepo with Turborepo

This is a NextJS monorepo project built with Turborepo, TypeScript, and various modern frontend technologies, along with a client-server implementation using React with Vite, Express, and PostgreSQL.

## Project Structure

This monorepo is organized with the following structure:

- `apps/`: Standalone NextJS applications
- `configs/`: Shared configurations
- `shared/`: Common code that can be shared between frontend and backend
- `packages/`: Shared and reusable code (UI components, utilities, libraries, etc.)
- `standalone/`: Simple, independent applications
- `client/`: Vite-based React client application
- `server/`: Express backend with PostgreSQL database

## Tech Stack

### Monorepo Core
- **Package Manager**: pnpm
- **Build System**: Turborepo
- **Language**: TypeScript

### Next.js Applications
- **Framework**: Next.js (App Router)
- **UI**: shadcn/ui and Tailwind CSS
- **State Management**: Zustand
- **Authentication**: Next-Auth (credentials provider)
- **Data Fetching**: React Query
- **Form Management**: React Hook Form
- **Validation**: Zod

### Client-Server Implementation
- **Frontend**: React with Vite
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth
- **Routing**: wouter (client-side)
- **State Management**: React Query and Context API

## Features

- Next-Auth configuration with credentials provider and 1-hour expiration
- Complete shadcn/ui component library
- Reusable UI components (tables, forms, modals, buttons, inputs, etc.)
- Zustand store implementation
- React Query setup for data fetching
- React Hook Form with Zod validation
- API configurations for external API calls (server and client-side)
- Pagination, sorting, and filtering implementation
- Session-based authentication with PostgreSQL storage
- Protected routes implementation

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/codewithmikee/nextjs-monorepo-with-shadcnui-typescript-turbo.git
cd nextjs-monorepo-with-shadcnui-typescript-turbo
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Create .env file in the root
touch .env
```

Add the following to the env file:
```
# For PostgreSQL connection
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
PGUSER=username
PGPASSWORD=password
PGDATABASE=dbname
PGHOST=localhost
PGPORT=5432

# For session management
SESSION_SECRET=your_session_secret
```

### Development

You can run the different applications using the configured workflows:

#### Client-Server Implementation
Start the server workflow:
```
# In Replit, use the workflow panel to start the server workflow
```

Start the client workflow:
```
# In Replit, use the workflow panel to start the client workflow
```

### Building for Production

To build the client for production:

```bash
cd client
npm run build
npm run serve
```

## Project Structure Details

### Client-Server

- `client`: A Vite-based React application with authentication and protected routes
- `server`: An Express.js backend with PostgreSQL database and session-based authentication

### Packages

The `packages` directory contains shared code that can be used across applications:

- `ui`: Reusable UI components
- `utils`: Utility functions
- `hooks`: Custom React hooks
- `stores`: Zustand stores
- `constants`: Shared constants
- `auth`: Authentication utilities

### Shared

The `shared` directory contains code that can be shared between frontend and backend:

- `types`: Type definitions
- `schema`: Database and validation schemas

## Database Management

### Schema Management

The database schema is managed through Drizzle ORM. The schema is defined in:

```
shared/schema/index.ts
```

### Database Migrations

To push schema changes to the database:

```bash
npm run db:push
```

## Deployment

### Client-Server Deployment

For deploying the client-server implementation:

1. Backend (server):
   - Build the TypeScript files
   - Start the server using a process manager
   - Ensure the PostgreSQL database is configured

2. Frontend (client):
   - Build the client: `cd client && npm run build`
   - Serve using the included Express server: `cd client && npm run serve`

## Tasks and Progress

See the [tasks.md](./tasks.md) file for a detailed breakdown of completed and pending tasks in this project.

## Known Issues and Troubleshooting

### Client Development Mode

- The SPA routing in development mode may encounter issues with the "Cannot GET /" error
- Content Security Policy settings need configuration to allow all required resources

### Authentication Flow

- For a complete authentication flow, implement token refresh mechanisms
- Consider adding JWT support for API-only clients

## License

MIT

## Author

Mikiyas Birhanu and AI
