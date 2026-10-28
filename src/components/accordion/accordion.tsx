'use client';
import type { ComponentProps } from 'react';
import * as Primitive from '@radix-ui/react-accordion';
import { cx } from '../../lib/classes.js';

export function Accordion(props: ComponentProps<typeof Primitive.Root>) {
  return <Primitive.Root data-slot="accordion" {...props} />;
}
export function AccordionItem({ className, ...props }: ComponentProps<typeof Primitive.Item>) {
  return (
    <Primitive.Item
      data-slot="accordion-item"
      className={cx('vui-accordion-item', className)}
      {...props}
    />
  );
}
export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof Primitive.Trigger>) {
  return (
    <Primitive.Header className="vui-accordion-header">
      <Primitive.Trigger
        data-slot="accordion-trigger"
        className={cx('vui-accordion-trigger', className)}
        {...props}
      >
        {children}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Primitive.Trigger>
    </Primitive.Header>
  );
}
export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Content data-slot="accordion-content" className="vui-accordion-content" {...props}>
      <div className={cx('vui-accordion-body', className)}>{children}</div>
    </Primitive.Content>
  );
}
