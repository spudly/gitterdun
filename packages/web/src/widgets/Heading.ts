import type {FC, PropsWithChildren} from 'react';
import {createElement} from 'react';
import {clsx} from 'clsx';

const H1 = 1;
const H2 = 2;
const H3 = 3;
const H4 = 4;
const H5 = 5;
const H6 = 6;

export type HeadingLevel =
  | typeof H1
  | typeof H2
  | typeof H3
  | typeof H4
  | typeof H5
  | typeof H6;

export const Heading: FC<PropsWithChildren<{level?: HeadingLevel}>> = ({
  children,
  level = H1,
}) => {
  const className = clsx({
    'text-4xl': level === H1,
    'text-3xl': level === H2,
    'text-2xl': level === H3,
    'text-lg': level === H4,
    'text-base': level === H5 || level === H6,
    'font-bold': level === H1 || level === H2 || level === H3,
    'font-semibold': level === H4 || level === H5,
    'font-medium': level === H6,
  });

  const tagName = `h${level}`;

  return createElement(tagName, {className}, children);
};
