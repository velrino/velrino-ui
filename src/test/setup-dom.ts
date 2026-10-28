import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'https://example.test/gallery?language=en',
  pretendToBeVisual: true,
});
const browser = dom.window as unknown as Record<string, unknown>;
for (const key of [
  'window',
  'document',
  'navigator',
  'HTMLElement',
  'HTMLInputElement',
  'HTMLButtonElement',
  'Element',
  'Node',
  'NodeFilter',
  'DocumentFragment',
  'MutationObserver',
  'Event',
  'CustomEvent',
  'MouseEvent',
  'KeyboardEvent',
  'FocusEvent',
  'getComputedStyle',
]) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    writable: true,
    value: key === 'window' ? dom.window : browser[key],
  });
}
Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
  value: true,
  configurable: true,
  writable: true,
});
Object.defineProperty(globalThis, 'requestAnimationFrame', {
  value: dom.window.requestAnimationFrame.bind(dom.window),
  configurable: true,
});
Object.defineProperty(globalThis, 'cancelAnimationFrame', {
  value: dom.window.cancelAnimationFrame.bind(dom.window),
  configurable: true,
});
window.scrollTo = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};

const motion = new window.EventTarget() as MediaQueryList;
Object.defineProperty(motion, 'matches', { value: false, writable: true, configurable: true });
window.matchMedia = () => motion;
export function setReducedMotion(matches: boolean) {
  Object.defineProperty(motion, 'matches', { value: matches, writable: true, configurable: true });
  motion.dispatchEvent(new window.Event('change'));
}
