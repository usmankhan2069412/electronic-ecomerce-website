import * as React from "react";
import { ToastProps } from "./use-toast";

interface ToastContextType {
  toasts: ToastProps[];
  toast: (props: ToastProps) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback(
    ({ ...props }: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prevToasts) => [...prevToasts, { ...props, id }]);
    },
    []
  );

  const dismiss = React.useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
} 