import { AnimProperty, AnimTimeline } from '@figmania/common'
import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes, useMemo } from 'react'
import { round } from '../../../util/math'
import { Transition } from '../../../util/transition'
import { Icon } from '../../Icon/Icon'
import { Timeline, TimelineBarConfig, TransitionConfig } from '../Timeline/Timeline'
import styles from './Editor.module.scss'

export type TransitionConfigMap = Record<AnimProperty, TransitionConfig>

export type TransitionDataMap = Record<AnimProperty, Transition[]>

export type AnimTransitionDataMap = Record<AnimProperty, AnimTimeline[]>

export interface EditorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  bar: TimelineBarConfig
  config: TransitionConfigMap
  timelines: AnimTimeline[]
  allowMultiple?: boolean
  onChange: (timelines: AnimTimeline[]) => void
}

export const Editor: FunctionComponent<EditorProps> = ({ bar, config, timelines, allowMultiple, onChange, className, ...props }) => {
  const numSlots = Math.ceil(bar.duration / bar.tick) + 1
  const slots = Array(numSlots).fill(null).map((_, index) => index)
  const properties: AnimProperty[] = Object.keys(config) as AnimProperty[]

  const renderTimelines = useMemo<AnimTimeline[]>(() => {
    return properties.map<AnimTimeline>((property) => {
      const timeline = timelines.find((item) => item.property === property)
      if (timeline) { return timeline }
      return { property, initialValue: config[property].from, transitions: [] }
    })
  }, [timelines])

  return (
    <div className={clsx(styles['editor'], className)} {...props}>
      <div className={clsx(styles['column'], styles['column-left'])}>
        <div className={clsx(styles['cell'], styles['header'])}>PROPERTY</div>
        {properties.map((property) => {
          const timeline = timelines.find((item) => item.property === property)
          const isActive = timeline && timeline.transitions.length > 0
          return (
            <div key={property} className={clsx(
              styles['cell'],
              styles['label'],
              isActive && styles['active']
            )}>
              <Icon icon={config[property].icon} />
              <span>{config[property].label}</span>
            </div>
          )
        })}
      </div>
      <div className={clsx(styles['column'], styles['column-right'])}>
        <div className={styles['scrollable']}>
          <div className={clsx(styles['cell'], styles['header'])}>
            {slots.map((index) => {
              const time = round(index * bar.tick)
              return (
                <div key={index} className={clsx(styles['cell-tick'], styles[`tick-${index % 10}`])}>
                  {(index % 10) === 0 && (<div>{time}s</div>)}
                  {(index % 10) === 5 && (<div>{time}s</div>)}
                </div>
              )
            })}
          </div>
          {renderTimelines.map((timeline) => (
            <Timeline className={styles['cell']} key={timeline.property} bar={bar}
              timeline={timeline} config={config[timeline.property]}
              allowMultiple={allowMultiple}
              onChange={(newTimeline) => {
                const newTimelines = renderTimelines.map((value) => (newTimeline.property === value.property) ? newTimeline : value)
                onChange(newTimelines)
              }} />
          ))}
        </div>
      </div>
    </div>
  )
}
