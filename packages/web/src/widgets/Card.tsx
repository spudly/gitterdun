import {FC, ReactNode} from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  elevated?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}

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
    <div className={`${base} ${elevation} ${className}`}>
      {header && (
        <div className="px-6 py-4 border-b border-gray-200">{header}</div>
      )}
      <div className={pad}>{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200">{footer}</div>
      )}
    </div>
  );
};

export default Card;
