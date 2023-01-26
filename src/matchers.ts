import { escapeRegExp } from '@devoxa/flocky'

/** Create a RegExp that starts with the value. */
export function $startsWith(value: string) {
  return new RegExp('^' + escapeRegExp(value))
}

/** Create a RegExp that contains the value. */
export function $contains(value: string) {
  return new RegExp(escapeRegExp(value))
}

/** Create a RegExp that ends with the value. */
export function $endsWith(value: string) {
  return new RegExp(escapeRegExp(value) + '$')
}
