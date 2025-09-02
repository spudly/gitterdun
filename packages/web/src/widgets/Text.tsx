import type {FC, ReactNode} from 'react';
import {clsx} from 'clsx';

type AllowedAs = 'p' | 'span' | 'h1' | 'h2' | 'h3';
type TextSize = '3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

const SIZE: Record<TextSize, string> = {
  '3xl': 'text-3xl',
  '2xl': 'text-2xl',
  'xl': 'text-xl',
  'lg': 'text-lg',
  'md': 'text-base',
  'sm': 'text-sm',
};

const WEIGHT: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

type TextProps = {
  readonly children: ReactNode;
  readonly as?: AllowedAs;
  readonly size?: TextSize;
  readonly weight?: TextWeight;
  readonly muted?: boolean;
  readonly uppercase?: boolean;
  readonly capitalize?: boolean;
};

export const Text: FC<TextProps> = ({
  children,
  as: Element = 'p',
  size = 'md',
  weight = 'normal',
  muted = false,
  uppercase = false,
  capitalize = false,
}) => {
  return (
    <Element
      // eslint-disable-next-line react/forbid-component-props -- not a Component; it's a native element
      className={clsx(
        SIZE[size],
        WEIGHT[weight],
        muted ? 'text-gray-600' : 'text-gray-900',
        uppercase && 'uppercase',
        capitalize && 'capitalize',
      )}
    >
      {children}
    </Element>
  );
};
