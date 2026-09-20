import {box, ink, paint} from './art.ts'

// Ten natural tone families, each with ten visibly stepped warm/cool undertones.
const skinFamilies = [
  ['Porcelain', 96, 26], ['Ivory', 89, 30], ['Peach', 82, 23], ['Sand', 75, 31], ['Golden', 68, 28],
  ['Honey', 61, 25], ['Caramel', 54, 24], ['Chestnut', 47, 22], ['Umber', 39, 20], ['Espresso', 31, 18],
] as const
const undertones = ['Cool rose', 'Rose', 'Pink', 'Peach', 'Apricot', 'Neutral', 'Warm', 'Golden', 'Olive', 'Amber'] as const

// Near-white colors erase hue differences. Keep Porcelain light, but give each
// undertone enough chroma and value separation to survive a 48px raster.
const porcelain = [
  [345, 45, 92], [355, 48, 90], [5, 50, 88], [15, 55, 91], [24, 60, 88],
  [28, 28, 90], [32, 45, 86], [40, 52, 88], [48, 30, 85], [30, 55, 84],
] as const

export const skinOptions = Object.freeze(skinFamilies.flatMap(([name, light, hue], family) =>
  undertones.map((undertone, tone) => {
    const chosen: readonly [number, number, number] = family === 0
      ? porcelain[tone] ?? [26, 26, light]
      : [hue - 12 + tone * 3, 30 + tone * 3, light]
    const [h, s, l] = chosen
    const color = `hsl(${h} ${s}% ${l}%)`
    const shade = `hsl(${h} ${s}% ${l - 13}%)`
    const highlight = `hsl(${h} ${s}% ${Math.min(l + 7, 98)}%)`
    return Object.freeze({
      id: `skin-${family}-${tone}`,
      label: `${name} · ${undertone}`,
      front: paint(ink, 'M16 16h16v3h3v5h3v7h-3v3h-3v3h-5v4h-6v-4h-5v-3h-3v-3h-3v-7h3v-5h3z')
        + paint(shade, box(21, 34, 6, 7), box(11, 25, 3, 5), box(34, 25, 3, 5))
        + paint(color, 'M17 17h14v3h3v13h-3v3H17v-3h-3V20h3z')
        + paint(highlight, box(17, 21, 3, 2))
        + paint(shade, box(24, 29, 2, 2), box(17, 34, 14, 2)),
    })
  }),
))
