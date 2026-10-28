'use client';

import type { ComponentProps } from 'react';
import * as Primitive from '@radix-ui/react-tabs';
import { cx } from '../../lib/classes.js';

export function Tabs({ className, ...props }: ComponentProps<typeof Primitive.Root>) {
  return <Primitive.Root data-slot="tabs" className={cx('vui-tabs', className)} {...props} />;
}
export function TabsList({ className, ...props }: ComponentProps<typeof Primitive.List>) {
  return (
    <Primitive.List data-slot="tabs-list" className={cx('vui-tabs-list', className)} {...props} />
  );
}
export function TabsTrigger({ className, ...props }: ComponentProps<typeof Primitive.Trigger>) {
  return (
    <Primitive.Trigger
      data-slot="tabs-trigger"
      className={cx('vui-tabs-trigger', className)}
      {...props}
    />
  );
}
export function TabsContent({ className, ...props }: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Content
      data-slot="tabs-content"
      className={cx('vui-tabs-content', className)}
      {...props}
    />
  );
}
