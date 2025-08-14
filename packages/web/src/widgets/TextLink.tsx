import {FC, ReactNode} from 'react';
import {Link, LinkProps} from 'react-router-dom';

export interface TextLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

export const TextLink: FC<TextLinkProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <Link {...rest} className={`text-indigo-600 ${className}`}>
      {children}
    </Link>
  );
};

export default TextLink;
