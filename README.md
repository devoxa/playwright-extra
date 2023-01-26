<!-- Title -->
<h1 align="center">
  playwright-extra
</h1>

<!-- Description -->
<h4 align="center">
  Extra utility functions for interacting with Playwright.
</h4>

<!-- Badges -->
<p align="center">
  <a href="https://www.npmjs.com/package/@devoxa/playwright-extra">
    <img
      src="https://img.shields.io/npm/v/@devoxa/playwright-extra?style=flat-square"
      alt="Package Version"
    />
  </a>

  <a href="https://github.com/devoxa/playwright-extra/actions?query=branch%3Amaster+workflow%3A%22Continuous+Integration%22">
    <img
      src="https://img.shields.io/github/actions/workflow/status/devoxa/playwright-extra/push.yml?branch=master&style=flat-square"
      alt="Build Status"
    />
  </a>
</p>

<!-- Quicklinks -->
<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#contributors">Contributors</a> •
  <a href="#license">License</a>
</p>

<br>

## Installation

```bash
yarn add @devoxa/playwright-extra
```

## Usage

### Assertions

```ts
await expectToExist(locator)
```

Expect the locator to exist exactly once.

```ts
await expectNotToExist(locator)
```

Expect the locator not to exist.

### Clipboard

> **Note:** These functions are not thread safe and a potential cause of race conditions.

```ts
await getClipboardValue(page)
```

Get the value of the clipboard.

```ts
await setClipboardValue(page, value)
```

Set the value of the clipboard.

### Accessability

```ts
await expectZeroAccessibilityViolations(page, config?)
```

Expect that there are no accessibility violations. This is a wrapper around `axe-playwright`, and
takes the same `config` as
[`configureAxe`](https://github.com/abhinaba-ghosh/axe-playwright#configureaxe). The assertion can
be turned off globally by setting `process.env.DISABLE_ACCESSIBILITY_TESTS` to `true`.

### JSON Lines

> **Note:** You can read more about the JSON Lines format [here](https://jsonlines.org/).

```ts
await jsonLinesAppend(filePath, line)
```

Append a line to a file in JSON Lines format.

```ts
await jsonLinesParse(filePath)
```

Parse a file in JSON Lines format.

### Local Storage

```ts
await getLocalStorageItem(page, key)
```

Get the value of a local storage item.

```ts
await setLocalStorageItem(page, key, value)
```

Set the value of a local storage item.

```ts
await removeLocalStorageItem(page, key)
```

Remove a local storage item.

### Matchers

> **Note:** These functions escape special regular expression characters, so they are safe to use
> for example for URLs with query strings.

```ts
await expect(page).toHaveURL($startsWith(value))
```

Create a RegExp that starts with the value.

```ts
await expect(page).toHaveURL($contains(value))
```

Create a RegExp that contains the value.

```ts
await expect(page).toHaveURL($endsWith(value))
```

Create a RegExp that ends with the value.

### Performance Metrics

```ts
const options = { filePath: 'performance-metrics.jsonl' }

await exportPerformanceMetrics(page, label, options?)
```

Export the performance metrics of the page to the file path. The output is in
[JSON Lines](#json-lines) format, and includes the `label`, `encodedBodySize`,
`resourceLoadDuration` and `nextjsHydrationDuration`.

- **This function is not supported in Webkit browsers.**
- Make sure to call the function right after loading the page to get correct results.
- The `performance-metrics.jsonl` file has to be manually removed, e.g. before running the tests.
- You can test the resulting export with the `yarn test-performance-metrics` CLI tool. See `--help`
  for the available options.

### Retry On Error

```ts
const options = { timeout: 5000, waitTime: 100 }

await retryOnError(asyncCallback, options?)
```

Retry until the callback is successful or the timeout is hit. This is useful for unstable parts of
tests, for example when waiting for an email that is sent out by a queue processor.

### Wait For Network Idle

```ts
const options = { timeout: 10000, minIdleTime: 200, debug: false }

const waitForNetworkIdlePromise = waitForNetworkIdle(page, options?)
// ... do things here ...
await waitForNetworkIdlePromise
```

Wait for all network requests to be settled before resolving.

```ts
await gotoAndWaitForNetworkIdle(page, url, options?)
```

Go to a page and wait for all network requests to be settled.

```ts
await reloadAndWaitForNetworkIdle(page, url, options?)
```

Reload the page and wait for all network requests to be settled.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.david-reess.de"><img src="https://avatars3.githubusercontent.com/u/4615516?v=4" width="75px;" alt=""/><br /><sub><b>David Reeß</b></sub></a><br /><a href="https://github.com/devoxa/playwright-extra/commits?author=queicherius" title="Code">💻</a> <a href="https://github.com/devoxa/playwright-extra/commits?author=queicherius" title="Documentation">📖</a> <a href="https://github.com/devoxa/playwright-extra/commits?author=queicherius" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!

## License

MIT
