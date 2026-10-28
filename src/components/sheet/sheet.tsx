'use client';
import type { ComponentProps } from 'react';
import { cx } from '../../lib/classes.js';
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  type DialogContentProps,
} from '../dialog/index.js';

export const Sheet = Dialog;
export const SheetTrigger = DialogTrigger;
export const SheetClose = DialogClose;
export type SheetContentProps = DialogContentProps & {
  side?: 'top' | 'right' | 'bottom' | 'left';
  hideClose?: boolean;
};
export function SheetContent({
  className,
  side = 'right',
  hideClose = false,
  ...props
}: SheetContentProps) {
  return (
    <DialogContent
      data-slot="sheet-content"
      data-side={side}
      className={cx('vui-sheet', className)}
      showCloseButton={!hideClose}
      {...props}
    />
  );
}
export function SheetHeader(props: ComponentProps<typeof DialogHeader>) {
  return <DialogHeader {...props} />;
}
export function SheetFooter(props: ComponentProps<typeof DialogFooter>) {
  return <DialogFooter {...props} />;
}
export function SheetTitle(props: ComponentProps<typeof DialogTitle>) {
  return <DialogTitle {...props} />;
}
export function SheetDescription(props: ComponentProps<typeof DialogDescription>) {
  return <DialogDescription {...props} />;
}
