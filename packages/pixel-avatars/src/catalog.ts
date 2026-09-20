import {palettes, type Palette} from './catalog/art.ts'
import {hairStyles, hairArt} from './catalog/hair.ts'
import {eyeStyles, eyeArt} from './catalog/eyes.ts'
import {mouthStyles, faceDetails, faceArt} from './catalog/face.ts'
import {skinOptions} from './catalog/skin.ts'
import {clothingStyles, clothingArt} from './catalog/clothing.ts'
import {backgroundStyles, backgroundArt} from './catalog/background.ts'
import {avatarCategories, type AvatarCategoryId, type AvatarOption} from './types.ts'

interface Layer extends AvatarOption {readonly front: string; readonly back?: string}
function colored(category: AvatarCategoryId, styles: readonly string[], render: (style: number, palette: Palette) => string | {front: string; back: string}): readonly Layer[] {
  return Object.freeze(styles.flatMap((label, style) => palettes.map(palette => {
    const art = render(style, palette)
    return Object.freeze({id: `${category}-${style}-${palette.id}`, label: `${label} · ${palette.label}`, ...(typeof art === 'string' ? {front: art} : art)})
  })))
}
const layers: Readonly<Record<AvatarCategoryId, readonly Layer[]>> = Object.freeze({
  hair: colored('hair', hairStyles, hairArt),
  eyes: colored('eyes', eyeStyles, eyeArt),
  face: Object.freeze(mouthStyles.flatMap((mouth, m) => faceDetails.map((detail, d) => Object.freeze({id: `face-${m}-${d}`, label: `${mouth} · ${detail}`, front: faceArt(m, d)})))),
  skinColor: skinOptions,
  clothing: colored('clothing', clothingStyles, clothingArt),
  background: colored('background', backgroundStyles, backgroundArt),
})
export const avatarCatalogs = Object.freeze(Object.fromEntries(avatarCategories.map(category => [category, Object.freeze(layers[category].map(({id, label}) => Object.freeze({id, label})))]))) as Readonly<Record<AvatarCategoryId, readonly AvatarOption[]>>
const lookup = Object.freeze(Object.fromEntries(avatarCategories.map(category => [category, Object.freeze(Object.fromEntries(layers[category].map(layer => [layer.id, layer])))]))) as Readonly<Record<AvatarCategoryId, Readonly<Record<string, Layer>>>>

export function avatarLayer(category: AvatarCategoryId, id: unknown): Layer {
  if (typeof id !== 'string') throw new Error(`Unknown ${category} option: ${String(id)}`)
  const layer = lookup[category][id]
  if (!layer) throw new Error(`Unknown ${category} option: ${id}`)
  return layer
}
