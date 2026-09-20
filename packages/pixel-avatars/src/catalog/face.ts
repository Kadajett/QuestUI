import {box, ink, paint, white} from './art.ts'

export const mouthStyles = ['Smile', 'Grin', 'Tiny smile', 'Surprised', 'Cat smile', 'Laugh', 'Pout', 'Toothy', 'Tongue out', 'Content'] as const
export const faceDetails = ['Rosy cheeks', 'Freckles', 'Heart cheeks', 'Star cheeks', 'Nose bandage', 'Whiskers', 'Beauty mark', 'Blush stripes', 'Rainbow cheeks', 'Cheek diamonds'] as const

const mouths = [
  paint(ink, 'M21 32h2v1h3v-1h2v2h-2v1h-3v-1h-2z'),
  paint(ink, box(21, 32, 7, 4)) + paint(white, box(22, 32, 5, 2)),
  paint(ink, box(23, 33, 3, 1)),
  paint(ink, box(23, 32, 3, 4)) + paint('#d77b8c', box(24, 34, 1, 1)),
  paint(ink, 'M20 32h1v1h2v-1h2v1h2v-1h1v2h-3v-1h-1v1h-4z'),
  paint(ink, 'M21 32h7v3h-2v1h-3v-1h-2z') + paint('#ec91a0', box(23, 34, 3, 1)),
  paint('#a8586e', box(23, 32, 3, 1), box(24, 33, 3, 1)),
  paint(ink, box(21, 32, 7, 3)) + paint(white, box(22, 32, 2, 2), box(25, 32, 2, 2)),
  paint(ink, box(21, 32, 7, 2)) + paint('#e97d9b', box(24, 33, 3, 3)),
  paint(ink, box(22, 32, 1, 1), box(23, 33, 3, 1), box(26, 32, 1, 1)),
] as const

const details = [
  paint('#e9949b', box(15, 30, 5, 2), box(29, 30, 5, 2)),
  paint('#9d624e', box(16, 30, 1, 1), box(19, 31, 1, 1), box(18, 29, 1, 1), box(29, 31, 1, 1), box(32, 30, 1, 1), box(30, 29, 1, 1)),
  paint('#d66588', 'M15 29h2v1h1v-1h2v2h-1v1h-1v1h-1v-1h-1v-1h-1zM29 29h2v1h1v-1h2v2h-1v1h-1v1h-1v-1h-1v-1h-1z'),
  paint('#d99b38', 'M17 28h1v2h2v1h-2v2h-1v-2h-2v-1h2zM31 28h1v2h2v1h-2v2h-1v-2h-2v-1h2z'),
  paint('#fff1ca', box(21, 29, 7, 2)) + paint('#d29b77', box(23, 29, 1, 2), box(25, 29, 1, 2)),
  paint('#855b6d', box(14, 29, 5, 1), box(15, 31, 4, 1), box(30, 29, 5, 1), box(30, 31, 4, 1)),
  paint(ink, box(30, 32, 1, 1)) + paint('#d98b96', box(15, 30, 4, 1)),
  paint('#d97b8d', box(15, 29, 1, 3), box(17, 29, 1, 3), box(19, 29, 1, 3), box(29, 29, 1, 3), box(31, 29, 1, 3), box(33, 29, 1, 3)),
  paint('#e68b98', box(15, 29, 5, 1), box(29, 29, 5, 1)) + paint('#eac576', box(15, 30, 5, 1), box(29, 30, 5, 1)) + paint('#70b2ae', box(15, 31, 5, 1), box(29, 31, 5, 1)),
  paint('#9e87ce', 'M17 28h1v1h1v1h1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h1v-1h1zM31 28h1v1h1v1h1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h1v-1h1z'),
] as const

export function faceArt(mouth: number, detail: number): string {
  return (details[detail] ?? '') + (mouths[mouth] ?? '')
}
