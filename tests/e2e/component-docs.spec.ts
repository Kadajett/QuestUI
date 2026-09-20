import { expect, test } from "@playwright/test";

const installCommand =
  "npx quest-ui add button --registry https://questui.yougotserved.dev/r";

test("component page exposes install, registry, import, and editable source", async ({
  context,
  page,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: "http://127.0.0.1:5173",
  });
  await page.goto("/components/button");
  await expect(
    page.getByRole("heading", { level: 1, name: "Button" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Registry JSON" }),
  ).toHaveAttribute("href", "/r/quest-button.json");
  await expect(
    page.getByText("import {Button} from '@/components/quest/button'", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy source" })).toBeVisible();
  await page.getByRole("button", { name: "Copy install command" }).click();
  await expect(
    page.getByRole("button", { name: "Install command copied" }),
  ).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(installCommand);
});

test("component index links every installable catalog entry", async ({
  page,
}) => {
  await page.goto("/components");
  await expect(
    page.getByRole("heading", { level: 1, name: "Components" }),
  ).toBeVisible();
  const hrefs = await page
    .locator('a[href^="/components/"]')
    .evaluateAll((links) => [
      ...new Set(
        links.map((link) => link.getAttribute("href")).filter(Boolean),
      ),
    ]);
  expect(hrefs).toHaveLength(64);
  expect(hrefs).toContain("/components/button");
  expect(hrefs).toContain("/components/questionnaire");
});
