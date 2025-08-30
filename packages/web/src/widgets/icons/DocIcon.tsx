import type {IconComponent} from './common.js';
import {defineMessage, useIntl} from 'react-intl';
import {SIZE} from './common.js';

export const DocIcon: IconComponent = ({size = 'md'}) => {
  const intl = useIntl();
  const titleMessage = defineMessage({
    id: 'icons.doc.title',
    defaultMessage: 'Doc Icon',
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
        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
};
