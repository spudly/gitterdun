import type {FC, ReactNode} from 'react';
import {useEffect} from 'react';
import clsx from 'clsx';

type ModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly children: ReactNode;
  readonly size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  readonly outlined?: boolean;
  readonly outlineColor?:
    | 'gray'
    | 'blue'
    | 'indigo'
    | 'red'
    | 'green'
    | 'yellow'
    | 'purple'
    | 'pink';
  readonly closeOnOverlayClick?: boolean;
  readonly showCloseButton?: boolean;
};

const SIZE_STYLES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

export const isOverlayKey = (key: string): boolean =>
  key === 'Enter' || key === ' ';

export const shouldCloseOnOverlayClick = (
  closeOnOverlayClick: boolean,
  isSelfTarget: boolean,
): boolean => {
  return closeOnOverlayClick && isSelfTarget;
};

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  outlined = false,
  outlineColor = 'blue',
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (
    event: React.MouseEvent | React.KeyboardEvent,
  ) => {
    if (
      shouldCloseOnOverlayClick(
        closeOnOverlayClick,
        event.target === event.currentTarget,
      )
    ) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <button
          aria-label="Close modal"
          className="fixed inset-0 bg-gray-500/75 transition-opacity"
          onClick={handleOverlayClick}
          onKeyDown={event => {
            if (isOverlayKey(event.key)) {
              handleOverlayClick(event);
            }
          }}
          tabIndex={0}
          type="button"
        />

        <div
          className={clsx(
            'relative overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all',
            SIZE_STYLES[size],
            outlined
              ? {
                  gray: 'border-4 border-gray-500',
                  blue: 'border-4 border-blue-500',
                  indigo: 'border-4 border-indigo-500',
                  red: 'border-4 border-red-500',
                  green: 'border-4 border-green-500',
                  yellow: 'border-4 border-yellow-500',
                  purple: 'border-4 border-purple-500',
                  pink: 'border-4 border-pink-500',
                }[outlineColor]
              : null,
          )}
        >
          {(typeof title === 'string' && title.length > 0)
          || showCloseButton ? (
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              {typeof title === 'string' && title.length > 0 ? (
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              ) : null}

              {showCloseButton ? (
                <button
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={onClose}
                  type="button"
                >
                  <span className="sr-only">Close</span>

                  <svg
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
