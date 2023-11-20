import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes } from 'react'
import { ICON, Icon } from '../../Icon/Icon'
import styles from './Tabs.module.scss'

export interface TabProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  icon?: ICON
}

export const Tab: FunctionComponent<TabProps> = ({ label, icon, className, ...props }) => {
  return (
    <div className={clsx(styles['tab-inner'], className)} {...props}>
      {icon && <Icon icon={icon} className={styles['icon']} />}
      <div className={styles['label']} >{label}</div>
    </div>
  )
}
