/** Keep non-sRGB CSS notation intact rather than misrepresenting its gamut. */
export function formatColor(value: string): string {
  const source = value.trim();
  const rgb = /^rgba?\(([^)]+)\)$/i.exec(source);
  const srgb = /^color\(srgb\s+([^)]+)\)$/i.exec(source);
  if (!rgb && !srgb) return source;

  const parts = (rgb?.[1] ?? srgb![1])
    .replaceAll(',', ' ')
    .replaceAll('/', ' ')
    .trim()
    .split(/\s+/);
  if (parts.length < 3 || parts.length > 4) return source;
  const channels = parts.slice(0, 3).map((part) => {
    const number = Number(part.endsWith('%') ? part.slice(0, -1) : part);
    const scaled = part.endsWith('%') ? (number * 255) / 100 : srgb ? number * 255 : number;
    return Math.round(Math.max(0, Math.min(255, scaled)));
  });
  const opacity = parts[3];
  const alpha =
    opacity === undefined
      ? 1
      : Number(opacity.endsWith('%') ? opacity.slice(0, -1) : opacity) /
        (opacity.endsWith('%') ? 100 : 1);
  if (![...channels, alpha].every(Number.isFinite)) return source;
  if (alpha >= 1)
    return `#${channels
      .map((channel) => channel.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()}`;
  const roundedAlpha = Math.round(Math.max(0, alpha) * 1000) / 1000;
  return `rgba(${channels.join(', ')}, ${roundedAlpha})`;
}
