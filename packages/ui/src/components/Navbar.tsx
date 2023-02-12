import clsx from 'clsx'
import { FunctionComponent, ReactNode } from 'react'
import { Icon, Icons } from './Icon'
import styles from './Navbar.module.scss'

export interface NavbarProps {
  title: string
  icon?: Icons
  isDisabled?: boolean
  children?: ReactNode
}

export const Navbar: FunctionComponent<NavbarProps> = ({ title, icon, isDisabled, children }) => {
  return (
    <div className={clsx(styles['navbar'], isDisabled && styles['disabled'])}>
      {icon && (<Icon icon={icon} isDisabled={isDisabled}></Icon>)}
      <div className={styles['navbar-title']}><span>{title}</span></div>
      {children}
    </div>
  )
}
