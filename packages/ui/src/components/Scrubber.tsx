import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes, useState } from 'react'
import { Scrubber as BaseScrubber } from 'react-scrubber'
import styles from './Scrubber.module.scss'
import './Scrubber.scss'

export interface ScrubberProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number
  duration: number
  fraction: number
  prefix?: string
  suffix?: string
  disabled?: boolean
  onChange: (value: number) => void
}

function precisionRound(number: number, precision: number) {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}

export const Scrubber: FunctionComponent<ScrubberProps> = ({ value, duration, prefix, suffix, fraction, disabled, onChange, className, ...props }) => {
  const [active, setActive] = useState(false)
  const precision = fraction ? String(1 / fraction).length - 1 : 0
  const formattedValue = precisionRound(value / fraction, precision)
  const label = `${prefix ?? ''}${formattedValue}${suffix ?? ''}`
  return (
    <div className={clsx(styles['scrubber'], disabled && styles['disabled'], active && styles['active'], className)} {...props}>
      <div className={styles['label']} style={{ left: `${value * 100 / duration}%` }}>{label}</div>
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
