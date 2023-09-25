type Opacity = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;

export function addAlphaTo6DigitsHexColor(color: string, opacity: Opacity = 1) {
  const alpha = Math.round(Math.min(Math.max(opacity, 0), 1) * 255);
  return color + alpha.toString(16).toUpperCase();
}
