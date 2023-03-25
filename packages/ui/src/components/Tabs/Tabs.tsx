import clsx from 'clsx'
import { FunctionComponent } from 'react'
import { ICON, Icon } from '../Icon/Icon'
import styles from './Tabs.module.scss'

export interface TabItem {
  title: string
  icon?: ICON
}

export interface TabsProps {
  items: TabItem[]
  selectedIndex: number
  onChange: (tab: TabItem, index: number) => void
}

export const Tabs: FunctionComponent<TabsProps> = ({ items, selectedIndex, onChange }) => {
  return (
    <div className={styles['tabs']}>
      {items.map((item, index) => (
        <div key={index} className={clsx(
          styles['tab'],
          item.icon && styles['with-icon'],
          index === selectedIndex && styles['active']
        )} onClick={() => { onChange(item, index) }}>
          {item.icon && <Icon icon={item.icon} className={styles['icon']} />}
          <div className={styles['title']} >{item.title}</div>
        </div>
      ))}
    </div>
  )
}
