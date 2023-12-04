import { AnimTransition } from '@figmania/common'

export interface Transition {
  interval: Delta
  value: Delta
}

export interface Delta {
  from: number
  to: number
}

export function transitionForTime(transitions: AnimTransition[], time: number): AnimTransition | undefined {
  return transitions.find(({ from, to }) => time >= from && time <= to)
}

export function prevTransitionTime(transitions: AnimTransition[], time: number): number {
  return Math.max(...transitions.map(({ to }) => to).filter((value) => value < time))
}

export function nextTransitionTime(transitions: AnimTransition[], time: number): number {
  return Math.min(...transitions.map(({ from }) => from).filter((value) => value > time))
}

export function prevTransition(transitions: AnimTransition[], time: number): AnimTransition | undefined {
  return transitionForTime(transitions, prevTransitionTime(transitions, time))
}

export function nextTransition(transitions: AnimTransition[], time: number): AnimTransition | undefined {
  return transitionForTime(transitions, nextTransitionTime(transitions, time))
}

export function prevTransitionOf(transitions: AnimTransition[], transition: AnimTransition): AnimTransition | undefined {
  const adjacents = transitions.filter((entry) => entry !== transition)
  return transitionForTime(adjacents, prevTransitionTime(adjacents, transition.from))
}

export function nextTransitionOf(transitions: AnimTransition[], transition: AnimTransition): AnimTransition | undefined {
  const adjacents = transitions.filter((entry) => entry !== transition)
  return transitionForTime(adjacents, nextTransitionTime(adjacents, transition.to))
}

export function adjacentTransitions(transitions: AnimTransition[], transition: AnimTransition): [AnimTransition | undefined, AnimTransition | undefined] {
  const adjacents = transitions.filter((entry) => entry !== transition)
  return [
    transitionForTime(adjacents, prevTransitionTime(adjacents, transition.from)),
    transitionForTime(adjacents, nextTransitionTime(adjacents, transition.to))
  ]
}

export interface QueryTransitionsScope {
  all: AnimTransition[]
  edge: boolean
  start: boolean
  end: boolean
  length: number
  any: boolean
  first: AnimTransition | undefined
  last: AnimTransition | undefined
  from: number
  to: number
  before: AnimTransition[]
  after: AnimTransition[]
  prev: AnimTransition | undefined
  next: AnimTransition | undefined
  adjacents: [AnimTransition | undefined, AnimTransition | undefined]
  space?: Delta
}

export function transitionSortFn(a: AnimTransition, b: AnimTransition): number {
  return (a.to + a.from) / 2 - (b.to + b.from) / 2
}

export function queryTransitions(initialTransitions: AnimTransition[], time: number): QueryTransitionsScope {
  if (!initialTransitions) {
    debugger
  }
  const transitions = [...initialTransitions].sort(transitionSortFn)
  const all: AnimTransition[] = transitions.filter(({ from, to }) => time >= from && time <= to)
  const edge = all.some((transition) => transition.from === time || transition.to === time)
  const start = all.some((transition) => transition.from === time)
  const end = all.some((transition) => transition.to === time)
  const any = all.length > 0
  const length = all.length
  const first = all[0]
  const last = all[all.length - 1]
  const from = first?.from ?? time
  const to = last?.to ?? time
  const before = transitions.filter((transition) => transition.to <= from && !all.includes(transition))
  const after = transitions.filter((transition) => transition.from >= to && !all.includes(transition))
  const prev = before[before.length - 1]
  const next = after[0]
  const adjacents = [prev, next] as [AnimTransition | undefined, AnimTransition | undefined]
  const space = any ? undefined : { from: prev?.to ?? -Infinity, to: next?.from ?? Infinity }
  return { all, edge, start, end, length, any, first, last, from, to, before, after, prev, next, adjacents, space }
}
