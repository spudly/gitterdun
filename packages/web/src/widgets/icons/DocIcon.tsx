import type {IconComponent} from './common.js';
import {defineMessage, useIntl} from 'react-intl';
import {SvgIconBase} from './common.js';

export const DocIcon: IconComponent = ({size = 'md'}) => {
  const intl = useIntl();
  const titleMessage = defineMessage({
    id: 'icons.doc.title',
    defaultMessage: 'Doc Icon',
  });
  const title = intl.formatMessage(titleMessage);
  return (
    <SvgIconBase size={size} title={title}>
      <path
        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </SvgIconBase>
  );
};
