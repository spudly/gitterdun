import type {IconComponent} from './common.js';
import {defineMessage, useIntl} from 'react-intl';
import {SIZE} from './common.js';

export const TrophyIcon: IconComponent = ({size = 'md'}) => {
  const intl = useIntl();
  const titleMessage = defineMessage({
    id: 'icons.trophy.title',
    defaultMessage: 'Trophy Icon',
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
        d="M16 3v1a4 4 0 01-8 0V3m12 4a4 4 0 01-4 4h-1.5a3.5 3.5 0 01-7 0H6a4 4 0 01-4-4V5h4m12 2V5h4v2a4 4 0 01-4 4h-1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
};
