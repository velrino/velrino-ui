'use client';
import { Button } from '../../../components/button/index.js';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../../../components/dialog/index.js';
import { useDialogExample } from '../../hooks/useDialogExample.js';

export function DialogExamples() {
  const { copy, closeLabel, open, confirmed, onOpenChange, onConfirm, LanguagePicker } =
    useDialogExample();
  return (
    <div className="vui-showcase-stack">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline">{copy.open}</Button>
        </DialogTrigger>
        <DialogContent closeLabel={closeLabel}>
          <DialogHeader>
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>{copy.body}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{copy.cancel}</Button>
            </DialogClose>
            <Button onClick={onConfirm}>{copy.confirm}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {confirmed && (
        <p role="status" className="vui-showcase-feedback">
          {copy.confirmed}
        </p>
      )}
      <div className="vui-showcase-language-example">
        <h3>{copy.languageTitle}</h3>
        <p>{copy.languageDescription}</p>
        <LanguagePicker />
      </div>
    </div>
  );
}
