import clsx from 'clsx'
import { ButtonHTMLAttributes, FunctionComponent, MouseEvent, ReactNode } from 'react'
import styles from './Button.module.scss'
import { Icon, Icons } from './Icon'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: Icons
  color?: string
  isSelected?: boolean
  isDisabled?: boolean
  title?: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

export const Button: FunctionComponent<ButtonProps> = ({ className, icon, color, title, isSelected, isDisabled, onClick, ...props }) => {
  return (
    <button disabled={isDisabled} onClick={onClick} className={clsx(styles['button'], isSelected && styles['selected'], icon ? styles['with-icon'] : styles['without-icon'], className)} {...props}>
      {icon && (<Icon icon={icon} color={color} isDisabled={isDisabled} mute></Icon>)}
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
