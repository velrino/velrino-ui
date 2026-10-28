'use client';

import type { ComponentProps } from 'react';
import * as Primitive from '@radix-ui/react-dialog';
import { cx } from '../../lib/classes.js';
import { Button } from '../button/index.js';
import { DialogFrame } from './dialog-frame.js';
import { useSurfaceAppearance, type SurfaceAppearance } from '../../provider/ui-provider.js';

export function Dialog(props: ComponentProps<typeof Primitive.Root>) {
  return <Primitive.Root {...props} />;
}
export function DialogTrigger(props: ComponentProps<typeof Primitive.Trigger>) {
  return <Primitive.Trigger data-slot="dialog-trigger" {...props} />;
}
export function DialogClose(props: ComponentProps<typeof Primitive.Close>) {
  return <Primitive.Close data-slot="dialog-close" {...props} />;
}
export const DialogPortal = Primitive.Portal;

export function DialogOverlay({ className, ...props }: ComponentProps<typeof Primitive.Overlay>) {
  return (
    <Primitive.Overlay
      data-slot="dialog-overlay"
      className={cx('vui-dialog-overlay', className)}
      {...props}
    />
  );
}

export type DialogContentProps = ComponentProps<typeof Primitive.Content> & {
  appearance?: SurfaceAppearance;
  showCloseButton?: boolean;
  closeLabel?: string;
  fullScreen?: boolean;
  portal?: boolean;
  portalContainer?: HTMLElement | null;
  overlayClassName?: string;
  bodyClassName?: string;
};

export function DialogContent({
  className,
  children,
  showCloseButton = true,
  closeLabel = 'Close',
  fullScreen = false,
  portal = true,
  portalContainer,
  overlayClassName,
  bodyClassName,
  appearance,
  ...props
}: DialogContentProps) {
  const resolvedAppearance = useSurfaceAppearance(appearance);
  const content = (
    <>
      <DialogOverlay className={overlayClassName} />
      <Primitive.Content
        data-slot="dialog-content"
        data-appearance={resolvedAppearance}
        className={cx(
          'vui-panel',
          'vui-panel--dialog',
          'vui-dialog-content',
          fullScreen && 'vui-dialog-content--fullscreen',
          className,
        )}
        {...props}
      >
        {resolvedAppearance === 'sci-fi' && <DialogFrame />}
        <div data-slot="dialog-body" className={cx('vui-dialog-body', bodyClassName)}>
          {children}
        </div>
        {showCloseButton && (
          <Primitive.Close data-slot="dialog-close" className="vui-dialog-close">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M6 18 18 6" />
            </svg>
            <span className="vui-sr-only">{closeLabel}</span>
          </Primitive.Close>
        )}
      </Primitive.Content>
    </>
  );
  return portal ? <DialogPortal container={portalContainer}>{content}</DialogPortal> : content;
}

export function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div data-slot="dialog-header" className={cx('vui-dialog-header', className)} {...props} />
  );
}
export function DialogFooter({
  className,
  showCloseButton = false,
  closeLabel = 'Close',
  children,
  ...props
}: ComponentProps<'div'> & { showCloseButton?: boolean; closeLabel?: string }) {
  return (
    <div data-slot="dialog-footer" className={cx('vui-dialog-footer', className)} {...props}>
      {children}
      {showCloseButton && (
        <DialogClose asChild>
          <Button variant="outline">{closeLabel}</Button>
        </DialogClose>
      )}
    </div>
  );
}
export function DialogTitle({ className, ...props }: ComponentProps<typeof Primitive.Title>) {
  return (
    <Primitive.Title
      data-slot="dialog-title"
      className={cx('vui-dialog-title', className)}
      {...props}
    />
  );
}
export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof Primitive.Description>) {
  return (
    <Primitive.Description
      data-slot="dialog-description"
      className={cx('vui-dialog-description', className)}
      {...props}
    />
  );
}
