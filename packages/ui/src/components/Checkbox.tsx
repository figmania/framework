import clsx from 'clsx'
import { ChangeEvent, FunctionComponent, HTMLAttributes, useRef } from 'react'
import styles from './Checkbox.module.scss'

export interface CheckboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name: string
  value?: boolean
  title: string
  onChange?: (value: boolean, event: ChangeEvent<HTMLInputElement>) => void
  id?: string
  disabled?: boolean
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({ id, className, disabled, title, name, value, onChange, ...props }) => {
  const uniqueId = useRef(Math.random().toString(36).substring(4))
  const inputId = id ?? `${name}-${uniqueId.current}`
  return (
    <div className={clsx(styles['checkbox'], className)} {...props}>
      <input type="checkbox" id={inputId} checked={value} disabled={disabled} onChange={(event) => {
        onChange?.(event.target.checked, event)
      }} />
      <label htmlFor={inputId}><span>{title}</span></label>
    </div>
  )
}
