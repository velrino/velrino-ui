import { useRef, useState, type Ref } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../src/index.js';
import { useDemoLocale, type Locale } from '../i18n.js';

const languages = [
  { locale: 'en', label: 'English', code: 'EN-US', flag: '/flags/us.svg' },
  { locale: 'pt-BR', label: 'Português', code: 'PT-BR', flag: '/flags/br.svg' },
] as const satisfies readonly { locale: Locale; label: string; code: string; flag: string }[];

export function LanguageOptions({
  selectedRef,
  onSelect,
}: {
  selectedRef?: Ref<HTMLButtonElement>;
  onSelect?: () => void;
}) {
  const { locale, setLocale, copy } = useDemoLocale();
  const text = copy.language;
  return (
    <div className="demo-language-options">
      {languages.map((language) => {
        const selected = language.locale === locale;
        return (
          <Button
            key={language.locale}
            ref={selected ? selectedRef : undefined}
            variant="outline"
            aria-label={language.label}
            aria-pressed={selected}
            className="demo-language-option"
            onClick={() => {
              setLocale(language.locale);
              onSelect?.();
            }}
          >
            <img src={language.flag} width={32} height={32} alt="" className="demo-language-flag" />
            <span className="demo-language-copy">
              <strong lang={language.locale}>{language.label}</strong>
              <small>
                {text.regions[language.locale]} · {selected ? text.selected : text.available}
              </small>
            </span>
            <span aria-hidden="true" className="demo-language-check">
              {selected ? '✓' : ''}
            </span>
          </Button>
        );
      })}
    </div>
  );
}

export function LanguagePicker() {
  const { locale, copy } = useDemoLocale();
  const [open, setOpen] = useState(false);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const current = languages.find((language) => language.locale === locale)!;
  const text = copy.language;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" aria-label={`${text.trigger}: ${current.label}`}>
          <img src={current.flag} width={24} height={24} alt="" className="demo-language-flag" />
          <span>{current.code}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent
        closeLabel={text.close}
        className="demo-language-dialog"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          selectedRef.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        <LanguageOptions selectedRef={selectedRef} onSelect={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
