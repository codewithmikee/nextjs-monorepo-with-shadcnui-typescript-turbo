/**
 * @author Mikiyas Birhanu And AI
 * @description Toast notification hook
 */
'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'destructive';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (props: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  dismissAllToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

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

  const toast = useCallback((props: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast: Toast = { ...props, id };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto-dismiss after duration (default 5000ms)
    const duration = props.duration || 5000;
    setTimeout(() => {
      dismissToast(id);
    }, duration);
    
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismissToast, dismissAllToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

/**
 * Container component for rendering toasts
 */
function ToastContainer() {
  const { toasts, dismissToast } = useContext(ToastContext)!;

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md animate-slideIn transition-all flex items-start gap-3 ${getVariantStyles(toast.variant)}`}
        >
          <div className="flex-1">
            <h3 className="font-medium text-sm">{toast.title}</h3>
            {toast.description && <p className="mt-1 text-xs opacity-90">{toast.description}</p>}
          </div>
          <button
            className="text-sm opacity-70 hover:opacity-100"
            onClick={() => dismissToast(toast.id)}
          >
            ✕
          </button>
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
      return 'bg-green-50 text-green-900 border border-green-200';
    case 'error':
      return 'bg-red-50 text-red-900 border border-red-200';
    case 'warning':
      return 'bg-yellow-50 text-yellow-900 border border-yellow-200';
    case 'destructive':
      return 'bg-red-100 text-red-900 border border-red-300';
    default:
      return 'bg-white text-gray-900 border border-gray-100';
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