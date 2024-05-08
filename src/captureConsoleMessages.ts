import { ConsoleMessage, Page } from '@playwright/test'

const CAPTURED_TYPES = ['debug', 'log', 'info', 'warning', 'error'] as const
type CapturedConsoleMessageType = (typeof CAPTURED_TYPES)[number]

export interface CapturedConsoleMessage {
  /** The type of the captured console message (e.g. "info" or "warning"). */
  type: CapturedConsoleMessageType

  /** The list of arguments passed to the console function call. */
  args: Array<unknown>
}

/** Capture the console messages of the page for later assertions. */
export function captureConsoleMessages(page: Page) {
  const messages: Array<CapturedConsoleMessage> = []

  async function onConsole(message: ConsoleMessage) {
    const type = message.type() as CapturedConsoleMessageType
    if (!CAPTURED_TYPES.includes(type)) return

    const args = []
    for (const arg of message.args()) {
      args.push(await arg.jsonValue())
    }

    messages.push({ type, args })
  }

  page.on('console', onConsole)

  return (types?: Array<CapturedConsoleMessageType>) => {
    if (!types) return messages
    return messages.filter((message) => types.includes(message.type))
  }
}
