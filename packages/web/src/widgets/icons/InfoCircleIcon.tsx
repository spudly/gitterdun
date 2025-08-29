import type {IconComponent} from './common.js';
import {defineMessage, useIntl} from 'react-intl';
import {SIZE} from './common.js';

export const InfoCircleIcon: IconComponent = ({size = 'md'}) => {
  const intl = useIntl();
  const titleMessage = defineMessage({
    id: 'icons.infoCircle.title',
    defaultMessage: 'Info Circle Icon',
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
        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
};
