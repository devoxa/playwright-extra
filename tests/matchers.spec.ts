import { expect, test } from '@playwright/test'
import { $contains, $endsWith, $startsWith } from '../src/index'

test.describe('matchers', () => {
  test('successful with basic strings', async ({ page }) => {
    await page.goto('/hello-world.html?foo=bar&baz=boz')

    await expect(page).toHaveURL($startsWith(`http://localhost:3000`))
    await expect(page).toHaveURL($contains(`/hello-world.html`))
    await expect(page).toHaveURL($endsWith(`baz=boz`))

    await expect(page).not.toHaveURL($startsWith(`http://localhost:3001`))
    await expect(page).not.toHaveURL($contains(`/goodbye-world.html`))
    await expect(page).not.toHaveURL($endsWith(`foo=bar`))
  })

  test('successful with special characters', async ({ page }) => {
    await page.goto('/hello-world.html?foo=bar&baz=boz')

    await expect(page).toHaveURL($startsWith(`http://localhost:3000/hello-world.html?foo=bar`))
    await expect(page).toHaveURL($contains(`/hello-world.html?foo=bar`))
    await expect(page).toHaveURL($endsWith(`?foo=bar&baz=boz`))

    await expect(page).not.toHaveURL($startsWith(`http://localhost:3001/hello-world.html?foo=bar`))
    await expect(page).not.toHaveURL($contains(`/goodbye-world.html?foo=bar`))
    await expect(page).not.toHaveURL($endsWith(`?baz=boz&foo=bar`))
  })

  test('successful with dynamic segments', async ({ page }) => {
    await page.goto('/de54bb36-b1c1-4028-8cbe-57fa24f99622/edit.html?foo=bar&baz=boz')

    const dynamicSegments = { uuid: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' }

    await expect(page).toHaveURL($startsWith(`http://localhost:3000/:uuid`, dynamicSegments))
    await expect(page).toHaveURL($contains(`/:uuid/edit.html`, dynamicSegments))
    await expect(page).toHaveURL($endsWith(`/:uuid/edit.html?foo=bar&baz=boz`, dynamicSegments))

    await expect(page).not.toHaveURL($startsWith(`http://localhost:3001/:uuid`, dynamicSegments))
    await expect(page).not.toHaveURL($contains(`/:uuid/delete.html`, dynamicSegments))
    await expect(page).not.toHaveURL($endsWith(`/:uuid/edit.html?foo=bar`, dynamicSegments))
  })
})
