import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes, PropsWithChildren } from 'react'
import { ICON, Icon } from '../../Icon/Icon'
import styles from './Navbar.module.scss'

export interface NavbarProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  label: string
  icon?: ICON
  disabled?: boolean
}

export const Navbar: FunctionComponent<NavbarProps> = ({ label, icon, disabled, children, className, ...props }) => {
  return (
    <div className={clsx(
      styles['navbar'],
      icon && styles['with-icon'],
      disabled && styles['disabled'],
      className
    )} {...props}>
      {icon && (<Icon icon={icon} disabled={disabled}></Icon>)}
      <div className={styles['label']}><span>{label}</span></div>
      {children}
    </div>
  )
}
