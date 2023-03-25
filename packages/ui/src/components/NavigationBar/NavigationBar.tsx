import clsx from 'clsx'
import { FunctionComponent } from 'react'
import { ICON, Icon } from '../Icon/Icon'
import styles from './NavigationBar.module.scss'

export interface NavigationItem {
  title: string
  icon?: ICON
}

export interface NavigationBarProps {
  items: NavigationItem[]
  selectedIndex: number
  onChange: (tiem: NavigationItem, index: number) => void
}

export const NavigationBar: FunctionComponent<NavigationBarProps> = ({ items, selectedIndex, onChange }) => {
  return (
    <div className={styles['items']}>
      {items.map((item, index) => (
        <div key={index} className={clsx(styles['item'], index === selectedIndex && styles['selected'])} onClick={() => { onChange(item, index) }}>
          {item.icon && <Icon icon={item.icon} className={styles['icon']} />}
          <div className={styles['title']} >{item.title}</div>
        </div>
      ))}
    </div>
  )
}
