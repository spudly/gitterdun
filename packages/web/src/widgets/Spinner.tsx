import type {FC} from 'react';
import {useEffect, useState} from 'react';
import clsx from 'clsx';

type SpinnerSize = 'sm' | 'md' | 'lg';

type SpinnerProps = {
  readonly size?: SpinnerSize;
  readonly inline?: boolean;
  readonly className?: string;
  readonly delayMs?: number;
};

const SIZE_MAP: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
};

export const Spinner: FC<SpinnerProps> = ({
  size = 'md',
  inline = false,
  className = '',
  delayMs = 200,
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => {
      setVisible(true);
    }, delayMs);
    return () => {
      clearTimeout(id);
    };
  }, [delayMs]);

  if (!visible) {
    return null;
  }

  const base = clsx(
    'animate-spin rounded-full border-indigo-600 border-b-transparent',
    SIZE_MAP[size],
    className,
  );
  if (inline) {
    return <span aria-label="loading" className={clsx('inline-block', base)} />;
  }
  return <div aria-label="loading" className={clsx('mx-auto', base)} />;
};
