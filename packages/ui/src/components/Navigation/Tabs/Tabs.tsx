import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import styles from './Tabs.module.scss'

export interface TabsProps extends PropsWithChildren, Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: ReactNode[]
  selectedIndex: number
  onChange: (index: number) => void
}

export const Tabs: FunctionComponent<TabsProps> = ({ items, selectedIndex, onChange, className, children, ...props }) => {
  return (
    <div className={clsx(styles['tabs'], className)} {...props}>
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
