'use client';
import React from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  small?: boolean;
  full?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = 'secondary',
  small = false,
  full = false,
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    small && styles.small,
    full && styles.full,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  title: string;
}

export function IconButton({
  active = false,
  children,
  className,
  ...props
}: IconButtonProps) {
  const classes = [
    styles.iconButton,
    active && styles.active,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
