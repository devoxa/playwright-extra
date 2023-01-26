import { sleep } from '@devoxa/flocky'

export interface RetryOnErrorOptions {
  timeout?: number
  waitTime?: number
}

/** Retry until the callback is successful or the timeout is hit. */
export async function retryOnError<T>(
  asyncCallback: () => Promise<T>,
  pOptions?: RetryOnErrorOptions
): Promise<T> {
  const options = { timeout: 5000, waitTime: 100, ...pOptions }
  const timeoutTimestamp = Date.now() + options.timeout

  while (true) {
    try {
      return await asyncCallback()
    } catch (err) {
      if (timeoutTimestamp > Date.now()) {
        await sleep(options.waitTime)
        continue
      }

      // Timeout hit, rethrow the last error
      throw err
    }
  }
}
