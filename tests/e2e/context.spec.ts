import {expect, test} from '@playwright/test'

test.beforeEach(async ({page}) => {
  await page.goto('/demo')
})

test('context menu selects actions and skips disabled rows on keyboard navigation', async ({page}) => {
  const trigger = page.getByRole('button', {name: 'Sealed chest', exact: true})
  await trigger.focus()
  await page.keyboard.press('Shift+F10')
  const menu = page.getByRole('menu', {name: 'Chest actions'})
  await expect(menu).toBeVisible()
  await expect(menu.getByRole('menuitem', {name: 'Open chest'})).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(menu.getByRole('menuitem', {name: 'Mark on map'})).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status', {name: 'Chest result'})).toHaveText('Chest marked on your map.')
  await expect(menu).toBeHidden()
  await trigger.click({button: 'right'})
  await expect(menu.getByRole('menuitem', {name: 'Sell chest'})).toBeDisabled()
  await menu.getByRole('menuitem', {name: 'Open chest'}).click()
  await expect(page.getByRole('status', {name: 'Chest result'})).toHaveText('You found a moonstone.')
})

test('hover card stays open across the pointer gap and supports focus and Escape', async ({page}) => {
  const trigger = page.getByRole('button', {name: 'Meet Mira', exact: true})
  const popup = page.getByRole('dialog', {name: 'Ranger profile'})
  await trigger.hover()
  await expect(popup).toBeVisible()
  await popup.hover()
  await expect(popup).toContainText('Keeper of the moonstone trail.')
  await page.mouse.move(0, 0)
  await expect(popup).toBeHidden()
  await trigger.focus()
  await expect(popup).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(popup).toBeHidden()
  await expect(trigger).toBeFocused()
})

for (const theme of ['overworld', 'castle'] as const) {
  test(`context surfaces frame correctly in ${theme}`, async ({page}) => {
    await page.emulateMedia({reducedMotion: 'reduce'})
    if (theme === 'castle') await page.getByRole('button', {name: 'Switch to Castle', exact: true}).click()
    await page.evaluate(() => document.fonts.ready)
    await page.getByRole('button', {name: 'Sealed chest', exact: true}).click({button: 'right'})
    await expect(page.getByRole('menu', {name: 'Chest actions'})).toHaveScreenshot(`context-menu-${theme}.png`)
    await page.keyboard.press('Escape')
    await page.getByRole('button', {name: 'Meet Mira', exact: true}).hover()
    await expect(page.getByRole('dialog', {name: 'Ranger profile'})).toHaveScreenshot(`hover-card-${theme}.png`)
  })
}
