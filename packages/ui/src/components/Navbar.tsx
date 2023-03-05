import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes, PropsWithChildren } from 'react'
import { Icon, ICON } from './Icon'
import styles from './Navbar.module.scss'

export interface NavbarProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  title: string
  icon?: ICON
  disabled?: boolean
}

export const Navbar: FunctionComponent<NavbarProps> = ({ title, icon, disabled, children, className, ...props }) => {
  return (
    <div className={clsx(styles['navbar'], disabled && styles['disabled'], className)} {...props}>
      {icon && (<Icon icon={icon} disabled={disabled}></Icon>)}
      <div className={styles['navbar-title']}><span>{title}</span></div>
      {children}
    </div>
  )
}
