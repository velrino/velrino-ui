import assert from 'node:assert/strict';
import test from 'node:test';
import { formatColor } from './format-color.js';

test('solid CSS colors use six-digit HEX while transparency remains explicit', () => {
  assert.equal(formatColor('rgb(66, 232, 244)'), '#42E8F4');
  assert.equal(formatColor('rgb(100% 0% 50% / 100%)'), '#FF0080');
  assert.equal(formatColor('rgba(66, 232, 244, 0.3)'), 'rgba(66, 232, 244, 0.3)');
  assert.equal(formatColor('rgb(66 232 244 / 30%)'), 'rgba(66, 232, 244, 0.3)');
  assert.equal(formatColor('rgba(0, 0, 0, 0)'), 'rgba(0, 0, 0, 0)');
});

test('resolved color-mix sRGB values round to the actual channel values', () => {
  assert.equal(
    formatColor('color(srgb 0.258824 0.909804 0.956863 / 0.3)'),
    'rgba(66, 232, 244, 0.3)',
  );
  assert.equal(formatColor('color(srgb 0.356863 0.129412 0.713725)'), '#5B21B6');
});

test('other color spaces and unsupported expressions retain their CSS representation', () => {
  for (const value of [
    'oklch(0.7 0.2 30)',
    'color(display-p3 1 0 0)',
    'rgb(none 0 0)',
    'var(--brand-color)',
  ]) {
    assert.equal(formatColor(value), value);
  }
});
