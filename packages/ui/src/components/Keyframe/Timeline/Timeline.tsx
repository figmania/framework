import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes, useMemo, useState } from 'react'
import { DragEvent, useDragSlots } from '../../../hooks/useDragSlots'
import { Delta, Transition, nextTransition, nextTransitionIndex, prevTransition, prevTransitionIndex, transitionForIndex } from '../../../util/transition'
import { NumberInput } from '../../Form/NumberInput/NumberInput'
import { ICON } from '../../Icon/Icon'
import { Slot, SlotUiState } from '../Slot/Slot'
import styles from './Timeline.module.scss'

export type TypelineOperation = 'insert' | 'update' | 'delete'

export interface TransitionState extends Transition {
  operation: 'insert' | 'update' | 'move'
  index: number
  origin: number
  edge?: 'from' | 'to'
}

export interface TimelineConfig {
  icon: ICON
  label: string
  from: number
  to: number
  precision: number
  min: number
  max: number
  step: number
  suffix?: string
}

export interface TimelineProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  duration: number
  config: TimelineConfig
  transitions: Transition[]
  onChange: (transitions: Transition[]) => void
}

export const Timeline: FunctionComponent<TimelineProps> = ({ duration, config, transitions, className, onChange, ...props }) => {
  const slots = Array(Math.ceil(duration) + 1).fill(null).map((_, index) => index)
  const [state, setState] = useState<TransitionState>()

  const renderTransitions = useMemo(() => {
    if (!state) { return transitions }
    const result = [...transitions]
    result[state.index] = { value: state.value, interval: state.interval }
    return result
  }, [transitions, state])

  function computeNewValue(index: number): Delta {
    const prev = prevTransition(transitions, index)
    const next = nextTransition(transitions, index)
    return { from: prev?.value.to ?? config.from, to: next?.value.from ?? config.to }
  }

  const [ref, dragEvent] = useDragSlots('.col', (event) => {
    const updateTransition = transitions.find(({ interval }) => event.from === interval.from || event.from === interval.to)
    const moveTransition = transitions.find(({ interval }) => event.from > interval.from && event.from < interval.to)
    if (updateTransition) {
      setState({ operation: 'update', origin: event.to, index: transitions.indexOf(updateTransition), interval: updateTransition.interval, value: updateTransition.value, edge: updateTransition.interval.from === event.from ? 'from' : 'to' })
    } else if (moveTransition) {
      setState({ operation: 'move', origin: event.to, index: transitions.indexOf(moveTransition), interval: moveTransition.interval, value: moveTransition.value })
    } else {
      setState({ operation: 'insert', origin: event.to, index: transitions.length, interval: event, value: { from: NaN, to: NaN } })
    }
    return true
  }, ({ to: index }: DragEvent) => {
    if (!state || !dragEvent) { return }
    if (state.operation === 'move') {
      const delta = index - state.origin
      const transition = transitions[state.index]
      const from = transition.interval.from + delta
      const to = transition.interval.to + delta
      if (from <= prevTransitionIndex(transitions, transition.interval.from)) { return }
      if (to >= nextTransitionIndex(transitions, transition.interval.to)) { return }
      if (from < 0 || to >= slots.length) { return }
      setState({ ...state, interval: { from, to } })
    } else {
      if (index <= prevTransitionIndex(transitions, state.interval.from)) { return }
      if (index >= nextTransitionIndex(transitions, state.interval.to)) { return }
      if (state.interval.from === state.interval.to) {
        if (index > state.interval.to) {
          setState({ ...state, edge: 'to', interval: { from: state.interval.from, to: index } })
        } else {
          setState({ ...state, edge: 'from', interval: { from: index, to: state.interval.to } })
        }
      } else if (state.edge === 'to' && index > state.interval.from) {
        setState({ ...state, interval: { from: state.interval.from, to: index } })
      } else if (state.edge === 'from' && index < state.interval.to) {
        setState({ ...state, interval: { from: index, to: state.interval.to } })
      }
    }
  }, () => {
    if (!state) { return }
    setState(undefined)
    if (state.interval.from === state.interval.to) { return }
    if (state.index < transitions.length) {
      onChange([...transitions].map((v, i) => i === state.index ? { ...v, interval: state.interval } : v))
    } else {
      onChange([...transitions, { interval: state.interval, value: computeNewValue(state.origin) }])
    }
  }, [state])

  function onDataChange(index: number, value: number) {
    const transition = transitionForIndex(transitions, index)
    if (!transition) { return }
    const edge = index === transition.interval.from ? 'from' : 'to'
    const inverseEdge = index === transition.interval.from ? 'to' : 'from'
    if (value === transition.value[edge]) { return }
    const newTransitions = [...transitions]
    newTransitions[transitions.indexOf(transition)] = { ...transition, value: { ...transition.value, [edge]: value } }
    const adjacent = edge === 'from' ? prevTransition(transitions, transition.interval.from) : nextTransition(transitions, transition.interval.to)
    if (adjacent) { newTransitions[transitions.indexOf(adjacent)] = { ...adjacent, value: { ...adjacent.value, [inverseEdge]: value } } }
    onChange(newTransitions)
  }

  return (
    <div ref={ref} className={clsx(styles['timeline'], className)} {...props}>
      {slots.map((index) => {
        const isTransition = renderTransitions.some(({ interval }) => index >= interval.from && index <= interval.to)
        const isStart = renderTransitions.some(({ interval }) => index === interval.from)
        const startData = renderTransitions.find(({ interval }) => interval.from === index)?.value.from
        const isEnd = renderTransitions.some(({ interval }) => index === interval.to)
        const endData = renderTransitions.find(({ interval }) => interval.to === index)?.value.to
        let uiState = SlotUiState.DEFAULT
        if (state?.operation === 'move' && index >= state.interval.from && index <= state.interval.to) {
          uiState = SlotUiState.SELECTED
        } else if (state?.edge) {
          uiState = state.interval[state.edge] === index ? SlotUiState.ACTIVE : SlotUiState.INACTIVE
        }
        return (
          <div key={index} className={clsx(styles['col'], 'col')}>
            <div className={clsx(styles['cell'], styles['cell-input'])}>
              {isStart && startData != null && !isNaN(startData) && (
                <NumberInput className={styles['control']} name='start'
                  value={startData} defaultValue={startData}
                  min={config.min} max={config.max} step={config.step}
                  precision={config.precision} suffix={config.suffix}
                  onChange={(value) => { onDataChange(index, value) }} />
              )}
              {isEnd && endData != null && !isNaN(endData) && (
                <NumberInput className={styles['control']} name='end'
                  value={endData} defaultValue={endData}
                  min={config.min} max={config.max} step={config.step}
                  precision={config.precision} suffix={config.suffix}
                  onChange={(value) => { onDataChange(index, value) }} />
              )}
            </div>
            <Slot className={clsx(styles['cell'], styles['cell-slot'])}
              uiState={uiState}
              transitionState={isTransition ? [isStart, isEnd] : undefined}
              onDoubleClick={() => {
                const transition = transitions.find(({ interval }) => index >= interval.from && index <= interval.to)
                if (transition) {
                  const deleteIndex = transitions.indexOf(transition)
                  onChange(transitions.filter((_, i) => i !== deleteIndex))
                } else {
                  const from = Math.max(prevTransitionIndex(transitions, index), -1) + 1
                  const to = Math.min(nextTransitionIndex(transitions, index), slots.length) - 1
                  const transitionLength = to - from + 1
                  if (transitionLength <= 1) { return }
                  onChange([...transitions, { interval: { from, to }, value: computeNewValue(index) }])
                }
              }} />
            <div className={clsx(styles['cell'], styles['cell-tick'], styles[`tick-${index % 10}`])}></div>
          </div>
        )
      })}
    </div >
  )
}
