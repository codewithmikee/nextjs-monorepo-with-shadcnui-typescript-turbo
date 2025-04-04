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
- pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

### Development

You can run the different applications in development mode:

#### Showcase App
```bash
cd apps/showcase
pnpm dev
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

## Tasks and Progress

See the [tasks.md](./tasks.md) file for a detailed breakdown of completed and pending tasks in this project.
