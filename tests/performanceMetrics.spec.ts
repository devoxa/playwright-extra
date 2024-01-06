import { randomString } from '@devoxa/flocky'
import { expect, test } from '@playwright/test'
import { PerformanceMetrics, exportPerformanceMetrics, jsonLinesParse } from '../src/index'

test.describe('exportPerformanceMetrics', () => {
  test('exports performance metrics', async ({ page }) => {
    const FILE_NAME = `test-tmp/performance-metrics-${randomString(6)}.jsonl`

    await page.goto('/hello-world.html')
    await exportPerformanceMetrics(page, 'hello-world', { filePath: FILE_NAME })

    await page.goto('/accessible.html')
    await exportPerformanceMetrics(page, 'accessible', { filePath: FILE_NAME })

    const file = await jsonLinesParse<PerformanceMetrics>(FILE_NAME)
    expect(file).toHaveLength(2)

    expect(file[0].label).toEqual('hello-world')
    expect(file[0].encodedBodySize).toBeGreaterThan(50)
    expect(file[0].encodedBodySize).toBeLessThan(500)
    expect(file[0].resourceLoadDuration).toBeGreaterThan(0)

    expect(file[1].label).toEqual('accessible')
    expect(file[1].encodedBodySize).toBeGreaterThan(50)
    expect(file[1].encodedBodySize).toBeLessThan(500)
    expect(file[1].resourceLoadDuration).toBeGreaterThan(0)
  })
})
