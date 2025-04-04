import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl w-full rounded-lg shadow-md overflow-hidden flex">
        <div className="w-full sm:w-1/2 bg-white dark:bg-gray-800 p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isLoginForm ? 'Login' : 'Create an Account'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {isLoginForm ? 'Welcome back!' : 'Join our community today'}
            </p>
          </div>
          {isLoginForm ? (
            <LoginForm onToggle={() => setIsLoginForm(false)} />
          ) : (
            <RegisterForm onToggle={() => setIsLoginForm(true)} />
          )}
        </div>
        
        <div className="hidden sm:block sm:w-1/2 bg-blue-600 p-8 text-white">
          <div className="flex flex-col h-full justify-center">
            <h2 className="text-3xl font-bold mb-4">Welcome to Our Platform</h2>
            <p className="mb-6">
              Access all features and connect with other members. Our platform provides
              everything you need for a seamless experience.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                <span>Feature 1: Lorem ipsum dolor sit amet</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                <span>Feature 2: Consectetur adipiscing elit</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                <span>Feature 3: Sed do eiusmod tempor</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onToggle }: { onToggle: () => void }) {
  const { loginMutation } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          {...register('username')}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          {...register('password')}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={loginMutation.isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loginMutation.isLoading ? 'Logging in...' : 'Login'}
      </button>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onToggle}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Register
          </button>
        </p>
      </div>
    </form>
  );
}

function RegisterForm({ onToggle }: { onToggle: () => void }) {
  const { registerMutation } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });
  
  const onSubmit = (data: RegisterFormValues) => {
    // Omit confirmPassword before sending to API
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          {...register('username')}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          {...register('password')}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={registerMutation.isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {registerMutation.isLoading ? 'Registering...' : 'Register'}
      </button>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggle}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </form>
  );
}