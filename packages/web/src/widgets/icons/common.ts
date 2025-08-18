import type {FC} from 'react';

type IconSize = 'sm' | 'md' | 'lg';

export const SIZE: Record<IconSize, number> = {sm: 16, md: 24, lg: 24};

type IconProps = {readonly size?: IconSize};

export type IconComponent = FC<IconProps>;
