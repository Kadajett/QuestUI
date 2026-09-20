import {box, ink, paint, white, type Palette} from './art.ts'

export const eyeStyles = ['Round', 'Dreamy', 'Bright', 'Curious', 'Sleepy', 'Cat', 'Wink', 'Sparkle', 'Round glasses', 'Square glasses'] as const

function eyePair(shape: string): string {
  return `<g transform="translate(17 24)">${shape}</g><g transform="translate(28 24)">${shape}</g>`
}

const shapes = [
  'M0 0h4v5H0z', 'M0 1h4v4H0z', 'M0 0h4v6H0z', 'M0 0h4v4H0z',
  'M0 2h4v3H0z', 'M0 1h1V0h4v4H1V3H0z',
  'M0 0h4v5H0z', 'M0 0h4v5H0z', 'M0 0h4v5H0z', 'M0 0h4v5H0z',
] as const

const accents = [
  '',
  paint(ink, box(17, 22, 4, 1), box(28, 22, 4, 1)),
  paint(ink, box(16, 23, 1, 3), box(32, 23, 1, 3)),
  paint(ink, box(17, 21, 4, 1), box(28, 22, 4, 1)),
  paint(ink, box(16, 25, 6, 1), box(27, 25, 6, 1)),
  paint(ink, box(16, 24, 2, 1), box(31, 24, 2, 1)),
  '',
  paint(white, box(18, 26, 2, 1), box(19, 25, 1, 3), box(29, 26, 2, 1), box(30, 25, 1, 3)),
  `<path fill="none" stroke="${ink}" stroke-width="1" d="M16 23h5v1h1v5h-1v1h-5v-1h-1v-5h1zM27 23h5v1h1v5h-1v1h-5v-1h-1v-5h1zM22 25h4"/>`,
  `<path fill="none" stroke="${ink}" stroke-width="1" d="M15 23h8v7h-8zM26 23h8v7h-8zM23 25h3"/>`,
] as const

export function eyeArt(style: number, palette: Palette): string {
  const shapesArt = shapes[style] ?? ''
  const accentsArt = accents[style] ?? ''
  const iris = paint(palette.base, box(1, style === 4 ? 3 : 2, 2, 2))
  const eye = paint(ink, shapesArt) + iris + paint(white, box(1, style === 4 ? 2 : 1, 1, 1))
  if (style === 6) {
    return `<g transform="translate(17 24)">${eye}</g>`
      + paint(ink, 'M28 26h4v1h-3v1h-1z')
      + paint(palette.base, box(28, 28, 4, 1))
  }
  return eyePair(eye) + accents[style]
}
