import { createContext, ReactNode, useContext, useState } from "react";

type ToastVariant = "default" | "destructive" | "success" | "warning";

type ToastType = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastContextType = {
  toasts: ToastType[];
  toast: (props: Omit<ToastType, "id">) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const toast = ({
    title,
    description,
    variant = "default",
    duration = 5000,
  }: Omit<ToastType, "id">) => {
    const id = Math.random().toString(36).slice(2, 11);
    setToasts((prev) => [...prev, { id, title, description, variant, duration }]);

    if (duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  const { toasts, removeToast } = context;

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md transition-all transform duration-300 ease-in-out ${
            getVariantClasses(toast.variant)
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{toast.title}</h3>
              {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function getVariantClasses(variant: ToastVariant = "default") {
  switch (variant) {
    case "destructive":
      return "bg-red-100 text-red-800 border border-red-200";
    case "success":
      return "bg-green-100 text-green-800 border border-green-200";
    case "warning":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    default:
      return "bg-white text-gray-800 border border-gray-200";
  }
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}