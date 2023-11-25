export interface Transition {
  interval: Delta
  value: Delta
}

export interface Delta {
  from: number
  to: number
}

export function transitionForIndex(transitions: Transition[], index: number): Transition | undefined {
  return transitions.find(({ interval }) => index >= interval.from && index <= interval.to)
}

export function prevTransitionIndex(transitions: Transition[], index: number): number {
  return Math.max(...transitions.map(({ interval }) => interval.to).filter((value) => value < index))
}

export function nextTransitionIndex(transitions: Transition[], index: number): number {
  return Math.min(...transitions.map(({ interval }) => interval.from).filter((value) => value > index))
}

export function prevTransition(transitions: Transition[], index: number): Transition | undefined {
  return transitionForIndex(transitions, prevTransitionIndex(transitions, index))
}

export function nextTransition(transitions: Transition[], index: number): Transition | undefined {
  return transitionForIndex(transitions, nextTransitionIndex(transitions, index))
}