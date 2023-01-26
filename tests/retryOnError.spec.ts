import { expect, test } from '@playwright/test'
import { retryOnError } from '../src/index'

test.describe('retryOnError', () => {
  test('fail without retrying', async ({ page }) => {
    test.fail()
    await page.goto('/async-render.html')

    await expect(page.locator('#foo')).toHaveText('Baz', { timeout: 1 })
  })

  test('pass with retrying', async ({ page }) => {
    await page.goto('/async-render.html')

    const result = await retryOnError(async () => {
      await expect(page.locator('#foo')).toHaveText('Baz', { timeout: 1 })
      return 'foobar'
    })

    expect(result).toEqual('foobar')
  })

  test('fail when timeout is hit', async ({ page }) => {
    test.fail()
    await page.goto('/async-render.html')

    await retryOnError(
      async () => {
        await expect(page.locator('#foo')).toHaveText('Baz', { timeout: 1 })
      },
      { timeout: 1000 }
    )
  })
})
