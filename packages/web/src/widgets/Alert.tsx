import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

type AlertType = 'success' | 'error' | 'warning' | 'info';

type AlertProps = {
  readonly type?: AlertType;
  readonly title?: string;
  readonly children: ReactNode;
  readonly outlined?: boolean;
  readonly onDismiss?: () => void;
};

const ALERT_STYLES: Record<AlertType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const ICON_STYLES: Record<AlertType, string> = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
};

const ALERT_OUTLINE_STYLES: Record<AlertType, string> = {
  success: 'border-2 border-green-400',
  error: 'border-2 border-red-400',
  warning: 'border-2 border-yellow-400',
  info: 'border-2 border-blue-400',
};

export const Alert: FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  outlined = false,
  onDismiss,
}) => {
  const baseStyles = clsx(
    'rounded-md p-4',
    ALERT_STYLES[type],
    outlined ? ALERT_OUTLINE_STYLES[type] : 'border',
  );

  return (
    <div className={baseStyles} role="alert">
      <div className="flex">
        <div className="shrink-0">
          {type === 'success' && (
            <svg
              className={clsx('size-5', ICON_STYLES[type])}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                fillRule="evenodd"
              />
            </svg>
          )}

          {type === 'error' && (
            <svg
              className={clsx('size-5', ICON_STYLES[type])}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                fillRule="evenodd"
              />
            </svg>
          )}

          {type === 'warning' && (
            <svg
              className={clsx('size-5', ICON_STYLES[type])}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                fillRule="evenodd"
              />
            </svg>
          )}

          {type === 'info' && (
            <svg
              className={clsx('size-5', ICON_STYLES[type])}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                fillRule="evenodd"
              />
            </svg>
          )}
        </div>

        <div className="ml-3 flex-1">
          {title !== undefined && title !== '' ? (
            <h3 className="text-sm font-medium">{title}</h3>
          ) : null}

          <div className="text-sm">{children}</div>
        </div>

        {onDismiss ? (
          <div className="ml-auto pl-3">
            <button
              className={clsx(
                'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                ICON_STYLES[type],
              )}
              onClick={() => {
                onDismiss();
              }}
              type="button"
            >
              <span className="sr-only">Dismiss</span>

              <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  fillRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
