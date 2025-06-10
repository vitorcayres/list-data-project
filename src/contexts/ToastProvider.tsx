import { createContext, useContext, type ReactNode } from "react";
import { Toaster } from "../components/ui/sonner";

const ToastContext = createContext({});

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  return (
    <ToastContext.Provider value={{}}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
