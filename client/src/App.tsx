import { Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import HomePage from './pages/home-page';
import NotFound from './pages/not-found';
import AuthPage from './pages/auth-page';
import { AuthProvider, queryClient } from './hooks/use-auth';
import { ToastProvider } from './hooks/use-toast';
import { ProtectedRoute } from './lib/protected-route';

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <ProtectedRoute component={HomePage} />} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Router />
          </div>
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}