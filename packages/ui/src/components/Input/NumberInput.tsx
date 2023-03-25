import clsx from 'clsx'
import { ChangeEvent, createRef, FunctionComponent, HTMLAttributes, InputHTMLAttributes, useEffect, useRef, useState } from 'react'
import { Icon, ICON } from '../Icon/Icon'
import styles from './Input.module.scss'

export interface NumberInputProps extends Omit<HTMLAttributes<HTMLLabelElement>, 'onChange'> {
  name: string
  value: number
  precision: number
  onChange: (value: number, event: ChangeEvent<HTMLInputElement>) => void
  defaultValue: number
  fadeDefault?: boolean
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  inputOpts?: InputHTMLAttributes<HTMLInputElement>
  id?: string
  icon?: ICON
  disabled?: boolean
}

export const NumberInput: FunctionComponent<NumberInputProps> = ({ id, className, name, icon, disabled, inputOpts, precision, value, defaultValue, min, max, step, prefix, suffix, fadeDefault, onChange, ...props }) => {
  const [error, setError] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState<string>('')
  const uniqueId = useRef(Math.random().toString(36).substring(4))
  const input = createRef<HTMLInputElement>()

  const factor = Math.pow(10, precision)
  const fraction = 1 / factor

  function valueToEditValue(val: number): string {
    if (val == null) { return '' }
    return String(Math.round((val / fraction) * factor) / factor)
  }

  function editValueToValue(val: string): number {
    return +val / factor
  }


  const fractionValue = Math.round((fadeDefault ? value : (value ?? defaultValue)) * factor * factor) / factor
  const formattedValue = `${prefix ? prefix : ''}${fractionValue}${suffix ? suffix : ''}`

  useEffect(() => {
    if (!editing || !input.current) { return }
    input.current.select()
  }, [editing])

  const inputId = id ?? `${name}-${uniqueId.current}`
  return (
    <label htmlFor={inputId} className={clsx(
      styles['label'],
      disabled && styles['disabled'],
      icon && styles['with-icon'],
      error && styles['error'],
      className
    )} {...props}>
      {icon && <Icon icon={icon}></Icon>}
      {editing ? (
        <input ref={input} id={inputId} name={name} type='number' value={editValue} className={styles['input']} disabled={disabled} {...inputOpts}
          min={min != null ? min * factor : undefined} max={max != null ? max * factor : undefined} step={step != null ? step * factor : undefined}
          onChange={(event) => {
            setEditValue(event.target.value)
            let inputError = false
            const newValue = event.target.value === '' ? defaultValue : editValueToValue(event.target.value)
            if (min != null && newValue < min) { inputError = true }
            if (max != null && newValue > max) { inputError = true }
            setError(inputError)
            if (!inputError) { onChange(newValue, event) }
          }} onBlur={() => {
            setEditing(false)
          }} />
      ) : (
        <input id={inputId} name={name} type="text" className={clsx(styles['input'], className)} disabled={disabled}
          value={(fadeDefault && value === defaultValue) ? '' : formattedValue} placeholder={fadeDefault ? formattedValue : undefined}
          onFocus={() => {
            setEditValue(valueToEditValue(value))
            setError(false)
            setEditing(true)
          }} readOnly />
      )}
    </label>
  )
}
