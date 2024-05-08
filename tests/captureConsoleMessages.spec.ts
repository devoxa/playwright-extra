import { expect, test } from '@playwright/test'
import { captureConsoleMessages } from '../src/index'
import { sleep } from '@devoxa/flocky'

test.describe('captureConsoleMessages', () => {
  test('can capture immediate console messages', async ({ page }) => {
    const getConsoleMessages = captureConsoleMessages(page)

    await page.goto('/immediate-console.html')

    await expect(page.locator('h1')).toHaveText('Done')

    expect(getConsoleMessages()).toEqual([
      { type: 'log', args: ['1'] },
      { type: 'warning', args: ['2'] },
      { type: 'error', args: ['3'] },
      { type: 'debug', args: ['4', { foo: { bar: 'baz', boz: 12 } }] },
    ])
  })

  test('can capture delayed console messages', async ({ page }) => {
    await page.goto('/delayed-console.html')
    await sleep(100)

    const getConsoleMessages = captureConsoleMessages(page)

    await expect(page.locator('h1')).toHaveText('Done')

    expect(getConsoleMessages(['log', 'error'])).toEqual([
      // Initial log is ignored because it was right after page load
      { type: 'log', args: ['1'] },
      { type: 'error', args: ['3'] },
    ])
  })
})
