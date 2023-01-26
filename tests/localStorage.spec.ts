import { expect, test } from '@playwright/test'
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from '../src/index'
import { expectToThrowError } from './helpers/expectToThrowError'

const EXAMPLE_KEY = 'foo'
const EXAMPLE_VALUE = 'bar'

test.describe('localStorage', () => {
  test('interact with local storage', async ({ page }) => {
    await page.goto('/hello-world.html')

    expect(await getLocalStorageItem(page, EXAMPLE_KEY)).toEqual(null)

    await setLocalStorageItem(page, EXAMPLE_KEY, EXAMPLE_VALUE)

    expect(await getLocalStorageItem(page, EXAMPLE_KEY)).toEqual(EXAMPLE_VALUE)
    await page.reload()
    expect(await getLocalStorageItem(page, EXAMPLE_KEY)).toEqual(EXAMPLE_VALUE)

    await removeLocalStorageItem(page, EXAMPLE_KEY)

    expect(await getLocalStorageItem(page, EXAMPLE_KEY)).toEqual(null)
    await page.reload()
    expect(await getLocalStorageItem(page, EXAMPLE_KEY)).toEqual(null)
  })

  test('error when interacting with local storage on an invalid origin', async ({ page }) => {
    await expectToThrowError(
      () => getLocalStorageItem(page, EXAMPLE_KEY),
      'Can only access localStorage on a HTTP(S) origin'
    )

    await expectToThrowError(
      () => setLocalStorageItem(page, EXAMPLE_KEY, EXAMPLE_VALUE),
      'Can only access localStorage on a HTTP(S) origin'
    )

    await expectToThrowError(
      () => removeLocalStorageItem(page, EXAMPLE_KEY),
      'Can only access localStorage on a HTTP(S) origin'
    )
  })
})
