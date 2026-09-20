import {expect, test} from '@playwright/test'

test.beforeEach(async ({page}) => {
  await page.goto('/demo')
})

test('dropdown menu activates items and respects disabled state', async ({page}) => {
  const trigger = page.getByRole('button', {name: 'Quest actions', exact: true})
  await trigger.click()
  const menu = page.getByRole('menu', {name: 'Quest actions'})
  await expect(menu).toBeVisible()
  const inspect = menu.getByRole('menuitem', {name: 'Inspect seal'})
  const retreat = menu.getByRole('menuitem', {name: 'Retreat to camp'})
  const abandon = menu.getByRole('menuitem', {name: 'Abandon quest'})
  await expect(retreat).toBeDisabled()
  await expect(abandon).toBeVisible()
  await inspect.click()
  await expect(menu).toBeHidden()
  await expect(page.getByRole('status').filter({hasText: 'Inspecting the seal.'})).toBeVisible()
  await trigger.click()
  await expect(menu.getByRole('menuitem', {name: 'Abandon quest'})).toBeVisible()
  await menu.getByRole('menuitem', {name: 'Abandon quest'}).click()
  await expect(page.getByRole('status').filter({hasText: 'Quest abandoned.'})).toBeVisible()
})

test('dropdown supports keyboard navigation and Escape close', async ({page}) => {
  const trigger = page.getByRole('button', {name: 'Quest actions', exact: true})
  await trigger.focus()
  await page.keyboard.press('Enter')
  const menu = page.getByRole('menu', {name: 'Quest actions'})
  await expect(menu).toBeVisible()
  // Keyboard-open focuses the first enabled item; disabled rows are skipped.
  await expect(menu.getByRole('menuitem', {name: 'Inspect seal'})).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(menu.getByRole('menuitem', {name: 'Abandon quest'})).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await expect(trigger).toBeFocused()
})

for (const theme of ['overworld', 'castle'] as const) {
  test(`dropdown menu framing in ${theme}`, async ({page}) => {
    await page.emulateMedia({reducedMotion: 'reduce'})
    if (theme === 'castle') await page.getByRole('combobox', {name: 'Theme', exact: true}).selectOption('castle')
    await page.evaluate(() => document.fonts.ready)
    await page.getByRole('button', {name: 'Quest actions', exact: true}).click()
    const menu = page.getByRole('menu', {name: 'Quest actions'})
    await expect(menu).toBeVisible()
    await expect(menu).toHaveScreenshot(`dropdown-${theme}.png`)
  })
}
