import {box, ink, paint, white, type Palette} from './art.ts'

export const clothingStyles = ['Cozy sweater', 'Overalls', 'Sailor shirt', 'Hoodie', 'Capelet', 'Scarf coat', 'Heart tee', 'Dungaree dress', 'Knight tunic', 'Bow blouse'] as const

const bodies = [
  'M17 38h14v2h5v3h3v5H9v-5h3v-3h5z',
  'M17 38h14v2h5v3h2v5H10v-5h2v-3h5z',
  'M16 38h16v2h4v3h3v5H9v-5h3v-3h4z',
  'M17 37h14v2h4v3h3v6H10v-6h3v-3h4z',
  'M18 37h12v2h3v2h3v3h3v4H9v-4h3v-3h3v-2h3z',
  'M17 38h14v2h4v3h2v5H11v-5h2v-3h4z',
  'M17 38h14v2h5v3h4v5H8v-5h4v-3h5z',
  'M18 38h12v2h4v4h2v4H12v-4h2v-4h4z',
  'M17 38h14v2h5v2h3v6H9v-6h3v-2h5z',
  'M17 38h14v2h5v3h3v5H9v-5h3v-3h5z',
] as const

function clothingDetail(style: number, palette: Palette): string {
  const trim = palette.light
  const details = [
    paint(trim, box(18, 39, 12, 2), box(13, 44, 22, 2)) + paint(palette.shade, box(15, 42, 2, 6), box(31, 42, 2, 6)),
    paint(white, box(15, 40, 18, 8)) + paint(palette.base, box(18, 39, 3, 9), box(27, 39, 3, 9), box(20, 43, 8, 5)) + paint('#f5ce70', box(19, 42, 1, 1), box(28, 42, 1, 1)),
    paint(white, 'M17 39h5v3h4v-3h5v3h-3v2h-8v-2h-3z', box(12, 46, 24, 1)) + paint(palette.shade, box(23, 43, 2, 5)),
    paint(palette.shade, 'M17 39h3v3h8v-3h3v5H17z', box(19, 46, 10, 2)) + paint(white, box(20, 42, 1, 3), box(27, 42, 1, 3)),
    paint(trim, 'M18 38h3v3h6v-3h3v4h3v3h3v2H12v-2h3v-3h3z') + paint(palette.shade, box(23, 42, 2, 6)) + paint('#f5ce70', box(23, 41, 2, 2)),
    paint(trim, box(17, 39, 14, 3), box(27, 41, 4, 7)) + paint(palette.shade, box(23, 43, 1, 5)) + paint(white, box(24, 44, 1, 1), box(24, 47, 1, 1)),
    paint(trim, 'M19 42h3v1h4v-1h3v3h-2v1h-2v1h-2v-1h-2v-1h-2z'),
    paint(white, box(16, 40, 16, 4)) + paint(palette.shade, box(18, 39, 3, 9), box(27, 39, 3, 9), box(21, 44, 6, 4)) + paint(trim, box(22, 45, 4, 2)),
    paint('#cbd2dd', box(11, 41, 6, 3), box(31, 41, 6, 3)) + paint(trim, box(22, 40, 4, 7), box(19, 42, 10, 2)) + paint(palette.shade, box(13, 47, 22, 1)),
    paint(white, 'M17 39h5v2h4v-2h5v3h-4v1h-5v-1h-5z') + paint(palette.shade, 'M20 42h3v1h2v-1h3v3h-3v-1h-2v1h-3z') + paint(trim, box(24, 46, 1, 1)),
  ]
  return details[style] ?? ''
}

export function clothingArt(style: number, palette: Palette): string {
  const body = bodies[style] ?? ''
  return paint(ink, body) + `<g transform="translate(0 1)">${paint(palette.base, body)}</g>`
    + clothingDetail(style, palette)
}
