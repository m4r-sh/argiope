import { converter } from "culori";
import { maxChromaAt, sequential, ramp } from "cusphanger";
import { oklchSrgb } from "nutelch";

export const SHADE_NAMES = [
  "darkest", "dim", "muted", "soft", "main", "accent", "bright", "light",
  "gray_dim", "gray", "gray_light", "gray_warm",
];

const toOklch = converter("oklch");

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const normalizeHue = value => ((Number(value) % 360) + 360) % 360;
export const formatOklch = color => `oklch(${(color.l * 100).toFixed(2)}% ${color.c.toFixed(4)} ${normalizeHue(color.h).toFixed(2)})`;

export const adjustedSaturation = (baseline, offset) => offset < 0
  ? baseline * (1 + offset / 50)
  : baseline + (1 - baseline) * (offset / 50);

export const saturationOffsetFor = (baseline, target) => target < baseline
  ? (baseline === 0 ? 0 : 50 * (target / baseline - 1))
  : (baseline === 1 ? 0 : 50 * ((target - baseline) / (1 - baseline)));

function centeredRange(min, max, spread, offset) {
  const center = (min + max) / 2 + offset / 100;
  const radius = ((max - min) / 2) * (spread / 100);
  return [clamp(center - radius, 0.02, 0.98), clamp(center + radius, 0.02, 0.98)];
}

function hueList(hue, spread, total) {
  return Array.from({ length: total }, (_, index) =>
    normalizeHue(hue - spread / 2 + spread * (index / (total - 1))));
}

export function deriveRamp(generator, palette) {
  const lRange = centeredRange(
    generator.lMin,
    generator.lMax,
    palette.spread,
    palette.luminanceOffset,
  );
  const neutralRange = centeredRange(
    generator.neutralLMin,
    generator.neutralLMax,
    palette.spread,
    palette.luminanceOffset,
  );
  const baseline = generator.saturation * palette.saturationScale;
  const saturation = clamp(adjustedSaturation(baseline, palette.saturationOffset), 0, 1);
  let chromatic = ramp({
    hStart: palette.hue,
    hueList: hueList(palette.hue, palette.baseHueSpread + palette.hueSpread, 8),
    total: 8,
    lut: oklchSrgb,
    saturation,
    lRange,
  });
  if (generator.fullSaturation) {
    chromatic = chromatic.map(color => ({
      ...color,
      c: maxChromaAt(color.h, color.l, oklchSrgb) * saturation,
    }));
  }
  let neutral = sequential({
    hStart: palette.neutralHue,
    total: 3,
    lut: oklchSrgb,
    saturation: clamp(
      generator.neutralSaturation + palette.saturationOffset / 500,
      0,
      1,
    ),
    lRange: neutralRange,
  });
  const warm = sequential({
    hStart: palette.hue,
    total: 1,
    lut: oklchSrgb,
    saturation: clamp(
      generator.neutralSaturation + palette.saturationOffset / 500,
      0,
      1,
    ),
    lRange: [neutral[1].l, neutral[1].l],
  })[0];
  neutral = [...neutral, warm];
  const resolved = palette.reverse
    ? [...chromatic].reverse().concat([neutral[2], neutral[1], neutral[0], neutral[1]])
    : [...chromatic, ...neutral];
  return Object.fromEntries(
    SHADE_NAMES.map((name, index) => [name, formatOklch(resolved[index])]),
  );
}

export function transformColor(color, saturationOffset, luminanceOffset) {
  const source = toOklch(color);
  const hue = Number.isFinite(source.h) ? source.h : 0;
  const lightness = clamp(source.l + luminanceOffset / 100, 0.02, 0.98);
  const sourceMaximum = maxChromaAt(hue, source.l, oklchSrgb);
  const saturation = sourceMaximum > 0 ? clamp(source.c / sourceMaximum, 0, 1) : 0;
  const adjusted = clamp(adjustedSaturation(saturation, saturationOffset), 0, 1);
  return formatOklch({
    mode: "oklch",
    l: lightness,
    c: maxChromaAt(hue, lightness, oklchSrgb) * adjusted,
    h: hue,
  });
}
