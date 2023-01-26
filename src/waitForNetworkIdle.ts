import { Page } from '@playwright/test'

interface WaitForNetworkIdleOptions {
  timeout?: number
  minIdleTime?: number
  debug?: boolean
}

/** Wait for all network requests to be settled before resolving. */
export function waitForNetworkIdle(page: Page, pOptions?: WaitForNetworkIdleOptions) {
  function debug(message: string) {
    if (!pOptions?.debug) return
    console.log(`[waitForNetworkIdle] ${message}`)
  }

  return new Promise<void>((_resolve, _reject) => {
    let isSettled = false
    const inFlightRequestsMap: Record<string, number> = {}
    let resolveTimeout: NodeJS.Timeout | undefined = undefined
    const rejectTimeout = setTimeout(reject, pOptions?.timeout || 10000)

    function resolve() {
      clearTimeout(rejectTimeout)
      debug('Idle')

      _resolve()
      isSettled = true
    }

    function reject() {
      clearTimeout(resolveTimeout)
      debug('Timeout')

      const urlsInFlight = getInFlightRequests()
        .map(([url, value]) => `- ${url} (${value} in flight)`)
        .join('\n')

      _reject(new Error('Timeout exceeded while waiting for network idle:\n\n' + urlsInFlight))
      isSettled = true
    }

    function getInFlightRequests() {
      return Object.entries(inFlightRequestsMap).filter(([, value]) => value > 0)
    }

    page.on('request', (request) => {
      if (isSettled) return

      const url = request.url()
      debug(`>> ${url}`)
      inFlightRequestsMap[url] = (inFlightRequestsMap[url] || 0) + 1

      clearTimeout(resolveTimeout)
    })

    page.on('response', (response) => {
      if (isSettled) return

      const url = response.url()
      debug(`<< ${url}`)
      inFlightRequestsMap[url] = (inFlightRequestsMap[url] || 1) - 1

      if (getInFlightRequests().length === 0) {
        resolveTimeout = setTimeout(resolve, pOptions?.minIdleTime || 200)
      }
    })
  })
}

/** Go to a page and wait for all network requests to be settled. */
export async function gotoAndWaitForNetworkIdle(
  page: Page,
  url: string,
  pOptions?: WaitForNetworkIdleOptions
) {
  const waitForNetworkIdlePromise = waitForNetworkIdle(page, pOptions)
  await page.goto(url)
  await waitForNetworkIdlePromise
}

/** Reload the page and wait for all network requests to be settled. */
export async function reloadAndWaitForNetworkIdle(
  page: Page,
  pOptions?: WaitForNetworkIdleOptions
) {
  const waitForNetworkIdlePromise = waitForNetworkIdle(page, pOptions)
  await page.reload()
  await waitForNetworkIdlePromise
}
