import type {IconComponent} from './common.js';
import {defineMessage, useIntl} from 'react-intl';
import {SvgIconBase} from './common.js';

export const TrophyIcon: IconComponent = ({size = 'md'}) => {
  const intl = useIntl();
  const titleMessage = defineMessage({
    id: 'icons.trophy.title',
    defaultMessage: 'Trophy Icon',
  });
  const title = intl.formatMessage(titleMessage);
  return (
    <SvgIconBase size={size} title={title}>
      <path
        d="M16 3v1a4 4 0 01-8 0V3m12 4a4 4 0 01-4 4h-1.5a3.5 3.5 0 01-7 0H6a4 4 0 01-4-4V5h4m12 2V5h4v2a4 4 0 01-4 4h-1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </SvgIconBase>
  );
};
