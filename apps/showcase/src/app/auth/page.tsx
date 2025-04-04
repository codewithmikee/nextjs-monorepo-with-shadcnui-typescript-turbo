/**
 * @author Mikiyas Birhanu And AI
 * @description Authentication page with login and registration forms
 */
'use client';

import { useCallback, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
} from '@packages/ui';

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Registration form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      name: '',
    },
  });

  // Handle login submission
  const onLoginSubmit = useCallback(
    async (data: LoginFormValues) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await signIn('credentials', {
          username: data.username,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Invalid username or password');
          return;
        }

        router.push('/dashboard');
      } catch (err) {
        setError('An error occurred during login. Please try again.');
        console.error('Login error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  // Handle registration submission
  const onRegisterSubmit = useCallback(
    async (data: RegisterFormValues) => {
      setIsLoading(true);
      setError(null);

      try {
        // This is just a mock API endpoint for demonstration
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Registration failed');
          return;
        }

        // Automatically log in after successful registration
        await signIn('credentials', {
          username: data.username,
          password: data.password,
          redirect: false,
        });

        router.push('/dashboard');
      } catch (err) {
        setError('An error occurred during registration. Please try again.');
        console.error('Registration error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="grid w-full max-w-[1000px] grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column: Form */}
        <div className="flex flex-col justify-center">
          <Card>
            <CardHeader>
              <CardTitle>{isLogin ? 'Login' : 'Create an Account'}</CardTitle>
              <CardDescription>
                {isLogin
                  ? 'Enter your credentials to access your account'
                  : 'Fill in your details to create a new account'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLogin ? (
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {error && (
                      <div className="text-destructive text-sm font-medium">{error}</div>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {error && (
                      <div className="text-destructive text-sm font-medium">{error}</div>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="link" className="w-full" onClick={toggleAuthMode}>
                {isLogin
                  ? "Don't have an account? Register"
                  : 'Already have an account? Login'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right column: Hero section */}
        <div className="hidden md:flex flex-col justify-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Welcome to NextJS Monorepo Showcase</h1>
            <p className="text-muted-foreground">
              This showcase demonstrates various features of a NextJS monorepo setup, including:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>Next.js with App Router</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>TypeScript for type safety</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>Zustand for state management</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>Next-Auth for authentication</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>React Query for data fetching</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>Beautiful UI with shadcn/ui and Tailwind CSS</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
