import clsx from 'clsx'
import { HTMLAttributes } from 'react'
import { Transition } from '../../../util/transition'
import { Icon } from '../../Icon/Icon'
import { Timeline, TimelineConfig } from '../Timeline/Timeline'
import styles from './Editor.module.scss'

export type TimelineConfigMap<T extends string> = Record<T, TimelineConfig>

export type TimelineDataMap<T extends string> = Record<T, Transition[]>

export interface EditorProps<T extends string> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  duration: number
  config: TimelineConfigMap<T>
  data: TimelineDataMap<T>
  rowHeight?: number
  onChange: (data: TimelineDataMap<T>) => void
}

export function Editor<T extends string>({ duration, config, data, rowHeight = 54, onChange, className, ...props }: EditorProps<T>) {
  const slots = Array(Math.ceil(duration) + 1).fill(null).map((_, index) => index)
  const propertyKeys: T[] = Object.keys(config) as T[]
  return (
    <div className={clsx(styles['editor'], className)} {...props}>
      <div className={clsx(styles['col'], styles['col-labels'])}>
        <div className={styles['header']}>PROPERTY</div>
        {propertyKeys.map((propertyKey) => (
          <div key={propertyKey} className={styles['label']} style={{ height: rowHeight }}>
            <Icon icon={config[propertyKey].icon} />
            <span>{config[propertyKey].label}</span>
          </div>
        ))}
      </div>
      <div className={clsx(styles['col'], styles['col-timelines'])}>
        <div className={styles['container']}>
          <div className={clsx(styles['header'])}>
            {slots.map((index) => (
              <div key={index} className={clsx(styles['cell-tick'], styles[`tick-${index % 10}`])}>
                {(index % 10) === 0 && (<div>{index / 10}s</div>)}
                {(index % 10) === 5 && (<div>{index / 10}s</div>)}
              </div>
            ))}
          </div>
          {propertyKeys.map((propertyKey) => {
            const timelineConfig = config[propertyKey]
            const transitions = data[propertyKey]
            return (
              <Timeline key={propertyKey} duration={duration} style={{ height: rowHeight }}
                transitions={transitions} config={timelineConfig}
                onChange={(newTransitions) => { onChange({ ...data, [propertyKey]: newTransitions }) }} />
            )
          })}
        </div>
      </div>
    </div>
  )
}
