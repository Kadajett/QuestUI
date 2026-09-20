import {paint, type Palette} from './art.ts'

// Rear silhouettes are drawn behind the head; fringes stay above the eyes.
// Each combination changes geometry at a fixed palette, not just its label.
const cuts = [
  ['Jaw bob', 'M12 15h24v18h-4v3h-4V22h-8v14h-4v-3h-4z'],
  ['Shoulder bob', 'M11 15h26v24h-5v3h-5V22h-6v20h-5v-3h-5z'],
  ['Asymmetric bob', 'M11 15h26v27h-6V23H18v10h-7z'],
  ['Long straight', 'M11 15h26v30h-9V22h-8v23h-9z'],
  ['Flared waves', 'M12 15h24v12h3v7h3v8h-5v3H27V22h-6v23H11v-3H6v-8h3v-7h3z'],
  ['Layered shag', 'M12 14h24v8h3v6h-3v5h4v5h-7v5h-6V22h-6v21h-6v-5H8v-5h4v-5H9v-6h3z'],
  ['Twin braids', 'M12 15h24v10h-2v4h3v5h-3v4h3v6h-8v-6h-2v-5h3v-5h-2v-6h-8v6h-2v5h3v5h-2v6h-8v-6h3v-4h-3v-5h3v-4h-2z'],
  ['High twin tails', 'M6 9h10v7h16V9h10v10h3v22h-8v-9h2V21h-7v2H16v-2H9v11h2v9H3V19h3z'],
  ['Low twin tails', 'M11 15h26v12h7v15h-5v3h-7V29H16v16H9v-3H4V27h7z'],
  ['Side ponytail', 'M12 15h22V9h8v5h3v24h-3v6h-9v-8h4V22h-3v2H12z'],
  ['Afro halo', 'M14 6h20v3h6v5h4v18h-4v6h-8v-3H16v3H8v-6H4V14h4V9h6z'],
  ['Afro puffs', 'M5 5h10v3h4v7h10V8h4V5h10v4h4v12h-4v5H33v-4H15v4H5v-5H1V9h4z'],
  ['Topknot', 'M19 2h10v3h4v8h-4v6H19v-6h-4V5h4zM12 16h24v12h-5V22H17v6h-5z'],
  ['Low double buns', 'M12 16h24v11h5v4h3v10h-4v4h-9v-4h-3V24h-8v17h-3v4H8v-4H4V31h3v-4h5z'],
  ['Long locs', 'M11 13h26v10h3v19h-5V28h-2v17h-5V23h-8v22h-5V28h-2v14H8V23h3z'],
  ['Mullet', 'M13 15h22v14h3v14h-7v3H17v-3h-7V29h3z'],
  ['Loop braids', 'M7 12h10v5h14v-5h10v28H29V25H19v15H7zM11 20v15h4V20zM33 20v15h4V20z'],
  ['Rolled updo', 'M10 6h28v4h5v12h-6v5h-5V19H16v8h-5v-5H5V10h5z'],
] as const

const fringes = [
  ['Blunt fringe', 'M14 12h4V9h12v3h4v3h2v8h-5v-3H17v3h-5v-8h2z', 'M18 13h12v2H18z'],
  ['Curtain fringe', 'M14 12h4V9h12v3h4v3h2v8h-6v-5h-3v-4h-6v4h-3v5h-6v-8h2z', 'M16 14h4v2h-4zM28 14h4v2h-4z'],
  ['Swept fringe', 'M14 12h4V9h12v3h4v3h2v7h-5v-8h-3v3h-4v3h-5v3h-7v-8h2z', 'M18 12h10v2H18z'],
  ['Pointed fringe', 'M14 12h4V9h12v3h4v3h2v7h-5v-5h-3v3h-2v3h-4v-3h-2v-3h-3v5h-5v-7h2z', 'M18 12h12v2H18z'],
  ['Choppy fringe', 'M14 12h3V8h5v2h4V7h5v5h3v3h2v7h-4v-5h-3v3h-4v-4h-3v5h-4v-4h-2v5h-4v-7h2z', 'M18 11h3v2h-3zM27 10h3v2h-3z'],
] as const

const geometry = Object.freeze(cuts.flatMap(([cut, back]) => fringes.map(([fringe, front, shine]) =>
  Object.freeze({label: `${cut} · ${fringe}`, back, front, shine}),
)))
export const cutNames: readonly string[] = Object.freeze(geometry.map(cut => cut.label))

function outlined(path: string, color: string): string {
  return `<path fill="${color}" stroke="#342c46" stroke-width="2" stroke-linejoin="miter" fill-rule="evenodd" d="${path}"/>`
}

export function cutArt(index: number, palette: Palette): {back: string; front: string} {
  const cut = geometry[index] ?? {label: '', back: '', front: '', shine: ''}
  return {
    back: outlined(cut.back, palette.shade),
    front: outlined(cut.front, palette.base) + paint(palette.light, cut.shine),
  }
}
