# NextJS Monorepo with Turborepo

This is a NextJS monorepo project built with Turborepo, TypeScript, and various modern frontend technologies.

## Project Structure

This monorepo is organized with the following structure:

- `apps/`: Standalone NextJS applications
- `configs/`: Shared configurations
- `shared/`: Common code that can be shared between frontend and backend
- `packages/`: Shared and reusable code (UI components, utilities, libraries, etc.)

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
