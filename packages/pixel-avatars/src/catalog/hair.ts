import {box, ink, paint, type Palette} from './art.ts'
import {cutArt, cutNames} from './hair-cuts.ts'

export const hairStyles = ['Pixie', 'Bob', 'Twin buns', 'Ponytail', 'Long waves', 'Side sweep', 'Coils', 'Braids', 'Spiky', 'Space buns', ...cutNames] as const

const crowns = [
  'M15 12h4v-2h10v2h4v4h2v5h-5v-4h-4v2h-5v-2h-5v4h-3v-6h2z',
  'M14 12h4v-2h12v2h4v3h2v20h-5V18h-5v3h-5v-3h-4v17h-5V15h2z',
  'M15 12h4v-2h10v2h4v4h2v5h-4v-4h-6v3h-5v-3h-5v4h-2v-6h2z',
  'M14 13h4v-3h12v3h4v4h2v4h-5v-3h-4v2h-5v-3h-7v4h-3v-6h2z',
  'M14 12h4v-2h12v2h4v4h2v6h-4v-5h-5v2h-6v-2h-5v5h-4v-6h2z',
  'M15 12h4v-3h10v3h5v4h2v6h-4v-5h-3v3h-4v2h-5v-3h-5v3h-3v-6h3z',
  'M13 13h3v-3h5V8h7v2h5v3h3v8h-4v-3h-4v3h-5v-3h-4v3h-6z',
  'M14 13h4v-3h12v3h4v8h-4v-4h-5v3h-3v-3h-4v4h-4z',
  'M12 16h3v-5h4V8h4v3h4V7h4v5h4v4h3v5h-6v-4h-5v3h-4v-3h-5v4h-6z',
  'M14 13h5v-3h10v3h5v8h-4v-4h-5v2h-3v-2h-4v4h-4z',
] as const

const backs = [
  '',
  'M12 17h24v18h-3v3h-5V24h-8v14h-5v-3h-3z',
  'M7 12h8v10H7zM33 12h8v10h-8z',
  'M32 12h7v4h3v20h-3v5h-6v-7h3V20h-4z',
  'M12 17h24v12h2v11h-4v3h-7V25h-6v18h-7v-3h-4V29h2z',
  'M12 18h5v14h-5zM31 18h5v14h-5z',
  'M10 15h5v-4h18v4h5v7h-3v9h-4V22H17v9h-4v-9h-3z',
  'M12 17h5v10h-1v4h1v4h-1v4h-5v-4h1v-4h-1v-4h1zM31 17h5v10h1v4h-1v4h1v4h-5v-4h-1v-4h1v-4h-1z',
  '',
  'M8 8h8v3h3v6H8zM32 8h8v9H29v-6h3z',
] as const

export function hairArt(style: number, palette: Palette): {back: string; front: string} {
  if (style >= crowns.length) return cutArt(style - crowns.length, palette)
  const back = backs[style] ?? ''
  const crown = crowns[style] ?? ''
  const rear = back ? paint(ink, back) + `<g transform="translate(1 0)">${paint(palette.shade, back)}</g>` : ''
  const front = paint(ink, crown) + `<g transform="translate(0 1)">${paint(palette.base, crown)}</g>`
    + paint(palette.light, box(19, 12, 8, 2), box(16, 14, 3, 2))
    + paint(palette.shade, box(31, 16, 2, 4))
  return {back: rear, front}
}
