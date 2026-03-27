/**
 * Type augmentation for @stellar/design-system
 * Fixes React 19 compatibility issues where components return Element instead of ReactNode
 */

import React from 'react';

declare module '@stellar/design-system' {
  import type { ReactNode, FC } from 'react';

  // Button component
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    isLoading?: boolean;
    isFullWidth?: boolean;
    isRounded?: boolean;
    showActionTooltip?: boolean;
    actionTooltipText?: string;
    actionTooltipPlacement?: string;
    addlClassName?: string;
  }

  export const Button: FC<ButtonProps>;

  // Card component
  export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    variant?: string;
    noPadding?: boolean;
    borderRadiusSize?: string;
    addlClassName?: string;
  }

  export const Card: FC<CardProps>;

  // Heading component
  export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    size?: string;
    weight?: string;
    addlClassName?: string;
  }

  export const Heading: FC<HeadingProps>;

  export interface IconProps extends React.SVGAttributes<SVGElement> {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'inherit';
  }

  export const Icon: {
    Home01: FC<IconProps>;
    Coins01: FC<IconProps>;
    Users01: FC<IconProps>;
    File02: FC<IconProps>;
    BarChart01: FC<IconProps>;
    Settings01: FC<IconProps>;
    Anchor: FC<IconProps>;
    Globe01: FC<IconProps>;
    AlertTriangle: FC<IconProps>;
    Moon01: FC<IconProps>;
    Sun: FC<IconProps>;
    [key: string]: FC<IconProps>;
  };

  // Text component
  export interface TextProps extends React.HTMLAttributes<HTMLElement> {
    children?: ReactNode;
    as?: 'p' | 'span' | 'div';
    size?: string;
    weight?: string;
    addlClassName?: string;
  }

  export const Text: FC<TextProps>;
}
