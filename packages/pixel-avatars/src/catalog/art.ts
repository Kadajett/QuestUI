export const ink = '#342c46'
export const white = '#fff7ec'

export function box(x: number, y: number, width: number, height: number): string {
  return `M${x} ${y}h${width}v${height}h-${width}z`
}

export function paint(color: string, ...paths: readonly string[]): string {
  return `<path fill="${color}" d="${paths.join('')}"/>`
}

export interface Palette {
  readonly id: string
  readonly label: string
  readonly base: string
  readonly shade: string
  readonly light: string
}

export const palettes: readonly Palette[] = Object.freeze([
  {id: 'cocoa', label: 'Cocoa', base: '#80523e', shade: '#513b36', light: '#b18058'},
  {id: 'midnight', label: 'Midnight', base: '#424c71', shade: '#292e49', light: '#7583aa'},
  {id: 'rose', label: 'Rose', base: '#dd7199', shade: '#a64777', light: '#ffb0bd'},
  {id: 'honey', label: 'Honey', base: '#e5b24f', shade: '#b47737', light: '#ffe6a0'},
  {id: 'mint', label: 'Mint', base: '#66b39b', shade: '#397d7d', light: '#a7e6ba'},
  {id: 'lilac', label: 'Lilac', base: '#a58ad6', shade: '#70559e', light: '#ddbcf5'},
  {id: 'copper', label: 'Copper', base: '#d57945', shade: '#954939', light: '#ffb671'},
  {id: 'sky', label: 'Sky', base: '#65a7d1', shade: '#3d699c', light: '#a4deeb'},
  {id: 'pearl', label: 'Pearl', base: '#e5dcd3', shade: '#a79bb3', light: '#fff7ec'},
  {id: 'berry', label: 'Berry', base: '#a44974', shade: '#663750', light: '#e08da3'},
].map(palette => Object.freeze(palette)))
