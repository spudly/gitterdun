import type {FC, PropsWithChildren} from 'react';
import {createElement} from 'react';
import {clsx} from 'clsx';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const Heading: FC<PropsWithChildren<{level?: HeadingLevel}>> = ({
  children,
  level = 1,
}) => {
  const className = clsx({
    /* eslint-disable @typescript-eslint/no-magic-numbers -- h1-h6 shouldn't need constants */
    'text-4xl': level === 1,
    'text-3xl': level === 2,
    'text-2xl': level === 3,
    'text-lg': level === 4,
    'text-base': level === 5 || level === 6,
    'font-bold': level === 1 || level === 2 || level === 3,
    'font-semibold': level === 4 || level === 5,
    'font-medium': level === 6,
    /* eslint-enable @typescript-eslint/no-magic-numbers */
  });

  const tagName = `h${level}`;

  return createElement(tagName, {className}, children);
};
