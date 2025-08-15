import type {FC, ReactNode} from 'react';
import {createContext, useCallback, useContext, useMemo, useRef, useState} from 'react';
import {Alert} from './Alert.js';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

type ToastOptions = {
  readonly title: string;
  readonly description?: string;
  readonly variant?: ToastVariant;
  readonly durationMs?: number;
};

type Toast = Required<Pick<ToastOptions, 'title' | 'variant'>> & {
  readonly id: number;
  readonly description?: string;
  readonly expiresAt: number;
};

type ToastContextValue = {
  readonly addToast: (opts: ToastOptions) => void;
  readonly safeAsync: <Args extends Array<unknown>>(
    fn: (...args: Args) => Promise<unknown>,
    userMessage: string,
  ) => (...args: Args) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: FC<{readonly children: ReactNode}> = ({children}) => {
  const [toasts, setToasts] = useState<ReadonlyArray<Toast>>([]);
  const idRef = useRef(1);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((opts: ToastOptions) => {
    const now = Date.now();
    const id = idRef.current++;
    const toast: Toast = {
      id,
      title: opts.title,
      description: opts.description,
      variant: opts.variant ?? 'info',
      expiresAt: now + (opts.durationMs ?? 4500),
    };
    setToasts(prev => [...prev, toast]);
    window.setTimeout(() => { removeToast(id); }, (opts.durationMs ?? 4500));
  }, [removeToast]);

  const safeAsync = useCallback(<Args extends Array<unknown>>(
    fn: (...args: Args) => Promise<unknown>,
    userMessage: string,
  ) => {
    return (...args: Args) => {
      void fn(...args).catch((error: unknown) => {
        // Log raw error for developers
        // eslint-disable-next-line no-console -- dev error logging
        console.error(error);
        addToast({title: userMessage, variant: 'error'});
      });
    };
  }, [addToast]);

  const value = useMemo<ToastContextValue>(() => ({addToast, safeAsync}), [addToast, safeAsync]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast viewport */}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-[min(92vw,360px)]">
        {toasts.map(t => (
          <Alert key={t.id} onDismiss={() => { removeToast(t.id); }} type={t.variant === 'warning' ? 'warning' : t.variant}>
            <div className="flex flex-col">
              <span className="font-medium">{t.title}</span>
              {(t.description != null && t.description !== '') ? <span className="text-sm opacity-90">{t.description}</span> : null}
            </div>
          </Alert>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};

