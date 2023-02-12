import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes, PropsWithChildren, useEffect } from 'react'
import styles from './Theme.module.scss'

export type ThemeType = 'dark' | 'light'

export interface ThemeProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  theme: ThemeType
}

export const Theme: FunctionComponent<ThemeProps> = ({ theme, children, className, ...props }) => {
  useEffect(() => {
    document.body.classList.remove('figmania-dark', 'figmania-light')
    document.body.classList.add(`figmania-${theme}`)
  }, [theme])

  return (
    <div className={clsx(styles['theme'], styles[`theme-${theme}`], className)} {...props}>
      {children}
    </div>
  )
}
