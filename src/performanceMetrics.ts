import { compact, max, sum } from '@devoxa/flocky'
import { Page } from '@playwright/test'
import { jsonLinesAppend } from './jsonLines'

interface ExportPerformanceMetricsOptions {
  filePath?: string
}

interface WindowPerformanceEntry {
  name: string
  encodedBodySize?: number
  responseEnd?: number
  startTime?: number
  duration?: number
}

export interface PerformanceMetrics {
  label: string
  encodedBodySize: number
  resourceLoadDuration: number
  nextjsHydrationDuration?: number
}

/** Export the performance metrics of the page to the file path. */
export async function exportPerformanceMetrics(
  page: Page,
  label: string,
  pOptions?: ExportPerformanceMetricsOptions
) {
  const options = { filePath: 'performance-metrics.jsonl', ...pOptions }

  const performanceEntries = await page.evaluate(evaluate_getPerformanceEntries)

  const encodedBodySize = sum(compact(performanceEntries.map((x) => x.encodedBodySize)))
  const resourceLoadDuration = Math.round(
    max(compact(performanceEntries.map((x) => x.responseEnd)))
  )

  const nextjsHydrationEntry = performanceEntries.find((x) => x.name === 'Next.js-hydration')
  const nextjsHydrationDuration =
    nextjsHydrationEntry && nextjsHydrationEntry.startTime && nextjsHydrationEntry.duration
      ? Math.round(nextjsHydrationEntry.startTime + nextjsHydrationEntry.duration)
      : undefined

  const performanceMetrics = {
    label,
    encodedBodySize,
    resourceLoadDuration,
    nextjsHydrationDuration,
  }

  await jsonLinesAppend(options.filePath, performanceMetrics)
}

function evaluate_getPerformanceEntries(): Array<WindowPerformanceEntry> {
  return Array.from(window.performance.getEntries())
}

export interface TestPerformanceMetricsOptions {
  maxEncodedBodySize?: number
  maxResourceLoadDuration?: number
  maxNextjsHydrationDuration?: number
}

export function testPerformanceMetrics(
  metrics: Array<PerformanceMetrics>,
  options: TestPerformanceMetricsOptions
) {
  function buildError(type: string, label: string, max: number, actual: number) {
    return `${label}: ${type} is above allowed maximum (${actual.toLocaleString()} > ${max.toLocaleString()})`
  }

  const errors = []
  for (const metric of metrics) {
    if (options.maxEncodedBodySize && metric.encodedBodySize > options.maxEncodedBodySize) {
      errors.push(
        buildError(
          'Encoded body size',
          metric.label,
          options.maxEncodedBodySize,
          metric.encodedBodySize
        )
      )
    }

    if (
      options.maxResourceLoadDuration &&
      metric.resourceLoadDuration > options.maxResourceLoadDuration
    ) {
      errors.push(
        buildError(
          'Resource load duration',
          metric.label,
          options.maxResourceLoadDuration,
          metric.resourceLoadDuration
        )
      )
    }

    if (
      options.maxNextjsHydrationDuration &&
      metric.nextjsHydrationDuration &&
      metric.nextjsHydrationDuration > options.maxNextjsHydrationDuration
    ) {
      errors.push(
        buildError(
          'NextJS hydration duration',
          metric.label,
          options.maxNextjsHydrationDuration,
          metric.nextjsHydrationDuration
        )
      )
    }
  }

  if (errors.length > 0) {
    const errorString = errors.map((error) => `- ${error}`).join(`\n`)

    console.log()
    console.log('Performance metrics are not within allowed boundaries\n')
    console.log(errorString)
    console.log()
    process.exit(1)
  }
}
