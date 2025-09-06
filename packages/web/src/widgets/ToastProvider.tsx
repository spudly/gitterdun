import type {FC, ReactNode} from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Alert} from './Alert.js';
import {TOAST_TIMEOUT_DURATION} from '../constants.js';

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
    onError?: (userMessage: string) => void,
  ) => (...args: Args) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: FC<{readonly children: ReactNode}> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ReadonlyArray<Toast>>([]);
  const idRef = useRef(1);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (opts: ToastOptions) => {
      const now = Date.now();
      const id = idRef.current++;
      const base = {
        id,
        title: opts.title,
        variant: opts.variant ?? 'info',
        expiresAt: now + (opts.durationMs ?? TOAST_TIMEOUT_DURATION),
      } satisfies Omit<Toast, 'description'>;
      const toast: Toast =
        opts.description !== undefined && opts.description !== ''
          ? {...base, description: opts.description}
          : base;
      setToasts(prev => [...prev, toast]);
      window.setTimeout(() => {
        removeToast(id);
      }, opts.durationMs ?? TOAST_TIMEOUT_DURATION);
    },
    [removeToast],
  );

  const safeAsync = useCallback(
    <Args extends Array<unknown>>(
      fn: (...args: Args) => Promise<unknown>,
      userMessage: string,
      onError?: (userMessage: string) => void,
    ) => {
      return (...args: Args) => {
        fn(...args).catch((error: unknown) => {
          // Log raw error for developers
          // eslint-disable-next-line no-console -- dev error logging
          console.error(error);
          addToast({title: userMessage, variant: 'error'});
          if (onError) {
            onError(userMessage);
          }
        });
      };
    },
    [addToast],
  );

  const value = useMemo<ToastContextValue>(
    () => ({addToast, safeAsync}),
    [addToast, safeAsync],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 w-full max-w-sm space-y-2 md:max-w-md">
        {toasts.map(toast => (
          <Alert
            key={toast.id}
            onDismiss={() => {
              removeToast(toast.id);
            }}
            type={toast.variant === 'warning' ? 'warning' : toast.variant}
          >
            <div className="flex flex-col">
              <span className="font-medium">{toast.title}</span>
              {toast.description !== undefined && toast.description !== '' ? (
                <span className="text-sm opacity-90">{toast.description}</span>
              ) : null}
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
    if (__TEST__) {
      const addToast: ToastContextValue['addToast'] = () => {};
      const safeAsync: ToastContextValue['safeAsync'] = (
        fn,
        userMessage,
        onError,
      ) => {
        return (...args) => {
          fn(...args).then(
            () => undefined,
            (error: unknown) => {
              // eslint-disable-next-line no-console -- log errors for debugging purposes
              console.error(error);
              if (onError) {
                onError(userMessage);
              }
            },
          );
        };
      };
      return {addToast, safeAsync};
    }
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};
