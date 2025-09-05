import type {IconComponent} from './common.js';
import {defineMessage, useIntl} from 'react-intl';
import {SvgIconBase} from './common.js';

export const ClockIcon: IconComponent = ({size = 'md'}) => {
  const intl = useIntl();
  const titleMessage = defineMessage({
    id: 'icons.clock.title',
    defaultMessage: 'Clock Icon',
  });
  const title = intl.formatMessage(titleMessage);
  return (
    <SvgIconBase size={size} title={title}>
      <path
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </SvgIconBase>
  );
};
