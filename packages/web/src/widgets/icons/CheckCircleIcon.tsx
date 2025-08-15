import type {IconComponent} from './common.js';
import {SIZE} from './common.js';

export const CheckCircleIcon: IconComponent = ({size = 'md'}) => (
  <svg
    fill="none"
    height={SIZE[size]}
    stroke="currentColor"
    viewBox="0 0 24 24"
    width={SIZE[size]}
  >
    <path
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
);


