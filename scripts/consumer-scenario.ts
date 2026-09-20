import {expect, type Page} from '@playwright/test'
import {componentCatalog} from '../cli/catalog.ts'

// Run against a fresh packaged consumer at a desktop viewport. This is an
// explicit browser-proof entry point, not an automatically discovered test.
// Existing 27 interactions live here; extra demo interactions are exercised by
// their dedicated browser scenarios maintained with those demos.
export async function allCatalogScenario(page: Page, url = 'http://127.0.0.1:4174'): Promise<void> {
  await page.setViewportSize({width: 1280, height: 900})
  await page.emulateMedia({colorScheme: 'light'})
  await page.goto(url)
  await expect(page.getByRole('heading', {name: 'QuestUI packaged consumer', exact: true})).toBeVisible()
  for (const example of await page.locator('[data-quest]').all()) {
    const entryName = await example.getAttribute('data-quest')
    expect(componentCatalog.some(({name}) => name === entryName)).toBe(true)
    await expect(example).toBeVisible()
  }
  await surfaceScenario(page)
  await inputScenario(page)
  await choiceScenario(page)
  await pickerScenario(page)
  await feedbackScenario(page)
  await disclosureScenario(page)
  await menuScenario(page)
  await page.emulateMedia({colorScheme: 'dark'})
  await page.screenshot({path: 'consumer-catalog-dark.png', fullPage: true})
  await page.emulateMedia({colorScheme: 'light'})
  await page.screenshot({path: 'consumer-catalog-light.png', fullPage: true})
}

async function surfaceScenario(page: Page): Promise<void> {
  await expect(page.getByRole('button', {name: 'Locked installed button', exact: true})).toBeDisabled()
  await expect(page.getByRole('button', {name: 'Save installed quest', exact: true})).toBeDisabled()
  await expect(page.getByText('Saving installed quest', {exact: true})).toBeVisible()
  await page.getByRole('button', {name: 'Count installed clicks', exact: true}).click()
  await expect(page.locator('#button-result')).toHaveText('Installed clicks: 1')
  await page.getByRole('button', {name: 'Finish button loading', exact: true}).click()
  await expect(page.getByText('Saving installed quest', {exact: true})).toBeHidden()
  await page.getByRole('button', {name: 'Save installed quest', exact: true}).click()
  await expect(page.locator('#button-result')).toHaveText('Installed clicks: 2')
  await expect(page.getByRole('heading', {name: 'Installed quest card', exact: true})).toBeVisible()
  await page.getByRole('button', {name: 'Collect installed reward', exact: true}).click()
  await expect(page.locator('[data-quest="badge"]')).toHaveText('3 rewards')
  await expect(page.getByRole('img', {name: 'Installed Ranger', exact: true})).toBeVisible()
  await expect(page.getByRole('separator', {name: 'Installed reward divider'})).toBeVisible()
}

async function inputScenario(page: Page): Promise<void> {
  await page.locator('label[for="installed-name"]').filter({hasText: 'Installed name shortcut'}).click()
  await expect(page.locator('#installed-name')).toBeFocused()
  await page.locator('#installed-name').fill('Nova')
  await expect(page.locator('#input-result')).toHaveText('Name: Nova')
  await page.getByLabel('Installed hero name', {exact: true}).fill('Mira')
  await expect(page.getByRole('textbox', {name: 'Locked installed input', exact: true})).toBeDisabled()
  await expect(page.getByRole('textbox', {name: 'Installed read only code', exact: true})).toHaveAttribute('readonly', '')
}

async function choiceScenario(page: Page): Promise<void> {
  await page.getByRole('checkbox', {name: 'Installed updates', exact: true}).check()
  await expect(page.locator('#checkbox-result')).toHaveText('Updates: on')
  await page.getByRole('switch', {name: 'Installed sound', exact: true}).click()
  await expect(page.locator('#switch-result')).toHaveText('Sound: off')
  await page.getByRole('slider', {name: 'Installed volume', exact: true}).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#slider-result')).toHaveText('Volume: 50')
  await expect(page.getByRole('radio', {name: 'Installed locked class', exact: true})).toBeDisabled()
  await page.getByRole('radio', {name: 'Installed mage class', exact: true}).check()
  await expect(page.locator('#radio-result')).toHaveText('Class: mage')
}

async function pickerScenario(page: Page): Promise<void> {
  await page.locator('[data-quest="select"] [role="combobox"]').click()
  await expect(page.getByRole('option', {name: 'Installed locked region', exact: true})).toHaveAttribute('aria-disabled', 'true')
  await page.getByRole('option', {name: 'Installed Castle', exact: true}).click()
  await expect(page.locator('#select-result')).toHaveText('Region: castle')
  await page.locator('[data-quest="combobox"] button[aria-haspopup]').click()
  await page.getByPlaceholder('Search installed destinations', {exact: true}).fill('Crystal')
  await expect(page.getByRole('option', {name: 'Moonlit forest', exact: true})).toBeHidden()
  await page.getByRole('option', {name: 'Crystal caverns', exact: true}).click()
  await expect(page.locator('#combobox-result')).toHaveText('Destination: Crystal caverns')
  await page.locator('[data-quest="calendar"] button[data-date="2026-09-15"]').click()
  await expect(page.locator('#calendar-result')).toHaveText('Departure: 2026-09-15')
  await expect(page.locator('[data-quest="calendar"] [role="gridcell"][aria-selected="true"] button')).toHaveAttribute('data-date', '2026-09-15')
  await page.getByRole('button', {name: 'Open installed travel tips', exact: true}).click()
  await expect(page.getByText('Pack an installed lantern.', {exact: true})).toBeVisible()
  await page.getByRole('button', {name: 'Pack installed lantern', exact: true}).click()
  await expect(page.locator('#popover-result')).toHaveText('Lantern: packed')
  await page.keyboard.press('Escape')
  await expect(page.getByText('Pack an installed lantern.', {exact: true})).toBeHidden()
}

async function feedbackScenario(page: Page): Promise<void> {
  await page.getByRole('button', {name: 'Dismiss installation alert', exact: true}).click()
  await expect(page.locator('#alert-result')).toHaveText('Installation alert dismissed.')
  await expect(page.getByText('CLI installation complete', {exact: true})).toBeHidden()
  const tooltipTrigger = page.getByRole('button', {name: 'Inspect tooltip', exact: true})
  await tooltipTrigger.hover()
  await expect(page.getByRole('tooltip')).toHaveText('This tooltip came from the installed source.')
  await expect(tooltipTrigger).toHaveAccessibleDescription('This tooltip came from the installed source.')
  await page.getByRole('button', {name: 'Advance progress', exact: true}).click()
  await expect(page.getByRole('progressbar', {name: 'Quest completion', exact: true})).toHaveAttribute('aria-valuenow', '60')
  await expect(page.getByRole('progressbar', {name: 'Searching for quests', exact: true})).not.toHaveAttribute('aria-valuenow')
  await expect(page.getByRole('region', {name: 'Inventory preview'})).toHaveAttribute('aria-busy', 'true')
  await page.getByRole('button', {name: 'Finish loading', exact: true}).click()
  await expect(page.getByRole('region', {name: 'Inventory preview'})).toHaveAttribute('aria-busy', 'false')
  await expect(page.getByText('Inventory loaded: pixel sword and shield.', {exact: true})).toBeVisible()
  await page.getByRole('button', {name: 'Show installed notification', exact: true}).click()
  await expect(page.getByText('Installed notification ready.', {exact: true})).toBeVisible()
  await page.getByRole('button', {name: 'Dismiss installed notification', exact: true}).click()
  await expect(page.getByText('Installed notification ready.', {exact: true})).toBeHidden()
}

async function disclosureScenario(page: Page): Promise<void> {
  await page.getByRole('tab', {name: 'Mission', exact: true}).focus()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('tab', {name: 'Inventory', exact: true})).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('#inventory-panel')).toBeVisible()
  await expect(page.locator('#mission-panel')).toBeHidden()
  await page.getByRole('button', {name: 'Open quest dialog', exact: true}).click()
  await expect(page.getByRole('dialog', {name: 'Accept this quest?', exact: true})).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', {name: 'Accept this quest?', exact: true})).toBeHidden()
  await expect(page.getByRole('button', {name: 'Open quest dialog', exact: true})).toBeFocused()
  await page.getByRole('button', {name: 'Open quest dialog', exact: true}).click()
  await page.getByRole('button', {name: 'Accept quest', exact: true}).click()
  await expect(page.locator('#dialog-result')).toHaveText('Quest: accepted')
  await expect(page.getByRole('dialog', {name: 'Accept this quest?', exact: true})).toBeHidden()
  await page.getByRole('button', {name: 'Installed rewards', exact: true}).click()
  await expect(page.getByRole('button', {name: 'Installed rewards', exact: true})).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByText('Collect the moonstone.', {exact: true})).toBeVisible()
  await page.getByRole('button', {name: 'Installed rewards', exact: true}).click()
  await expect(page.getByText('Collect the moonstone.', {exact: true})).toBeHidden()
}

async function menuScenario(page: Page): Promise<void> {
  await page.getByRole('button', {name: 'Installed actions', exact: true}).click()
  await expect(page.getByRole('menuitem', {name: 'Locked action', exact: true})).toBeDisabled()
  await page.getByRole('menuitem', {name: 'Inspect installed seal', exact: true}).click()
  await expect(page.locator('#menu-result')).toHaveText('Installed seal inspected.')
  await page.getByRole('button', {name: 'Installed chest', exact: true}).click({button: 'right'})
  await page.getByRole('menuitem', {name: 'Open installed chest', exact: true}).click()
  await expect(page.locator('#menu-result')).toHaveText('Installed chest opened.')
  await page.getByRole('button', {name: 'Installed ranger', exact: true}).hover()
  await expect(page.getByText('Installed ranger preview.', {exact: true})).toBeVisible()
  await page.getByRole('heading', {name: 'Installed menus and preview', exact: true}).hover()
  await expect(page.getByText('Installed ranger preview.', {exact: true})).toBeHidden()
}
