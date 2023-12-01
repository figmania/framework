import clsx from 'clsx'
import { ChangeEvent, FunctionComponent, HTMLAttributes, InputHTMLAttributes, useRef } from 'react'
import { ICON, Icon } from '../../Icon/Icon'
import styles from './TextInput.module.scss'

export interface TextInputProps extends Omit<HTMLAttributes<HTMLLabelElement>, 'onChange'> {
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
      {icon && <Icon icon={icon}></Icon>}
      <input className={styles['input']} {...inputOpts} id={inputId} name={name} type={type} placeholder={placeholder} value={value} disabled={disabled}
        onChange={(event) => { onChange(event.target.value, event) }}
        onFocus={(event) => { event.target.select() }} />
    </label>
  )
}
