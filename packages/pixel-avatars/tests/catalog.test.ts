import {describe, expect, it} from 'vitest'
import {avatarCatalogs, createAvatar, renderAvatarSvg, type AvatarCategoryId} from '../src/render'

const MIN_OPTIONS = 100
const categories = ['hair', 'eyes', 'face', 'skinColor', 'clothing', 'background'] as const satisfies readonly AvatarCategoryId[]


function baseSelection(): Record<AvatarCategoryId, string> {
  return Object.fromEntries(categories.map(name => [name, avatarCatalogs[name][0]?.id ?? ''])) as Record<AvatarCategoryId, string>
}
describe('avatar catalog guarantees', () => {
  for (const category of categories) {
    it(`offers at least ${MIN_OPTIONS} unique ${category} options`, () => {
      const options = avatarCatalogs[category]
      expect(options.length, `${category} count`).toBeGreaterThanOrEqual(MIN_OPTIONS)
      expect(new Set(options.map(option => option.id)).size, `${category} unique ids`).toBe(options.length)
    })
  }

  it('renders every option of every category with a distinct visual signature', () => {
    for (const category of categories) {
      const base = baseSelection()
      const signatures = new Set<string>()
      for (const option of avatarCatalogs[category]) {
        const svg = renderAvatarSvg({...base, [category]: option.id})
        expect(svg).toMatch(/^<svg /)
        expect(svg).not.toMatch(/<script|onerror|javascript:/i)
        signatures.add(svg)
      }
      expect(signatures.size, `${category} distinct renders`).toBe(avatarCatalogs[category].length)
    }
  })
})

describe('createAvatar determinism', () => {
  it('returns identical selections for identical seeds', () => {
    expect(createAvatar('quest-42')).toEqual(createAvatar('quest-42'))
    expect(createAvatar(7)).toEqual(createAvatar(7))
  })

  it('spreads seeds across at least half of each catalog', () => {
    const seen = {hair: new Set<string>(), eyes: new Set<string>(), face: new Set<string>(), skinColor: new Set<string>(), clothing: new Set<string>(), background: new Set<string>()}
    for (let seed = 0; seed < 500; seed++) {
      const selection = createAvatar(seed)
      for (const category of categories) seen[category].add(selection[category])
    }
    for (const category of categories) {
      expect(seen[category].size, `${category} coverage`).toBeGreaterThanOrEqual(50)
    }
  })

  it('rejects unknown option ids and malformed selections', () => {
    const selection = createAvatar('valid')
    expect(() => renderAvatarSvg({...selection, hair: 'does-not-exist'})).toThrow(/unknown hair/i)
    expect(() => renderAvatarSvg({...selection, background: undefined as unknown as string})).toThrow(/background/)
  })
})
