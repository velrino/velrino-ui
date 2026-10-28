'use client';
import { useEffect, useRef, useState } from 'react';
import { formatColor } from '../helpers/format-color.js';

export function useResolvedColors() {
  const container = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let frame: number | undefined;
    const read = () => {
      frame = undefined;
      const next: Record<string, string> = {};
      for (const swatch of element.querySelectorAll<HTMLElement>('[data-color-variable]')) {
        const variable = swatch.dataset.colorVariable;
        if (variable) next[variable] = formatColor(getComputedStyle(swatch).backgroundColor);
      }
      setValues((previous) =>
        Object.entries(next).every(([key, value]) => previous[key] === value) ? previous : next,
      );
    };
    const schedule = () => {
      if (frame === undefined) frame = window.requestAnimationFrame(read);
    };
    read();

    // Observe only this host's ancestors, not unrelated interactions throughout the page.
    const observer = new MutationObserver(schedule);
    for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
      observer.observe(ancestor, { attributes: true });
    }
    const media = ['(prefers-color-scheme: dark)', '(forced-colors: active)'].map((query) =>
      window.matchMedia(query),
    );
    for (const query of media) query.addEventListener('change', schedule);
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      observer.disconnect();
      for (const query of media) query.removeEventListener('change', schedule);
      window.removeEventListener('resize', schedule);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, []);

  return { container, values };
}
