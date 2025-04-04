import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

// Define the toast variant types
type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'destructive';

// Interface for a toast notification
interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

// Interface for the toast context value
interface ToastContextValue {
  toasts: Toast[];
  toast: (props: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  dismissAllToasts: () => void;
}

// Create the context with a default value
const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Generate a random ID for toasts
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Toast provider component
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add a new toast notification
  const toast = useCallback((props: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast: Toast = { ...props, id };
    
    // Set default duration if not provided
    if (!newToast.duration) {
      newToast.duration = 5000; // 5 seconds default
    }
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    // Auto-dismiss toast after duration
    setTimeout(() => {
      dismissToast(id);
    }, newToast.duration);
  }, []);

  // Dismiss a specific toast by ID
  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Dismiss all toasts
  const dismissAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Value for the context provider
  const value = {
    toasts,
    toast,
    dismissToast,
    dismissAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

/**
 * Container component for rendering toasts
 */
function ToastContainer() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  const { toasts, dismissToast } = context;

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 p-4 w-full max-w-sm z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg shadow-lg p-4 animate-slideIn ${getVariantStyles(toast.variant)}`}
          role="alert"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{toast.title}</h3>
              {toast.description && (
                <div className="mt-1 text-sm opacity-90">{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="ml-4 text-sm opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Get CSS classes for different toast variants
 */
function getVariantStyles(variant: ToastVariant = 'default'): string {
  switch (variant) {
    case 'success':
      return 'bg-green-100 border border-green-200 text-green-800';
    case 'error':
      return 'bg-red-100 border border-red-200 text-red-800';
    case 'warning':
      return 'bg-yellow-100 border border-yellow-200 text-yellow-800';
    case 'destructive':
      return 'bg-red-600 text-white';
    default:
      return 'bg-white border border-gray-200 text-gray-800';
  }
}

/**
 * Hook for using toast functionality
 */
export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}