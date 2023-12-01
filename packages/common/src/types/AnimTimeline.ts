import { AnimTransition } from './AnimTransition'

export type AnimProperty = 'x' | 'y' | 'scale' | 'rotation' | 'opacity'

export interface AnimTimeline {
  property: AnimProperty
  initialValue: number
  transitions: AnimTransition[]
}

export type AnimTimelineMap = Record<AnimProperty, AnimTimeline[]>

export const AnimProperties: AnimProperty[] = ['x', 'y', 'scale', 'rotation', 'opacity']
