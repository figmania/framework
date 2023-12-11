import clsx from 'clsx'
import { FunctionComponent } from 'react'
import { ICON, Icon } from '../../Icon/Icon'
import styles from './NavigationBar.module.scss'

export interface NavigationItem {
  label: string
  icon?: ICON
  disabled?: boolean
}

export interface NavigationBarProps {
  items: NavigationItem[]
  selectedIndex: number
  onChange: (item: NavigationItem, index: number) => void
}

export const NavigationBar: FunctionComponent<NavigationBarProps> = ({ items, selectedIndex, onChange }) => {
  return (
    <div className={styles['items']}>
      {items.map((item, index) => (
        <div key={index} className={clsx(
          styles['item'],
          item.disabled && styles['disabled'],
          index === selectedIndex && styles['active']
        )} onClick={() => { onChange(item, index) }}>
          {item.icon && <Icon icon={item.icon} className={styles['icon']} />}
          <div className={styles['label']} >{item.label}</div>
        </div>
      ))}
    </div>
  )
}
