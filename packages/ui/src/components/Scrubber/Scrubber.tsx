import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes, useState } from 'react'
import { Scrubber as BaseScrubber } from 'react-scrubber'
import styles from './Scrubber.module.scss'
import './Scrubber.scss'

export interface ScrubberProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number
  duration: number
  disabled?: boolean
  onChange: (value: number) => void
}

export const Scrubber: FunctionComponent<ScrubberProps> = ({ value, duration, disabled, onChange, className, ...props }) => {
  const [active, setActive] = useState(false)
  const formattedValue = Math.round(value * 100) / 100
  return (
    <div className={clsx(styles['scrubber'], disabled && styles['disabled'], active && styles['active'], className)} {...props}>
      <div className={styles['label']} style={{ left: `${value * 100 / duration}%` }}>{formattedValue}s</div>
      <BaseScrubber min={0} max={duration} value={value} onScrubStart={() => {
        setActive(true)
      }} onScrubEnd={() => {
        setActive(false)
      }} onScrubChange={(val) => {
        onChange(val)
      }} />
    </div>
  )
}
