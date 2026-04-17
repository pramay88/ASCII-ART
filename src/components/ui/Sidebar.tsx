'use client';

import * as React from 'react';
import styles from './Sidebar.module.css';
import { cn } from '../../lib/utils';

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsible?: boolean;
  open?: boolean;
  variant?: 'sidebar' | 'inset';
}

export function Sidebar({
  className,
  collapsible = false,
  open = true,
  variant = 'sidebar',
  ...props
}: SidebarProps) {
  return (
    <aside
      className={cn(
        styles.sidebar,
        variant === 'inset' && styles.inset,
        collapsible && !open && styles.collapsed,
        className
      )}
      {...props}
    />
  );
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(styles.header, className)} {...props} />;
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(styles.content, className)} {...props} />;
}

export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(styles.footer, className)} {...props} />;
}
