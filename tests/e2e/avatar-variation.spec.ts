import {expect, test} from '@playwright/test'
import {avatarCatalogs, createAvatar, renderAvatarSvg} from '../../packages/pixel-avatars/src/render'

const fixed = {...createAvatar(0), hair: 'hair-0-cocoa', eyes: 'eyes-0-cocoa', face: 'face-0-0', skinColor: 'skin-0-0', clothing: 'clothing-0-cocoa', background: 'background-0-sky'}

test('hair offers 100 different rendered geometries without changing color', async ({page}) => {
  const hair = avatarCatalogs.hair.filter(option => option.id.endsWith('-cocoa'))
  const images = hair.map(option => renderAvatarSvg({...fixed, hair: option.id}))
  const distinct = await page.evaluate(async images => {
    const signatures = new Set<string>()
    for (const svg of images) {
      const img = new Image()
      img.src = `data:image/svg+xml,${encodeURIComponent(svg)}`
      await img.decode()
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 48
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas unavailable')
      context.drawImage(img, 0, 0)
      signatures.add(canvas.toDataURL())
    }
    return signatures.size
  }, images)
  expect(distinct).toBeGreaterThanOrEqual(100)
})

test('Porcelain selections visibly change the same avatar cheek pixels', async ({page}) => {
  await page.goto('/demo')
  const colors: number[][] = []
  const selector = page.getByRole('combobox', {name: 'Avatar skin color', exact: true})
  await page.getByRole('combobox', {name: 'Avatar hair', exact: true}).selectOption(fixed.hair)
  for (let tone = 0; tone < 10; tone++) {
    await selector.selectOption(`skin-0-${tone}`)
    const color = await page.getByRole('img', {name: 'Your generated adventurer'}).evaluate(async element => {
      if (!(element instanceof HTMLImageElement)) throw new Error('Avatar is not an image')
      await element.decode()
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 48
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas unavailable')
      context.drawImage(element, 0, 0, 48, 48)
      return [...context.getImageData(21, 28, 1, 1).data].slice(0, 3)
    })
    colors.push(color)
  }
  // A one-level RGB change was technically unique but visually indistinguishable.
  for (const [index, color] of colors.entries()) {
    for (const other of colors.slice(index + 1)) {
      expect(Math.max(...color.map((value, channel) => Math.abs(value - (other[channel] ?? 0))))).toBeGreaterThanOrEqual(6)
    }
  }
})
