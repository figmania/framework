import clsx from 'clsx'
import { ButtonHTMLAttributes, FunctionComponent, MouseEvent, ReactNode } from 'react'
import { ICON, Icon } from '../Icon/Icon'
import { ThemeSize } from '../PluginUI/PluginUI'
import styles from './Button.module.scss'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ICON
  color?: string
  selected?: boolean
  focus?: boolean
  disabled?: boolean
  label?: string
  size?: ThemeSize
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

export const Button: FunctionComponent<ButtonProps> = ({ className, icon, color, label, size, selected, focus, disabled, onClick, ...props }) => {
  return (
    <button disabled={disabled} onClick={onClick} className={clsx(
      styles['button'],
      selected && styles['selected'],
      focus && styles['focus'],
      icon ? styles['with-icon'] : styles['without-icon'],
      styles[size ?? 'md'],
      className
    )} {...props}>
      {icon && (<Icon className={styles['icon']} icon={icon} color={color} size={size} disabled={disabled}></Icon>)}
      {label && (<div className={styles['label']} style={{ color }}>{label}</div>)}
    </button>
  )
}

export interface ButtonGroupProps {
  className?: string
  children: ReactNode
}

export const ButtonGroup: FunctionComponent<ButtonGroupProps> = ({ className, children }) => {
  return (
    <div className={clsx(styles['button-group'], className)}>{children}</div>
  )
}
