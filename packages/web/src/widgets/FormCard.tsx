import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

type FormCardProps = {
  readonly children: ReactNode;
  readonly title?: string;
  readonly size?: 'sm' | 'md' | 'lg';
};

const SIZE_STYLES = {sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg'};

export const FormCard: FC<FormCardProps> = ({children, title, size = 'md'}) => {
  return (
    <div
      className={clsx(
        'flex flex-col gap-4 rounded-lg bg-white p-6 shadow',
        SIZE_STYLES[size],
      )}
    >
      {typeof title === 'string' && title.length > 0 ? (
        <h2 className="text-2xl font-semibold">{title}</h2>
      ) : null}

      {children}
    </div>
  );
};
