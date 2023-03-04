import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes, PropsWithChildren } from 'react'
import { Icon, Icons } from './Icon'
import styles from './Navbar.module.scss'

export interface NavbarProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  title: string
  icon?: Icons
  isDisabled?: boolean
}

export const Navbar: FunctionComponent<NavbarProps> = ({ title, icon, isDisabled, children, className, ...props }) => {
  return (
    <div className={clsx(styles['navbar'], isDisabled && styles['disabled'], className)} {...props}>
      {icon && (<Icon icon={icon} isDisabled={isDisabled}></Icon>)}
      <div className={styles['navbar-title']}><span>{title}</span></div>
      {children}
    </div>
  )
}
