import { AnimTimeline, AnimTransition } from '@figmania/common'
import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes, useMemo, useState } from 'react'
import { DragEvent, useDragSlots } from '../../../hooks/useDragSlots'
import { round } from '../../../util/math'
import { nextTransition, prevTransition, queryTransitions, transitionForTime, transitionSortFn } from '../../../util/transition'
import { NumberInput } from '../../Form/NumberInput/NumberInput'
import { ICON } from '../../Icon/Icon'
import { Slot, SlotUiState } from '../Slot/Slot'
import styles from './Timeline.module.scss'

export type TypelineOperation = 'insert' | 'update' | 'delete'

export interface TransitionState extends AnimTransition {
  operation: 'insert' | 'update' | 'move'
  index: number
  origin: number
  edge?: 'from' | 'to'
}

export interface TransitionConfig {
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

export interface TimelineBarConfig {
  tick: number
  duration: number
}

export interface TimelineProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  bar: TimelineBarConfig
  config: TransitionConfig
  timeline: AnimTimeline
  onChange: (timeline: AnimTimeline) => void
}

export const Timeline: FunctionComponent<TimelineProps> = ({ bar: { duration, tick }, config, timeline, className, onChange, ...props }) => {
  const numSlots = Math.ceil(duration / tick) + 1
  const slots = Array(numSlots).fill(null).map((_, index) => index)
  const [state, setState] = useState<TransitionState>()

  const transitions = useMemo(() => {
    if (!state) { return timeline.transitions }
    const result = [...timeline.transitions]
    result[state.index] = { from: state.from, to: state.to, value: state.value, ease: state.ease }
    return result
  }, [timeline.transitions, state])

  function computeNewValue(from: number, to: number): number {
    const prev = prevTransition(transitions, from)
    const next = nextTransition(transitions, to)
    let value = config.to
    if (!prev && !next) {
      value = config.to
    } else if (prev && !next) {
      value = config.to
    } else if (!prev && next) {
      value = timeline.initialValue
    } else if (prev && next) {
      value = prev.value
    }
    return value
  }

  function onDragStart({ to }: DragEvent) {
    const time = round(to * tick)
    const query = queryTransitions(timeline.transitions, time)
    if (query.first && query.edge) {
      setState({
        operation: 'update',
        origin: time,
        index: -1, // transitions.indexOf(query.first),
        edge: query.first.from === time ? 'from' : 'to',
        from: query.first.from,
        to: query.first.to,
        value: query.first.value,
        ease: query.first.ease
      })
    } else if (query.first) {
      setState({
        operation: 'move',
        origin: time,
        index: transitions.indexOf(query.first),
        from: query.first.from,
        to: query.first.to,
        value: query.first.value,
        ease: query.first.ease
      })
    } else {
      setState({
        operation: 'insert',
        origin: time,
        index: transitions.length,
        from: time,
        to: time,
        value: computeNewValue(time, time),
        ease: 'ease-in-out'
      })
    }
    return true
  }

  function onDragMove(event: DragEvent) {
    if (!state || !dragEvent) { return }
    const time = round(event.to * tick)
    const query = queryTransitions(timeline.transitions, state.origin)
    if (state.operation === 'update') {
      const direction = event.to - event.from
      const transition = (state.index !== -1) ? timeline.transitions[state.index] : (direction > 0 ? query.last : query.first)
      if (!transition) { return }
      if (query.prev && time < query.prev.to) { return }
      if (query.next && time > query.next.from) { return }
      if (timeline.transitions.some((item) => item !== transition && time > item.from && time < item.to)) { return }
      const newState: TransitionState = (state.index === -1) ? {
        operation: state.operation, origin: state.origin,
        index: timeline.transitions.indexOf(transition),
        edge: transition.from === state.origin ? 'from' : 'to',
        from: transition.from, to: transition.to,
        value: transition.value, ease: transition.ease
      } : { ...state }
      if (newState.edge === 'to' && time > newState.from) {
        newState.to = time
      } else if (newState.edge === 'from' && time < newState.to) {
        newState.from = time
      }
      setState(newState)
    } else if (state.operation === 'move') {
      const delta = round(time - state.origin)
      const from = round(query.from + delta)
      const to = round(query.to + delta)
      if (query.prev && from < query.prev.to) { return }
      if (query.next && to > query.next.from) { return }
      if (from < 0 || to > duration) { return }
      setState({ ...state, from, to })
    } else if (state.operation === 'insert') {
      if (time < 0 || time > duration) { return }
      if (query.prev && time < query.prev.to) { return }
      if (query.next && time > query.next.from) { return }
      if (state.from === state.to) {
        if (time > state.to) {
          setState({ ...state, edge: 'to', from: state.from, to: time })
        } else {
          setState({ ...state, edge: 'from', from: time, to: state.to })
        }
      } else if (state.edge === 'to' && time > state.from) {
        setState({ ...state, from: state.from, to: time })
      } else if (state.edge === 'from' && time < state.to) {
        setState({ ...state, from: time, to: state.to })
      }
    }
  }

  function onDragEnd() {
    if (!state) { return }
    setState(undefined)
    if (state.from === state.to) { return }
    if (state.index < transitions.length) {
      const newTransitions = [...transitions].map((item, i) => i === state.index ? { from: state.from, to: state.to, value: item.value, ease: item.ease } : item)
      onChange({ ...timeline, transitions: newTransitions })
    } else {
      const value = nextTransition(transitions, state.origin)?.value ?? config.to
      const newTransitions = [...transitions, { from: state.from, to: state.to, value, ease: state.ease }]
      onChange({ ...timeline, transitions: newTransitions })
    }
  }

  const [ref, dragEvent] = useDragSlots('.col', onDragStart, onDragMove, onDragEnd, [state])

  return (
    <div ref={ref} className={clsx(styles['timeline'], className)} {...props}>
      {slots.map((index) => {
        const time = round(index * tick)
        const modulo = round(time % 1 * 1000)
        const query = queryTransitions(transitions, time)
        const isTransition = query.length > 0
        const isDualTransition = query.length > 1
        const isStart = transitions.some(({ from }) => time === from)
        const startData = query.prev?.value ?? timeline.initialValue
        const isEnd = transitions.some(({ to }) => time === to)
        const endData = transitions.find(({ to }) => to === time)?.value
        let uiState = SlotUiState.DEFAULT
        if (state?.operation === 'move' && time >= state.from && time <= state.to) {
          uiState = SlotUiState.SELECTED
        } else if (state?.edge) {
          uiState = state[state.edge] === time ? SlotUiState.ACTIVE : SlotUiState.INACTIVE
        }
        return (
          <div key={index} className={clsx(styles['col'], 'col')}>
            <div className={clsx(styles['cell'], styles['cell-input'])}>
              {!isDualTransition && isStart && startData != null && !isNaN(startData) && (
                <NumberInput className={styles['control']} name='start'
                  value={startData} defaultValue={startData}
                  min={config.min} max={config.max} step={config.step}
                  precision={config.precision} suffix={config.suffix}
                  onChange={(value) => {
                    const transition = prevTransition(transitions, time)
                    if (transition) {
                      const newTransitions = [...transitions]
                      newTransitions[transitions.indexOf(transition)] = {
                        from: transition.from,
                        to: transition.to,
                        value,
                        ease: transition.ease
                      }
                      onChange({ ...timeline, transitions: newTransitions })
                    } else {
                      onChange({ ...timeline, initialValue: value })
                    }
                  }} />
              )}
              {isEnd && endData != null && !isNaN(endData) && (
                <NumberInput className={styles['control']} name='end'
                  value={endData} defaultValue={endData}
                  min={config.min} max={config.max} step={config.step}
                  precision={config.precision} suffix={config.suffix}
                  onChange={(value) => {
                    const transition = transitionForTime(transitions, time)
                    if (!transition) { return }
                    if (value === transition.value) { return }
                    const newTransitions = [...transitions]
                    newTransitions[transitions.indexOf(transition)] = {
                      from: transition.from,
                      to: transition.to,
                      value,
                      ease: transition.ease
                    }
                    onChange({ ...timeline, transitions: newTransitions })
                  }} />
              )}
            </div>
            <Slot className={clsx(styles['cell'], styles['cell-slot'])}
              uiState={uiState}
              transitionState={isTransition ? [isStart, isEnd] : undefined}
              isDual={isDualTransition}
              onDoubleClick={() => {
                const { all, first, prev, space } = queryTransitions(timeline.transitions, time)
                if (first) {
                  const newTransitions = timeline.transitions.filter((transision) => !all.includes(transision))
                  let initialValue = timeline.initialValue
                  if (!prev) { initialValue = first.value }
                  if (newTransitions.length === 0) { initialValue = config.from }
                  onChange({ ...timeline, initialValue, transitions: newTransitions })
                } else if (space) {
                  const from = Math.max(space.from, 0)
                  const to = Math.min(space.to, duration)
                  const transitionLength = round(to - from)
                  if (transitionLength <= tick) { return }
                  const value = computeNewValue(from, to)
                  const newTransition: AnimTransition = { from, to, value, ease: 'ease-in-out' }
                  const newTransitions = [...timeline.transitions, newTransition].sort(transitionSortFn)
                  onChange({ ...timeline, transitions: newTransitions })
                }
              }} />
            <div className={clsx(styles['cell'], styles['cell-tick'], styles[`tick-${modulo}`])}></div>
          </div>
        )
      })}
    </div>
  )
}
