import {expect, test} from '@playwright/test'

test.beforeEach(async ({page}) => {
  await page.goto('/demo')
  await page.evaluate(() => document.fonts.ready)
})

test('ratio geometry, roving focus, and nested direction boundaries', async ({page}) => {
  const section = page.locator('#layout-extra')
  const ratio = section.getByTestId('quest-landscape')
  const bounds = await ratio.boundingBox()
  if (!bounds) throw new Error('Expected aspect-ratio bounds')
  expect(bounds.width / bounds.height).toBeCloseTo(16 / 9, 2)
  const media = ratio.getByRole('img')
  const mediaBounds = await media.boundingBox()
  if (!mediaBounds) throw new Error('Expected aspect-ratio media bounds')
  expect(mediaBounds.width).toBeCloseTo(bounds.width, 0)
  expect(mediaBounds.height).toBeCloseTo(bounds.height, 0)

  const group = section.getByRole('group', {name: 'Travel destination'})
  await group.getByRole('button', {name: 'Forest'}).focus()
  await page.keyboard.press('ArrowRight')
  await expect(group.getByRole('button', {name: 'Castle'})).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(section.getByText('Destination: Castle')).toBeVisible()
  await page.keyboard.press('Home')
  await expect(group.getByRole('button', {name: 'Forest'})).toBeFocused()

  await section.getByRole('button', {name: 'Use RTL layout'}).click()
  const preview = section.getByTestId('direction-preview')
  await expect(preview).toHaveAttribute('dir', 'rtl')
  await expect(preview.getByTestId('direction-text')).toHaveCSS('direction', 'rtl')
  await expect(preview.getByText('Q-102')).toHaveCSS('direction', 'ltr')
  await section.getByRole('button', {name: 'Use LTR layout'}).click()
  await expect(preview.getByTestId('direction-text')).toHaveCSS('direction', 'ltr')
})

test('empty state, independent item action, and reduced-motion loading status', async ({page}) => {
  const section = page.locator('#layout-extra')
  await section.getByRole('button', {name: 'Find a quest'}).click()
  await section.getByRole('button', {name: /The mountain trail/}).click()
  await expect(section.getByText('Mountain trail selected')).toBeVisible()
  await section.getByRole('button', {name: 'Archive', exact: true}).click()
  await expect(section.getByRole('heading', {name: 'Your quest log is empty'})).toBeVisible()
  const spinner = section.getByRole('status', {name: 'Scouting the trail'})
  await expect(spinner).toBeVisible()
  await expect(spinner.locator('svg')).toHaveCSS('animation-name', 'none')
  await expect(spinner.locator('svg')).toHaveCSS('border-top-style', 'dotted')
  await section.getByRole('button', {name: 'Finish scouting'}).click()
  await expect(spinner).not.toBeVisible()
  await expect(section.getByText('Trail ready')).toBeVisible()
})

for (const theme of ['overworld', 'castle'] as const) {
  test(`layout extras in ${theme}`, async ({page}) => {
    if (theme === 'castle') await page.getByRole('button', {name: 'Switch to Castle', exact: true}).click()
    await expect(page.locator('#layout-extra')).toHaveScreenshot(`layout-extra-${theme}.png`)
  })
}
