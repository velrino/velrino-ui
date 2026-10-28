'use client';
import { useState } from 'react';
import { Button } from '../../../components/button/index.js';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  type SheetContentProps,
} from '../../../components/sheet/index.js';
import { useDesignSystemCopy } from '../../adapters/hooks/useDesignSystemAdapters.js';

export function SheetExamples() {
  const { sheets: copy } = useDesignSystemCopy();
  const [side, setSide] = useState<SheetContentProps['side']>('right');
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="vui-showcase-row">
        {(['left', 'right', 'top', 'bottom'] as const).map((value) => (
          <Button
            key={value}
            variant="outline"
            onClick={() => {
              setSide(value);
              setOpen(true);
            }}
          >
            {copy.open}: {copy.sides[value]}
          </Button>
        ))}
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side={side} closeLabel={copy.close}>
          <SheetHeader>
            <SheetTitle>{copy.title}</SheetTitle>
            <SheetDescription>{copy.body}</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">{copy.close}</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
