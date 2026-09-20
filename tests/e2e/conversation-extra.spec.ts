import {expect, test} from '@playwright/test'

test.beforeEach(async ({page}) => { await page.goto('/demo') })

test('conversation reactions, collapse, attachments and questionnaire work together', async ({page}) => {
  const section = page.locator('#conversation-extra')
  await section.getByRole('button', {name: 'Show more'}).click()
  await expect(section.getByText(/The northern bridge is repaired/)).toBeVisible()
  await section.getByRole('button', {name: 'Helpful', exact: true}).click()
  await expect(section.getByRole('button', {name: 'Helpful', exact: true})).toHaveAttribute('aria-pressed', 'true')
  await section.getByRole('button', {name: 'Remove moonkeep-map.txt'}).click()
  await expect(section.getByRole('link', {name: 'Download moonkeep-map.txt'})).toHaveCount(0)
  await section.locator('input[type=file]').setInputFiles({name: 'route.txt', mimeType: 'text/plain', buffer: Buffer.from('Forest route')})
  await expect(section.getByRole('button', {name: 'Remove route.txt'})).toBeVisible()
  await section.getByRole('button', {name: 'Remove route.txt'}).click()
  await section.getByRole('radio', {name: 'Forest', exact: true}).check()
  await section.getByRole('button', {name: 'Next', exact: true}).click()
  await section.getByRole('checkbox', {name: 'Lantern', exact: true}).check()
  await section.getByRole('button', {name: 'Next', exact: true}).click()
  await section.getByRole('button', {name: 'Skip', exact: true}).click()
  await expect(section.getByRole('status', {name: 'Saved quest plan'})).toHaveText('{"route":"forest","gear":["lantern"]}')
})

test('transcript follows near the end but preserves a reader anchor on append and prepend', async ({page}) => {
  const section = page.locator('#conversation-extra')
  const viewport = section.getByRole('region', {name: 'Trail transcript scroll area'})
  await viewport.scrollIntoViewIfNeeded()
  await expect.poll(() => viewport.evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop)).toBeLessThan(3)
  await section.getByRole('button', {name: 'Add message', exact: true}).click()
  await expect.poll(() => viewport.evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop)).toBeLessThan(3)
  await viewport.evaluate(element => {
    const viewportElement = element
    viewportElement.scrollTop = 350
    viewportElement.dispatchEvent(new Event('scroll'))
  })
  const anchor = await viewport.evaluate(element => {
    const top = element.getBoundingClientRect().top
    const row = [...element.querySelectorAll<HTMLElement>('[data-quest-message-id]')]
      .find(item => item.getBoundingClientRect().bottom > top)
    const id = row?.dataset['questMessageId']
    if (!row || !id) throw new Error('Expected a visible message anchor')
    return {id, offset: row.getBoundingClientRect().top - top}
  })
  await section.getByRole('button', {name: 'Add message', exact: true}).click()
  await expect(section.getByRole('button', {name: 'Jump to latest'})).toBeVisible()
  await section.getByRole('button', {name: 'Load older history'}).click()
  await expect.poll(() => viewport.evaluate((element, saved) => {
    const row = [...element.querySelectorAll<HTMLElement>('[data-quest-message-id]')]
      .find(item => item.dataset['questMessageId'] === saved.id)
    if (!row) throw new Error(`Expected message anchor ${saved.id}`)
    return Math.abs(row.getBoundingClientRect().top - element.getBoundingClientRect().top - saved.offset)
  }, anchor)).toBeLessThan(2)
  await section.getByRole('button', {name: 'Jump to latest'}).click()
  await expect.poll(() => viewport.evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop)).toBeLessThan(3)
  await expect(viewport).toBeFocused()
})

for (const theme of ['overworld', 'castle'] as const) {
  test(`conversation extras render in ${theme}`, async ({page}) => {
    await page.emulateMedia({reducedMotion: 'reduce'})
    if (theme === 'castle') await page.getByRole('combobox', {name: 'Theme', exact: true}).selectOption('castle')
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('#conversation-extra')).toHaveScreenshot(`conversation-extra-${theme}.png`)
  })
}
