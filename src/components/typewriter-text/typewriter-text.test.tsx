import { setReducedMotion } from '../../test/setup-dom.js';
import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { cleanup, render } from '@testing-library/react';
import { TypewriterText } from './index.js';
import { segmentTypewriterText } from './use-typewriter-text.js';

afterEach(() => {
  cleanup();
  setReducedMotion(false);
});

test('typewriter segments joined emoji, flag pairs and combining marks as complete graphemes', () => {
  const text = 'A👩🏽‍🚀🇧🇷é';
  assert.deepEqual(segmentTypewriterText(text), ['A', '👩🏽‍🚀', '🇧🇷', 'é']);
  const original = Object.getOwnPropertyDescriptor(Intl, 'Segmenter');
  Object.defineProperty(Intl, 'Segmenter', { value: undefined, configurable: true });
  try {
    assert.deepEqual(segmentTypewriterText(text), ['A', '👩🏽‍🚀', '🇧🇷', 'é']);
  } finally {
    if (original) Object.defineProperty(Intl, 'Segmenter', original);
  }
});

test('reduced motion shows final text immediately while preserving one accessible copy', () => {
  setReducedMotion(true);
  const text = 'Explore 👩🏽‍🚀';
  const view = render(<TypewriterText text={text} />);
  assert.equal(view.container.querySelector('.vui-typewriter-text__visible')?.textContent, text);
  const accessible = view.container.querySelector('.vui-typewriter-text__accessible');
  assert.equal(accessible?.textContent, text);
  assert.equal(accessible?.getAttribute('aria-hidden'), null);
});

test('unmount cancels a pending animation timer', () => {
  const originalSet = window.setTimeout;
  const originalClear = window.clearTimeout;
  const active = new Set<number>();
  window.setTimeout = ((handler: TimerHandler, delay?: number) => {
    const id = Reflect.apply(originalSet, window, [handler, delay]) as number;
    active.add(id);
    return id;
  }) as unknown as typeof window.setTimeout;
  window.clearTimeout = ((id?: number) => {
    if (id !== undefined) active.delete(id);
    Reflect.apply(originalClear, window, [id]);
  }) as typeof window.clearTimeout;
  try {
    const view = render(<TypewriterText text="A long running animation" delayMs={100} />);
    assert.ok(active.size > 0);
    view.unmount();
    assert.equal(active.size, 0);
  } finally {
    window.setTimeout = originalSet;
    window.clearTimeout = originalClear;
  }
});
