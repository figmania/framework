import clsx from 'clsx'
import { FunctionComponent, PropsWithChildren, ReactNode } from 'react'
import styles from './Tabs.module.scss'

export interface TabsProps extends PropsWithChildren {
  items: ReactNode[]
  selectedIndex: number
  onChange: (index: number) => void
}

export const Tabs: FunctionComponent<TabsProps> = ({ items, selectedIndex, onChange, children }) => {
  return (
    <div className={styles['tabs']}>
      {items.map((item, index) => (
        <div key={index} className={clsx(styles['tab'], index === selectedIndex && styles['active'])} onClick={() => {
          onChange(index)
        }}>{item}</div>
      ))}
      {children && (
        <div className={styles['addon']}>
          {children}
        </div>
      )}
    </div>
  )
}
