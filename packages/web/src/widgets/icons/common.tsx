import type {FC, PropsWithChildren} from 'react';

type IconSize = 'sm' | 'md' | 'lg';

export const SIZE: Record<IconSize, number> = {sm: 16, md: 24, lg: 24};

type IconProps = {readonly size?: IconSize};

export type IconComponent = FC<IconProps>;

type SvgIconBaseProps = PropsWithChildren<{
  readonly size?: IconSize;
  readonly title?: string;
}>;

export const SvgIconBase: FC<SvgIconBaseProps> = ({
  size = 'md',
  title,
  children,
}) => (
  <svg
    aria-label={title}
    fill="none"
    height={SIZE[size]}
    stroke="currentColor"
    viewBox="0 0 24 24"
    width={SIZE[size]}
  >
    {title !== undefined ? <title>{title}</title> : null}
    {children}
  </svg>
);
