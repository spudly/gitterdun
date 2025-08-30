import {clsx} from 'clsx';
import type {FC, ReactNode} from 'react';
import type {LinkProps} from 'react-router-dom';
import {Link} from 'react-router-dom';

type TextLinkProps = LinkProps & {
  readonly children: ReactNode;
  readonly className?: string;
};

export const TextLink: FC<TextLinkProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <Link {...rest} className={clsx('text-indigo-600', className)}>
      {children}
    </Link>
  );
};
