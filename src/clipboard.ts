import { Page } from '@playwright/test'

const CLIPBOARD_ELEMENT_ID = '__playwright__clipboard__'

/** Get the value of the clipboard. */
export async function getClipboardValue(page: Page) {
  verifyClipboardOrigin(page)

  await page.evaluate(evaluate_createClipboardElement, [CLIPBOARD_ELEMENT_ID])

  await page.locator(`#${CLIPBOARD_ELEMENT_ID}`).focus()
  await page.keyboard.press('Control+V')
  const value = await page.locator(`#${CLIPBOARD_ELEMENT_ID}`).inputValue()

  await page.evaluate(evaluate_removeClipboardElement, [CLIPBOARD_ELEMENT_ID])

  return value
}

/** Set the value of the clipboard. */
export async function setClipboardValue(page: Page, value: string) {
  verifyClipboardOrigin(page)

  await page.evaluate(evaluate_createClipboardElement, [CLIPBOARD_ELEMENT_ID])

  await page.locator(`#${CLIPBOARD_ELEMENT_ID}`).type(value)
  await page.locator(`#${CLIPBOARD_ELEMENT_ID}`).selectText()
  await page.keyboard.press('Control+C')

  await page.evaluate(evaluate_removeClipboardElement, [CLIPBOARD_ELEMENT_ID])
}

function evaluate_createClipboardElement(values: Array<string | number>) {
  const [$id] = values as [string]

  const clipboardElement = document.createElement('textarea')
  clipboardElement.style.top = '0'
  clipboardElement.style.left = '0'
  clipboardElement.style.position = 'fixed'
  clipboardElement.id = $id
  document.body.appendChild(clipboardElement)
}

function evaluate_removeClipboardElement(values: Array<string | number>) {
  const [$id] = values as [string]

  const clipboardElement = document.getElementById($id)
  clipboardElement && document.body.removeChild(clipboardElement)
}

function verifyClipboardOrigin(page: Page) {
  if (!page.url().startsWith('http')) {
    throw new Error('Can only access clipboard on a HTTP(S) origin')
  }
}
