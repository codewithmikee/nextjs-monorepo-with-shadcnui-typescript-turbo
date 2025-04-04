import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// Define the validation schemas
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  displayName: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-12 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          
          {isLogin ? (
            <LoginForm onToggle={toggleForm} />
          ) : (
            <RegisterForm onToggle={toggleForm} />
          )}
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Start Your Journey</h2>
          <p className="text-xl mb-8">
            A powerful application built with modern web technologies to help you achieve your goals.
          </p>
          <div className="flex flex-col gap-4 items-center">
            <div className="bg-white/10 p-4 rounded-lg">
              <span className="text-lg font-medium">Secure Authentication</span>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <span className="text-lg font-medium">User-friendly Interface</span>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <span className="text-lg font-medium">Responsive Design</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onToggle }: { onToggle: () => void }) {
  const { loginMutation } = useAuth();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: 'Logged in successfully',
          variant: 'success',
        });
      },
      onError: (error) => {
        toast({
          title: 'Login failed',
          description: error.message || 'Please check your credentials',
          variant: 'destructive',
        });
      },
    });
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          {...register("username")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your username"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
      
      <p className="text-center text-sm text-gray-600 mt-4">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onToggle}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Sign up
        </button>
      </p>
    </form>
  );
}

function RegisterForm({ onToggle }: { onToggle: () => void }) {
  const { registerMutation } = useAuth();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });
  
  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: 'Account created successfully',
          variant: 'success',
        });
      },
      onError: (error) => {
        toast({
          title: 'Registration failed',
          description: error.message || 'Please try again with different credentials',
          variant: 'destructive',
        });
      },
    });
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          {...register("username")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Choose a username"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
          Display Name (optional)
        </label>
        <input
          id="displayName"
          type="text"
          {...register("displayName")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your display name"
        />
        {errors.displayName && (
          <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          {...register("password")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Create a password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {registerMutation.isPending ? 'Creating account...' : 'Sign up'}
      </button>
      
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onToggle}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Login
        </button>
      </p>
    </form>
  );
}