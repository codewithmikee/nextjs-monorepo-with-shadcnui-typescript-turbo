import { createContext, ReactNode, useState, useContext, useCallback } from 'react';
import { X } from 'lucide-react';

type ToastVariant = 'default' | 'destructive' | 'success' | 'warning';

type ToastType = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastContextType = {
  toasts: ToastType[];
  toast: (props: Omit<ToastType, 'id'>) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const toast = useCallback(
    ({ title, description, variant = 'default', duration = 5000 }: Omit<ToastType, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastType = {
        id,
        title,
        description,
        variant,
        duration,
      };
      setToasts((prevToasts) => [...prevToasts, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const context = useContext(ToastContext);
  if (!context) return null;

  const { toasts, removeToast } = context;

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg flex items-start space-x-3 ${getVariantClasses(
            toast.variant
          )}`}
          role="alert"
        >
          <div className="flex-1 space-y-1">
            <h3 className="font-medium">{toast.title}</h3>
            {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 h-5 w-5 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close toast"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function getVariantClasses(variant: ToastVariant = 'default') {
  switch (variant) {
    case 'destructive':
      return 'bg-red-600 text-white';
    case 'success':
      return 'bg-green-600 text-white';
    case 'warning':
      return 'bg-yellow-500 text-white';
    default:
      return 'bg-white text-gray-800 border border-gray-200';
  }
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}