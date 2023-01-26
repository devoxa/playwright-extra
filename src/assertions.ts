import { expect, Locator } from '@playwright/test'

/** Expect the locator to exist exactly once. */
export async function expectToExist(locator: Locator) {
  await expect(locator).toHaveCount(1)
}

/** Expect the locator not to exist. */
export async function expectNotToExist(locator: Locator) {
  await expect(locator).toHaveCount(0)
}
