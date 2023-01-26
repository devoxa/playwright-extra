import { randomString } from '@devoxa/flocky'
import { expect, test } from '@playwright/test'
import fs from 'fs/promises'
import { jsonLinesAppend, jsonLinesParse } from '../src/index'

test.describe('jsonLines', () => {
  test('interact with a json lines file', async () => {
    const FILE_NAME = `test-tmp/test-${randomString(6)}.jsonl`

    await jsonLinesAppend(FILE_NAME, { foo: 'bar', baz: 1 })
    await jsonLinesAppend(FILE_NAME, { foo: 'foobar', baz: 2 })

    const fileContent = await fs.readFile(FILE_NAME, 'utf-8')
    expect(fileContent).toMatchSnapshot()

    const parsedFile = await jsonLinesParse(FILE_NAME)
    expect(parsedFile).toEqual([
      { foo: 'bar', baz: 1 },
      { foo: 'foobar', baz: 2 },
    ])
  })
})
