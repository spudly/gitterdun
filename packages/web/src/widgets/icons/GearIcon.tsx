import type {IconComponent} from './common.js';
import {SvgIconBase} from './common.js';

export const GearIcon: IconComponent = ({size = 'md'}) => (
  <SvgIconBase size={size}>
    <path
      d="M12 8a4 4 0 100 8 4 4 0 000-8z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <path
      d="M2 12h3m14 0h3M12 2v3m0 14v3M4.93 4.93l2.12 2.12m9.9 9.9l2.12 2.12M4.93 19.07l2.12-2.12m9.9-9.9l2.12-2.12"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </SvgIconBase>
);
