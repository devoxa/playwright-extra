import { Page } from '@playwright/test'

/** Get the value of a local storage item. */
export async function getLocalStorageItem(page: Page, key: string): Promise<string | null> {
  verifyLocalStorageOrigin(page)

  return await page.evaluate(evaluate_getLocalStorageItem, [key])
}

function evaluate_getLocalStorageItem(values: Array<string | number>): string | null {
  const [$key] = values as [string]

  return window.localStorage.getItem($key)
}

/** Set the value of a local storage item. */
export async function setLocalStorageItem(page: Page, key: string, value: string): Promise<void> {
  verifyLocalStorageOrigin(page)

  await page.evaluate(evaluate_setLocalStorageItem, [key, value])
}

function evaluate_setLocalStorageItem(values: Array<string | number>): void {
  const [$key, $value] = values as [string, string]

  window.localStorage.setItem($key, $value)
}

/** Remove a local storage item. */
export async function removeLocalStorageItem(page: Page, key: string): Promise<void> {
  verifyLocalStorageOrigin(page)

  await page.evaluate(evaluate_removeLocalStorageItem, [key])
}

function evaluate_removeLocalStorageItem(values: Array<string | number>): void {
  const [$key] = values as [string]

  window.localStorage.removeItem($key)
}

function verifyLocalStorageOrigin(page: Page): void {
  if (!page.url().startsWith('http')) {
    throw new Error('Can only access localStorage on a HTTP(S) origin')
  }
}
