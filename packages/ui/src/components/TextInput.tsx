import clsx from 'clsx'
import { ChangeEvent, FunctionComponent, InputHTMLAttributes, LabelHTMLAttributes, useRef } from 'react'
import { Icon, ICON } from './Icon'
import styles from './Input.module.scss'

export interface TextInputProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'onChange'> {
  type: 'text' | 'password'
  name: string
  value: string
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  inputOpts?: InputHTMLAttributes<HTMLInputElement>
  id?: string
  icon?: ICON
  disabled?: boolean
}

export const TextInput: FunctionComponent<TextInputProps> = ({ id, className, placeholder, type, name, icon, disabled, inputOpts, value, onChange, ...props }) => {
  const uniqueId = useRef(Math.random().toString(36).substring(4))
  const inputId = id ?? `${name}-${uniqueId.current}`
  return (
    <label htmlFor={inputId} className={clsx(
      styles['label'],
      disabled && styles['disabled'],
      icon && styles['with-icon'],
      className
    )} {...props}>
      {icon && <Icon icon={icon} mute></Icon>}
      <input className={styles['input']} {...inputOpts} id={inputId} name={name} type={type} placeholder={placeholder} value={value} disabled={disabled}
        onChange={(event) => { onChange(event.target.value, event) }}
        onFocus={(event) => { event.target.select() }} />
    </label>
  )
}
