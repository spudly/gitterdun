import {SIZE} from './common.js';
import type {IconComponent} from './common.js';

export const CloseIcon: IconComponent = ({size = 'md'}) => {
  const px = SIZE[size];
  return (
    <svg
      aria-hidden
      fill="none"
      focusable="false"
      height={px}
      viewBox="0 0 24 24"
      width={px}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
};
