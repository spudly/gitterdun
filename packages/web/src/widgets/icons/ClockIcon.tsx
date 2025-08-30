import type {IconComponent} from './common.js';
import {defineMessage, useIntl} from 'react-intl';
import {SIZE} from './common.js';

export const ClockIcon: IconComponent = ({size = 'md'}) => {
  const intl = useIntl();
  const titleMessage = defineMessage({
    id: 'icons.clock.title',
    defaultMessage: 'Clock Icon',
  });
  const title = intl.formatMessage(titleMessage);
  return (
    <svg
      aria-label={title}
      fill="none"
      height={SIZE[size]}
      stroke="currentColor"
      viewBox="0 0 24 24"
      width={SIZE[size]}
    >
      <title>{title}</title>
      <path
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
};
