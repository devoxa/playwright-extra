import { expect, test } from '@playwright/test'
import { expectZeroAccessibilityViolations } from '../src/index'

test.describe('expectZeroAccessibilityViolations', () => {
  test('error when accessability violations are detected', async ({ page }) => {
    await page.goto('/hello-world.html')

    let error

    try {
      await expectZeroAccessibilityViolations(page)
    } catch (err) {
      error = err
    }

    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).toMatchSnapshot()
  })

  test('successful when no accessability violations are detected', async ({ page }) => {
    await page.goto('/accessible.html')

    await expectZeroAccessibilityViolations(page)
  })
})
