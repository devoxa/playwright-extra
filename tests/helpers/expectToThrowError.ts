import { expect } from '@playwright/test'

export async function expectToThrowError(callback: () => Promise<unknown>, message: string) {
  let error

  try {
    await callback()
  } catch (err) {
    error = err
  }

  expect(error).toBeInstanceOf(Error)
  expect((error as Error).message).toEqual(message)
}
