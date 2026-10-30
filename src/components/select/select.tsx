'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentProps,
} from 'react';
import { Select as Primitive } from '@base-ui/react/select';
import { cx } from '../../lib/classes.js';

export type SelectOption = Readonly<{ value: string; label: string; disabled?: boolean }>;
export type SelectProps = Omit<
  ComponentProps<'button'>,
  'value' | 'defaultValue' | 'onChange' | 'children'
> & {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
};

/** A controlled string select, including a real empty-string option. */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    id,
    value,
    onValueChange,
    options,
    placeholder,
    disabled,
    required,
    name,
    form,
    autoComplete,
    className,
    ...triggerProps
  },
  forwardedRef,
) {
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const selected = options.find((option) => option.value === value);
  useImperativeHandle(forwardedRef, () => trigger.current!, []);
  useEffect(() => {
    if (!open) return;
    const win = trigger.current?.ownerDocument.defaultView;
    if (!win) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.isComposing) return;
      // Dialog libraries can listen at document capture. Consume this popup's
      // Escape earlier so one key never dismisses both popup and parent dialog.
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      trigger.current?.focus({ preventScroll: true });
    };
    win.addEventListener('keydown', dismiss, true);
    return () => win.removeEventListener('keydown', dismiss, true);
  }, [open]);

  return (
    <Primitive.Root<string>
      id={id}
      open={open}
      value={value}
      items={options}
      disabled={disabled}
      required={required}
      name={name}
      form={form}
      autoComplete={autoComplete}
      modal={false}
      onValueChange={(next) => {
        // Base UI's null clear state must not masquerade as an actual '' option.
        if (next !== null) onValueChange(next);
      }}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          // Keep the popup inside an enclosing dialog's focus and pointer boundary.
          setPortalContainer(
            trigger.current?.closest<HTMLElement>('[role="dialog"], [role="alertdialog"]') ?? null,
          );
        }
        setOpen(nextOpen);
      }}
    >
      <Primitive.Trigger
        {...triggerProps}
        ref={trigger}
        id={id}
        type="button"
        data-slot="select-trigger"
        data-unselected={!selected || undefined}
        className={cx('vui-select-trigger', className)}
      >
        <Primitive.Value className="vui-select-value">
          {selected?.label ?? placeholder ?? value}
        </Primitive.Value>
        <Primitive.Icon className="vui-select-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Primitive.Icon>
      </Primitive.Trigger>
      <Primitive.Portal container={portalContainer ?? undefined}>
        <Primitive.Positioner
          className="vui-select-positioner"
          sideOffset={4}
          align="start"
          alignItemWithTrigger={false}
          collisionPadding={8}
        >
          <Primitive.Popup className="vui-select-popup" data-slot="select-popup">
            <Primitive.List className="vui-select-list">
              {options.map((option) => (
                <Primitive.Item
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  disabled={option.disabled}
                  className="vui-select-item"
                >
                  <Primitive.ItemText>{option.label}</Primitive.ItemText>
                  <Primitive.ItemIndicator className="vui-select-indicator">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  </Primitive.ItemIndicator>
                </Primitive.Item>
              ))}
            </Primitive.List>
          </Primitive.Popup>
        </Primitive.Positioner>
      </Primitive.Portal>
    </Primitive.Root>
  );
});
