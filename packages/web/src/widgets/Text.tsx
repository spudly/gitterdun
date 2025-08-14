import {FC, ReactNode} from 'react';
import clsx from 'clsx';

type AllowedAs = 'p' | 'span' | 'h1' | 'h2' | 'h3';
type TextSize = '3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

const SIZE: Record<TextSize, string> = {
  '3xl': 'text-3xl',
  '2xl': 'text-2xl',
  xl: 'text-xl',
  lg: 'text-lg',
  md: 'text-base',
  sm: 'text-sm',
};

const WEIGHT: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export interface TextProps {
  children: ReactNode;
  as?: AllowedAs;
  size?: TextSize;
  weight?: TextWeight;
  muted?: boolean;
  uppercase?: boolean;
  capitalize?: boolean;
}

export const Text: FC<TextProps> = ({
  children,
  as = 'p',
  size = 'md',
  weight = 'normal',
  muted = false,
  uppercase = false,
  capitalize = false,
}) => {
  const Comp: any = as;
  return (
    <Comp
      className={clsx(
        SIZE[size],
        WEIGHT[weight],
        muted ? 'text-gray-600' : 'text-gray-900',
        uppercase && 'uppercase',
        capitalize && 'capitalize',
      )}
    >
      {children}
    </Comp>
  );
};

export default Text;
