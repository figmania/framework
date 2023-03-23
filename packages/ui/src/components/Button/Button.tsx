import clsx from 'clsx'
import { ButtonHTMLAttributes, FunctionComponent, MouseEvent, ReactNode } from 'react'
import { ICON, Icon } from '../Icon/Icon'
import { ThemeSize } from '../PluginUI/PluginUI'
import styles from './Button.module.scss'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ICON
  color?: string
  selected?: boolean
  disabled?: boolean
  title?: string
  size?: ThemeSize
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

export const Button: FunctionComponent<ButtonProps> = ({ className, icon, color, title, size, selected, disabled, onClick, ...props }) => {
  return (
    <button disabled={disabled} onClick={onClick} className={clsx(
      styles['button'],
      selected && styles['selected'],
      icon ? styles['with-icon'] : styles['without-icon'],
      styles[size ?? 'md'],
      className
    )} {...props}>
      {icon && (<Icon icon={icon} color={color} size={size} disabled={disabled}></Icon>)}
      {title && (<div className={styles['button-title']}>{title}</div>)}
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
