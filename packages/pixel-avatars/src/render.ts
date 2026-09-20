import {avatarCatalogs, avatarLayer} from './catalog.ts'
import {avatarCategories, type AvatarSelection} from './types.ts'
export {avatarCatalogs} from './catalog.ts'
export type {AvatarCategoryId, AvatarOption, AvatarSelection} from './types.ts'
export {avatarCategories} from './types.ts'

export function createAvatar(seed: string | number): AvatarSelection {
  if (typeof seed !== 'string' && typeof seed !== 'number') throw new TypeError('Avatar seed must be a string or number')
  if (typeof seed === 'number' && !Number.isFinite(seed)) throw new TypeError('Avatar seed must be finite')
  const text = `${typeof seed}:${seed}`
  let state = 2166136261
  for (let index = 0; index < text.length; index++) state = Math.imul(state ^ text.charCodeAt(index), 16777619)
  const selected = avatarCategories.map(category => {
    state += 0x6d2b79f5
    let value = Math.imul(state ^ state >>> 15, state | 1)
    value ^= value + Math.imul(value ^ value >>> 7, value | 61)
    const random = (value ^ value >>> 14) >>> 0
    const options = avatarCatalogs[category]
    const chosen = options?.[random % (options?.length ?? 1)]
    return [category, chosen?.id ?? '']
  })
  return Object.freeze(Object.fromEntries(selected)) as AvatarSelection
}

export function renderAvatarSvg(selection: AvatarSelection): string {
  if (!selection || typeof selection !== 'object') throw new TypeError('Avatar selection must be an object')
  const hair = avatarLayer('hair', selection.hair)
  const skin = avatarLayer('skinColor', selection.skinColor)
  const clothing = avatarLayer('clothing', selection.clothing)
  const eyes = avatarLayer('eyes', selection.eyes)
  const face = avatarLayer('face', selection.face)
  const background = avatarLayer('background', selection.background)
  return '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" shape-rendering="crispEdges">'
    + background.front + (hair.back ?? '') + skin.front + clothing.front + hair.front + eyes.front + face.front + '</svg>'
}
