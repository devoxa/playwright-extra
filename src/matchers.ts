import { escapeRegExp } from '@devoxa/flocky'

type DynamicSegments = Record<string, string>

/** Create a RegExp that starts with the value. */
export function $startsWith(value: string, dynamicSegments?: DynamicSegments) {
  return new RegExp('^' + applyDynamicSegments(escapeRegExp(value), dynamicSegments))
}

/** Create a RegExp that contains the value. */
export function $contains(value: string, dynamicSegments?: DynamicSegments) {
  return new RegExp(applyDynamicSegments(escapeRegExp(value), dynamicSegments))
}

/** Create a RegExp that ends with the value. */
export function $endsWith(value: string, dynamicSegments?: DynamicSegments) {
  return new RegExp(applyDynamicSegments(escapeRegExp(value), dynamicSegments) + '$')
}

function applyDynamicSegments(value: string, dynamicSegments = {} as DynamicSegments) {
  for (const key in dynamicSegments) {
    value = value.replace(new RegExp(':' + key, 'g'), dynamicSegments[key])
  }

  return value
}
