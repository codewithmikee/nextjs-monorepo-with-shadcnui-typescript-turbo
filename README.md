# NextJS Monorepo with Turborepo

This is a NextJS monorepo project built with Turborepo, TypeScript, and various modern frontend technologies.

## Project Structure

This monorepo is organized with the following structure:

- `apps/`: Standalone NextJS applications
- `configs/`: Shared configurations
- `shared/`: Common code that can be shared between frontend and backend
- `packages/`: Shared and reusable code (UI components, utilities, libraries, etc.)
- `standalone/`: Simple, independent applications

## Tech Stack

- **Package Manager**: pnpm
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI**: shadcn/ui and Tailwind CSS
- **State Management**: Zustand
- **Authentication**: Next-Auth (credentials provider)
- **Data Fetching**: React Query
- **Form Management**: React Hook Form
- **Validation**: Zod

## Features

- Next-Auth configuration with credentials provider and 1-hour expiration
- Complete shadcn/ui component library
- Reusable UI components (tables, forms, modals, buttons, inputs, etc.)
- Zustand store implementation
- React Query setup for data fetching
- React Hook Form with Zod validation
- API configurations for external API calls (server and client-side)
- Pagination, sorting, and filtering implementation

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)

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
# Create .env.local in the root and in each app directory
touch apps/showcase/.env.local
```

Add the following to the env file:
```
# For Next-Auth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# For API endpoints (optional)
API_URL=https://your-api-url.com
```

### Development

You can run the different applications in development mode:

#### Showcase App
```bash
cd apps/showcase
pnpm dev
```

Or from the root:
```bash
pnpm --filter="showcase" dev
```

#### Simple App
```bash
cd standalone/simple-app
pnpm dev
```

Or from the root:
```bash
pnpm --filter="simple-app" dev
```

### Building for Production

To build all applications and packages:

```bash
pnpm build
```

To build a specific app:

```bash
pnpm --filter="showcase" build
```

## Project Structure Details

### Apps

The `apps` directory contains standalone Next.js applications:

- `showcase`: A demo application showcasing the components, hooks, and utilities available in the shared packages.

### Standalone

The `standalone` directory contains simple Next.js applications that can be run independently:

- `simple-app`: A basic Next.js application with Tailwind CSS styling.

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
- `api`: API response and request types

## Adding a New App

To add a new Next.js application to the monorepo:

1. Create a new directory in the `apps` folder:
```bash
mkdir -p apps/my-new-app
```

2. Initialize a new Next.js app with TypeScript:
```bash
cd apps/my-new-app
pnpm create next-app . --typescript --tailwind --app
```

3. Update the package.json to include the workspace name:
```json
{
  "name": "my-new-app",
  "version": "0.1.0",
  "private": true,
  ...
}
```

4. Configure the app to use shared packages by updating its tsconfig.json:
```json
{
  "extends": "../../configs/tsconfig/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@packages/*": ["../../packages/src/*"],
      "@shared/*": ["../../shared/src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

5. Update the root turbo.json to include the new app.

## Deployment

### General Deployment Guidelines

Each app in the monorepo can be deployed independently. The general process is:

1. Build the app and its dependencies:
```bash
pnpm --filter="my-app..." build
```

2. Deploy the built app according to your deployment platform's requirements.

### Vercel Deployment

For deploying to Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the project settings:
   - Root Directory: Select the app directory (e.g., `apps/showcase`)
   - Framework Preset: Next.js
   - Build Command: `cd ../.. && pnpm --filter=showcase build`
   - Output Directory: `.next`

3. Add environment variables in Vercel project settings.

### Netlify Deployment

For deploying to Netlify:

1. Connect your GitHub repository to Netlify
2. Configure the project settings:
   - Base directory: The app directory (e.g., `apps/showcase`)
   - Build command: `cd ../.. && pnpm --filter=showcase build`
   - Publish directory: `apps/showcase/.next`

3. Add environment variables in Netlify project settings.

## Tasks and Progress

See the [tasks.md](./tasks.md) file for a detailed breakdown of completed and pending tasks in this project.

## License

MIT

## Author

Mikiyas Birhanu and AI
