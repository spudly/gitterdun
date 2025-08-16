import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

export type FormCardProps = {
  readonly children: ReactNode;
  readonly title?: string;
  readonly size?: 'sm' | 'md' | 'lg';
};

const SIZE_STYLES = {sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg'};

export const FormCard: FC<FormCardProps> = ({children, title, size = 'md'}) => {
  return (
    <div
      className={clsx(
        'mx-auto rounded-lg bg-white p-6 shadow',
        SIZE_STYLES[size],
      )}
    >
      {title ?  (
        <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      ) : null}

      {children}
    </div>
  );
};

export default FormCard;
