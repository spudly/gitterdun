import type {IconComponent} from './common.js';
import {SIZE} from './common.js';

export const GlobeIcon: IconComponent = ({size = 'md'}) => (
  <svg
    fill="none"
    height={SIZE[size]}
    stroke="currentColor"
    viewBox="0 0 24 24"
    width={SIZE[size]}
  >
    <path
      d="M12 2a10 10 0 100 20 10 10 0 000-20z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <path
      d="M2 12h20"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <path
      d="M12 2c3 3 3 17 0 20"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <path
      d="M12 2c-3 3-3 17 0 20"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
);
