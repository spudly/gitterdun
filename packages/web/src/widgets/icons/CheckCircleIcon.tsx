import type {IconComponent} from './common.js';
import {defineMessage, useIntl} from 'react-intl';
import {SvgIconBase} from './common.js';

export const CheckCircleIcon: IconComponent = ({size = 'md'}) => {
  const intl = useIntl();
  const titleMessage = defineMessage({
    id: 'icons.checkCircle.title',
    defaultMessage: 'Check Circle Icon',
  });
  const title = intl.formatMessage(titleMessage);
  return (
    <SvgIconBase size={size} title={title}>
      <path
        d="M9 12l2 2 4-4m6 2a10 10 0 11-20 0 10 10 0 0120 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </SvgIconBase>
  );
};
