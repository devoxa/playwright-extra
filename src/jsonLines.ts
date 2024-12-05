import fs from 'fs/promises'

/** Append a line to a file in JSON Lines format. */
export async function jsonLinesAppend(filePath: string, line: unknown): Promise<void> {
  await fs.appendFile(filePath, JSON.stringify(line) + '\n', 'utf-8')
}

/** Parse a file in JSON Lines format. */
export async function jsonLinesParse<T = unknown>(filePath: string): Promise<Array<T>> {
  const file = await fs.readFile(filePath, 'utf-8')

  return file
    .split('\n')
    .slice(0, -1) // Remove the last newline
    .map((line) => JSON.parse(line) as T)
}
