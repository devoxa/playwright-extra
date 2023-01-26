import { sleep } from '@devoxa/flocky'
import { expect, test } from '@playwright/test'
import { waitForNetworkIdle } from '../src/index'

test.describe('waitForNetworkIdle', () => {
  test('fail without waiting', async ({ page }) => {
    test.fail()
    await page.goto('/slow-requests.html')

    await expect(page.locator('h1')).toHaveText('Done', { timeout: 1 })
  })

  test('wait for the network to idle before continuing (no requests)', async ({ page }) => {
    const waitForNetworkIdlePromise = waitForNetworkIdle(page)
    await page.goto('/no-requests.html')
    await waitForNetworkIdlePromise

    await expect(page.locator('h1')).toHaveText('Done', { timeout: 1 })
  })

  test('wait for the network to idle before continuing (fast requests)', async ({ page }) => {
    const waitForNetworkIdlePromise = waitForNetworkIdle(page)
    await page.goto('/fast-requests.html')
    await waitForNetworkIdlePromise

    await expect(page.locator('h1')).toHaveText('Done', { timeout: 1 })
  })

  test('wait for the network to idle before continuing (delayed fast requests)', async ({
    page,
  }) => {
    const waitForNetworkIdlePromise = waitForNetworkIdle(page, { timeout: 5000, minIdleTime: 500 })
    await page.goto('/delayed-fast-requests.html')
    await waitForNetworkIdlePromise

    await expect(page.locator('h1')).toHaveText('Done', { timeout: 1 })
  })

  test('wait for the network to idle before continuing (multi-stage fast requests)', async ({
    page,
  }) => {
    const waitForNetworkIdlePromise = waitForNetworkIdle(page)
    await page.goto('/multi-stage-fast-requests.html')
    await waitForNetworkIdlePromise

    await expect(page.locator('h1')).toHaveText('Done 1', { timeout: 1 })

    await sleep(500)
    await waitForNetworkIdle(page)

    await expect(page.locator('h1')).toHaveText('Done 2', { timeout: 1 })
  })

  test('wait for the network to idle before continuing (slow requests)', async ({ page }) => {
    const waitForNetworkIdlePromise = waitForNetworkIdle(page, { timeout: 10000, minIdleTime: 200 })
    await page.goto('/slow-requests.html')
    await waitForNetworkIdlePromise

    await expect(page.locator('h1')).toHaveText('Done', { timeout: 1 })
  })

  test('wait for the network to idle before continuing (delayed slow requests)', async ({
    page,
  }) => {
    const waitForNetworkIdlePromise = waitForNetworkIdle(page, { timeout: 10000, minIdleTime: 500 })
    await page.goto('/delayed-slow-requests.html')
    await waitForNetworkIdlePromise

    await expect(page.locator('h1')).toHaveText('Done', { timeout: 1 })
  })

  test('fail when timeout is hit', async ({ page }) => {
    let error

    try {
      const waitForNetworkIdlePromise = waitForNetworkIdle(page, { timeout: 500 })
      await page.goto('/slow-requests.html')
      await waitForNetworkIdlePromise
    } catch (err) {
      error = err
    }

    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).toMatchSnapshot()
  })
})
