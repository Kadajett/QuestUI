import {expect, test} from '@playwright/test'

test('radio labels clear the pixel indicator and remain keyboard selectable', async ({page}) => {
  await page.goto('/demo')
  const ranger = page.getByRole('radio', {name: 'ranger', exact: true})
  const mage = page.getByRole('radio', {name: 'mage', exact: true})
  await ranger.scrollIntoViewIfNeeded()
  const gaps = await page.locator('input[type="radio"]').evaluateAll(inputs => inputs.map(input => {
    const label = document.getElementById(input.getAttribute('aria-labelledby') ?? '')
    const indicator = input.parentElement?.querySelector('span[aria-hidden="true"]')
    if (!label || !indicator) throw new Error('Radio label or indicator missing')
    return label.getBoundingClientRect().left - indicator.getBoundingClientRect().right
  }))
  for (const gap of gaps) expect(gap).toBeGreaterThanOrEqual(12)
  await ranger.focus()
  await page.keyboard.press('ArrowDown')
  await expect(mage).toBeChecked()
  await expect(mage).toBeFocused()
  await page.getByText('knight', {exact: true}).click()
  await expect(page.getByRole('radio', {name: 'knight', exact: true})).toBeChecked()
})
