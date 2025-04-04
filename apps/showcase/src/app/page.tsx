/**
 * @author Mikiyas Birhanu And AI
 * @description Home page for the showcase app
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@packages/ui';
import Link from 'next/link';
import { ToastTest } from '@/components/toast-test';

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">NextJS Monorepo Showcase</h1>
      <ToastTest />
      <div className="flex flex-col gap-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">NextJS Monorepo Showcase</h1>
          <p className="text-lg text-muted-foreground mt-2">
            A demo of NextJS monorepo with Turborepo and modern frontend technologies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/components" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>UI Components</CardTitle>
                <CardDescription>
                  Explore the shadcn/ui components available in this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View a showcase of buttons, forms, modals, tables, cards, and more
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/api-demo" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>API Integration</CardTitle>
                <CardDescription>
                  See React Query in action with API configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Examples of data fetching, caching, error handling, and more
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/auth" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>
                  User authentication with Next-Auth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Login and registration forms with credential authentication
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>
                  Example dashboard with data visualization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Protected route with tables, charts, and interactive components
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>About this Showcase</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                This showcase demonstrates a NextJS monorepo setup using Turborepo. It includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>TypeScript for type safety</li>
                <li>shadcn/ui and Tailwind CSS for styling</li>
                <li>Zustand for state management</li>
                <li>Next-Auth for authentication</li>
                <li>React Query for data fetching</li>
                <li>React Hook Form for form management</li>
                <li>Zod for validation</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
