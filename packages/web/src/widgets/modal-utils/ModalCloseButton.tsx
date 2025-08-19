import type {FC} from 'react';

type ModalCloseButtonProps = {
  readonly onClose: () => void;
  readonly showCloseButton: boolean;
};

export const ModalCloseButton: FC<ModalCloseButtonProps> = ({
  onClose,
  showCloseButton,
}) => {
  if (!showCloseButton) {
    return null;
  }

  return (
    <button
      aria-label="Close"
      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
      onClick={onClose}
      type="button"
    >
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
  );
};
