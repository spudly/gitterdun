import {FC, useEffect, useState} from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  inline?: boolean;
  className?: string;
  delayMs?: number;
}

const SIZE_MAP: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
};

export const Spinner: FC<SpinnerProps> = ({
  size = 'md',
  inline = false,
  className = '',
  delayMs = 100,
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(id);
  }, [delayMs]);

  if (!visible) {
    return null;
  }

  const base = `animate-spin rounded-full border-b-transparent border-indigo-600 ${SIZE_MAP[size]} ${className}`;
  if (inline) {
    return <span aria-label="loading" className={`inline-block ${base}`} />;
  }
  return <div aria-label="loading" className={`mx-auto ${base}`} />;
};

export default Spinner;
