import { AnimDefaults } from '../types/AnimDefaults'
import { AnimEase } from '../types/AnimEase'
import { AnimTransition } from '../types/AnimTransition'

export function deserializeAnimString(value: string, defaults: AnimDefaults): [number, AnimTransition[]] {
  const initialValue = parseFloat(value.match(/^([0-9-.]+)\[/)![1])
  const matches = [...value.matchAll(/\[([0-9-.]+):([0-9-.]+):([0-9-.]+):?([a-z-]+)?\]/g)]
  const transitions = matches.map<AnimTransition>((match) => ({
    from: parseFloat(match[1]),
    to: parseFloat(match[2]),
    value: parseFloat(match[3]),
    ease: match[4] as AnimEase ?? defaults.ease
  }))
  return [initialValue, transitions]
}

export function serializeAnimString(initialValue: number, transitions: AnimTransition[]): string | null {
  if (transitions.length === 0) { return null }
  const sortedTransitions = transitions.sort((a, b) => a.from - b.from)
  const groups = sortedTransitions.map(({ from, to, value, ease }) => {
    return `${from}:${to}:${value}:${ease}`
  }).map((result) => `[${result}]`).join('')
  return `${initialValue}${groups}`
}
