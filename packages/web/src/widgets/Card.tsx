import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

export type CardProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly padded?: boolean;
  readonly elevated?: boolean;
  readonly header?: ReactNode;
  readonly footer?: ReactNode;
};

export const Card: FC<CardProps> = ({
  children,
  className = '',
  padded = true,
  elevated = true,
  header,
  footer,
}) => {
  const base = 'bg-white rounded-lg';
  const pad = padded ? 'p-6' : '';
  const elevation = elevated ? 'shadow' : 'border';
  return (
    <div className={clsx(base, elevation, className)}>
      {header !== null && header !== undefined ? (
        <div className="border-b border-gray-200 px-6 py-4">{header}</div>
      ) : null}

      <div className={pad}>{children}</div>

      {footer !== null && footer !== undefined ? (
        <div className="border-t border-gray-200 px-6 py-4">{footer}</div>
      ) : null}
    </div>
  );
};

export default Card;
