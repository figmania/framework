import { AnimEase } from './AnimEase'

export interface AnimTransition {
  from: number
  to: number
  value: number
  ease: AnimEase
}
