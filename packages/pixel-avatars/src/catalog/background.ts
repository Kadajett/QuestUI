import {box, paint, type Palette} from './art.ts'

export const backgroundStyles = ['Plain', 'Stripes', 'Checkers', 'Dots', 'Stars', 'Horizon', 'Diamond', 'Frame', 'Confetti', 'Steps'] as const
const patterns = [
  '',
  Array.from({length: 6}, (_, i) => box(i * 8, 0, 3, 48)).join(''),
  Array.from({length: 36}, (_, i) => (Math.floor(i / 6) + i % 6) % 2 ? box(i % 6 * 8, Math.floor(i / 6) * 8, 8, 8) : '').join(''),
  Array.from({length: 36}, (_, i) => box(i % 6 * 8 + 2, Math.floor(i / 6) * 8 + 2, 2, 2)).join(''),
  'M6 3h2v3h3v2H8v3H6V8H3V6h3zM39 5h2v3h3v2h-3v3h-2v-3h-3V8h3zM4 34h2v3h3v2H6v3H4v-3H1v-2h3z',
  box(0, 26, 48, 22),
  'M23 0h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v4h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-4v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2H7v-2H5v-2H3v-2H1v-4h2v-2h2v-2h2v-2h2v-2h2v-2h2v-2h2v-2h2V6h2V4h2V2h2z',
  box(2, 2, 44, 2) + box(2, 44, 44, 2) + box(2, 4, 2, 40) + box(44, 4, 2, 40),
  box(4, 5, 4, 2) + box(38, 18, 2, 5) + box(8, 30, 3, 3) + box(32, 3, 4, 2) + box(39, 39, 5, 2),
  'M0 10h8v8h8v8h8v8h8v8h8v6H0z',
]
export function backgroundArt(style: number, palette: Palette): string {
  return paint(palette.light, box(0, 0, 48, 48)) + (patterns[style] ? paint(palette.base, patterns[style]) : '')
}
