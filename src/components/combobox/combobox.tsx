'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Combobox as Primitive } from '@base-ui/react/combobox';
import { cx } from '../../lib/classes.js';
import type { ComboboxOption, ComboboxProps } from './types.js';

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    options,
    renderOption,
    value,
    defaultValue = null,
    onValueChange,
    toggleLabel,
    emptyMessage,
    clearLabel,
    name,
    form,
    required,
    disabled,
    className,
    ...inputProps
  },
  forwardedRef,
) {
  const input = useRef<HTMLInputElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const selectedId = value === undefined ? uncontrolled : value;
  const selected = options.find((option) => option.value === selectedId) ?? null;
  useImperativeHandle(forwardedRef, () => input.current!, []);
  useEffect(() => {
    if (!open) return;
    const win = input.current?.ownerDocument.defaultView;
    if (!win) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.isComposing) return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      input.current?.focus({ preventScroll: true });
    };
    win.addEventListener('keydown', dismiss, true);
    return () => win.removeEventListener('keydown', dismiss, true);
  }, [open]);
  return (
    <Primitive.Root<ComboboxOption>
      items={options}
      value={selected}
      name={name}
      form={form}
      required={required}
      disabled={disabled}
      modal={false}
      open={open}
      onOpenChange={(next) => {
        if (next)
          setPortalContainer(
            anchor.current?.closest<HTMLElement>('[role="dialog"], [role="alertdialog"]') ?? null,
          );
        setOpen(next);
      }}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.value}
      isItemEqualToValue={(a, b) => a.value === b.value}
      onValueChange={(next) => {
        const id = next?.value ?? null;
        if (value === undefined) setUncontrolled(id);
        onValueChange?.(id);
      }}
    >
      <Primitive.InputGroup
        ref={anchor}
        className={cx('vui-combobox', className)}
        data-disabled={disabled || undefined}
      >
        <Primitive.Input {...inputProps} ref={input} className="vui-combobox-input" />
        {clearLabel && (
          <Primitive.Clear className="vui-combobox-action" aria-label={clearLabel}>
            <span aria-hidden="true">×</span>
          </Primitive.Clear>
        )}
        <Primitive.Trigger className="vui-combobox-action" aria-label={toggleLabel}>
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
      </Primitive.InputGroup>
      <Primitive.Portal container={portalContainer ?? undefined}>
        <Primitive.Positioner
          className="vui-combobox-positioner"
          sideOffset={4}
          align="start"
          collisionPadding={8}
        >
          <Primitive.Popup className="vui-combobox-popup">
            <Primitive.Empty className="vui-combobox-empty">{emptyMessage}</Primitive.Empty>
            <Primitive.List className="vui-combobox-list">
              {(option: ComboboxOption) => (
                <Primitive.Item
                  key={option.value}
                  value={option}
                  disabled={option.disabled}
                  className="vui-combobox-item"
                  aria-label={option.label}
                >
                  <span className="vui-combobox-option-content">
                    {renderOption ? renderOption(option) : option.label}
                  </span>
                  <Primitive.ItemIndicator aria-hidden="true">✓</Primitive.ItemIndicator>
                </Primitive.Item>
              )}
            </Primitive.List>
          </Primitive.Popup>
        </Primitive.Positioner>
      </Primitive.Portal>
    </Primitive.Root>
  );
});
