import { test } from '@playwright/test'
import { expectNotToExist, expectToExist } from '../src/index'

test.describe('expectToExist', () => {
  test('successful with one matching element', async ({ page }) => {
    await page.goto('/hello-world.html')

    await expectToExist(page.getByRole('heading', { level: 1, name: 'Hello World!' }))
  })

  test('error with zero matching elements', async ({ page }) => {
    test.fail()
    await page.goto('/hello-world.html')

    await expectToExist(page.getByRole('heading', { level: 1, name: 'Goodbye World!' }))
  })

  test('error with two matching elements', async ({ page }) => {
    test.fail()
    await page.goto('/hello-world.html')

    await expectToExist(page.getByRole('heading'))
  })
})

test.describe('expectNotToExist', () => {
  test('successful with zero matching elements', async ({ page }) => {
    await page.goto('/hello-world.html')

    await expectNotToExist(page.getByRole('heading', { level: 1, name: 'Goodbye World!' }))
  })

  test('error with one matching element', async ({ page }) => {
    test.fail()
    await page.goto('/hello-world.html')

    await expectNotToExist(page.getByRole('heading', { level: 1, name: 'Hello World!' }))
  })
})
