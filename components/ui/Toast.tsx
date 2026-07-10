"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { CheckCircle2, X } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type ToastAction = {
  label: string;
  onClick: () => void;
};

type ToastMessage = {
  id: number;
  text: string;
  action?: ToastAction;
};

type ToastContextValue = {
  showToast: (text: string, action?: ToastAction) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 5000;

/** Toast notification provider and container component. */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);

  /** Shows a toast notification with optional action button. */
  const showToast = useCallback((text: string, action?: ToastAction) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, text, action }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, AUTO_DISMISS_MS);
  }, []);

  /** Dismisses a toast by ID. */
  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-center gap-3 rounded-md bg-ink px-4 py-2.5 text-sm text-white shadow-lg",
            )}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-soft" />
            <span>{toast.text}</span>
            {toast.action && (
              <button
                className="font-medium text-brand-soft underline underline-offset-2"
                onClick={() => {
                  toast.action?.onClick();
                  dismiss(toast.id);
                }}
              >
                {toast.action.label}
              </button>
            )}
            <button
              className="shrink-0 text-white/70 hover:text-white"
              aria-label="Dismiss"
              onClick={() => dismiss(toast.id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/** Hook to access toast context notifications. */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
