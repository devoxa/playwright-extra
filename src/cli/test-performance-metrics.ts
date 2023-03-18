#!/usr/bin/env node
import { InvalidArgumentError, program } from 'commander'
import { PerformanceMetrics, jsonLinesParse, testPerformanceMetrics } from '../index'

program
  .requiredOption(
    '--file-path <path>',
    'The path to the performance metrics file',
    'performance-metrics.jsonl'
  )
  .option(
    '--max-encoded-body-size <number>',
    'The maximum allowed encoded body size (in bytes)',
    enforceInteger
  )
  .option(
    '--max-resource-load-duration <number>',
    'The maximum allowed resource load duration (in ms)',
    enforceInteger
  )
  .option(
    '--max-nextjs-hydration-duration <number>',
    'The maximum allowed NextJS hydration duration (in ms)',
    enforceInteger
  )

void run()

async function run() {
  program.parse()
  const options = program.opts()

  const jsonl = await jsonLinesParse<PerformanceMetrics>(options.filePath)
  testPerformanceMetrics(jsonl, options)
}

function enforceInteger(value: string) {
  const integer = parseInt(value, 10)

  if (isNaN(integer)) {
    throw new InvalidArgumentError('Not a valid integer.')
  }

  return integer
}
