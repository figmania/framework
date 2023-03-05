import clsx from 'clsx'
import { ChangeEvent, createRef, FunctionComponent, InputHTMLAttributes, LabelHTMLAttributes, useRef, useState } from 'react'
import { Icon, ICON } from './Icon'
import styles from './Input.module.scss'

export interface InputProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'onChange'> {
  type: 'text' | 'number' | 'password'
  name: string
  value: string | number
  onChange: (value: string | number, event: ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  prefix?: string
  suffix?: string
  fraction?: number
  inputOpts?: InputHTMLAttributes<HTMLInputElement>
  id?: string
  icon?: ICON
  defaultValue?: string | number
  disabled?: boolean
}

export interface InputState {
  editing: boolean
}

function precisionRound(number: number, precision: number) {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}

export const Input: FunctionComponent<InputProps> = ({ id, className, placeholder, type, name, icon, disabled, inputOpts, fraction, value, prefix, suffix, onChange, defaultValue, ...props }) => {
  const [editing, setEditing] = useState(false)
  const uniqueId = useRef(Math.random().toString(36).substring(4))
  const input = createRef<HTMLInputElement>()

  const precision = fraction ? String(1 / fraction).length - 1 : 0
  const editableValue = (value && type === 'number' && fraction)
    ? precisionRound(+value / fraction, precision)
    : value ?? ''
  const formattedValue = `${prefix ? prefix : ''}${editableValue}${suffix ? suffix : ''}`

  const inputId = id ?? `${name}-${uniqueId.current}`
  return (
    <label htmlFor={inputId} className={clsx(
      styles['input'],
      disabled && styles['disabled'],
      icon && styles['with-icon'],
      className
    )} {...props}>
      {icon && <Icon icon={icon} mute></Icon>}
      {editing ? (
        <input ref={input} {...inputOpts} id={inputId} name={name} type={type} placeholder={placeholder} value={editableValue} disabled={disabled} onChange={(event) => {
          if (!onChange) { return }
          let val: string | number = event.target.value
          if (event.target.value === '' && defaultValue) {
            val = defaultValue
          } else if (type === 'number') {
            val = Number(event.target.value)
            if (fraction) { val = precisionRound(val * fraction, precision) }
          }
          onChange(val, event)
        }} onBlur={() => {
          setEditing(false)
        }} />
      ) : (
        <input id={inputId} name={name} type="text" className={className} placeholder={placeholder} value={formattedValue} disabled={disabled} onFocus={() => {
          setEditing(true)
          input.current?.select()
        }} readOnly />
      )}
    </label>
  )
}
