import { expect, test } from '@playwright/test'
import { getClipboardValue, setClipboardValue } from '../src/index'
import { expectToThrowError } from './helpers/expectToThrowError'

const EXAMPLE_VALUE = 'foobar'

test.describe.serial('clipboard', () => {
  test('interact with the clipboard', async ({ page }) => {
    await page.goto('/copy-to-clipboard.html')

    expect(await getClipboardValue(page)).toEqual('')

    await setClipboardValue(page, EXAMPLE_VALUE)

    expect(await getClipboardValue(page)).toEqual(EXAMPLE_VALUE)
    await page.reload()
    expect(await getClipboardValue(page)).toEqual(EXAMPLE_VALUE)
  })

  test('interact with the clipboard via the page', async ({ page }) => {
    await page.goto('/copy-to-clipboard.html')

    expect(await getClipboardValue(page)).toEqual(EXAMPLE_VALUE) // From the previous test

    await page.getByRole('button', { name: 'Copy' }).click()

    expect(await getClipboardValue(page)).toEqual('Hello World')
  })

  test('error when interacting with clipboard on an invalid origin', async ({ page }) => {
    await expectToThrowError(
      () => getClipboardValue(page),
      'Can only access clipboard on a HTTP(S) origin'
    )

    await expectToThrowError(
      () => setClipboardValue(page, EXAMPLE_VALUE),
      'Can only access clipboard on a HTTP(S) origin'
    )
  })
})
