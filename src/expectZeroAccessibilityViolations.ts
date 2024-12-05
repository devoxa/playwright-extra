import { Page } from '@playwright/test'
import { configureAxe, getAxeResults, injectAxe } from 'axe-playwright'

type ConfigOptions = Parameters<typeof configureAxe>[1]

/** Expect that there are no accessibility violations. */
export async function expectZeroAccessibilityViolations(
  page: Page,
  config?: ConfigOptions
): Promise<void> {
  if (process.env.DISABLE_ACCESSIBILITY_TESTS === 'true') return

  await injectAxe(page)
  await configureAxe(page, config)
  const results = await getAxeResults(page)

  let index = 0
  const violations = []

  for (const violation of results.violations) {
    for (const node of violation.nodes) {
      violations.push(`(${++index}) ${node.html}\n\n${node.failureSummary}`)
    }
  }

  if (violations.length > 0) {
    const violationsString = violations.join(`\n\n${'-'.repeat(80)}\n\n`)
    throw new Error(`Failed due to accessibility violations\n\n${violationsString}`)
  }
}
