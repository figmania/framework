import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes, PropsWithChildren } from 'react'
import styles from './PluginWindow.module.scss'

export interface PluginWindowProps extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  title: string
  theme?: string
  padding?: boolean
}

export const PluginWindow: FunctionComponent<PluginWindowProps> = ({ children, title, theme = 'light', padding = true, className, ...props }) => {
  return (
    <div className={clsx(styles['window'], styles[`theme-${theme}`], 'plugin-ui-window', `figmania-${theme}`, className)} {...props}>
      <div className={styles['header']}>
        <div className={styles['icon']}>
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M10 8c-1.105 0-2 .895-2 2v12c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2V10c0-1.105-.895-2-2-2H10zm4.515 11.879l2-8 .97.242-2 8-.97-.242zm-1.869-6.232l-2 2-.353.353.354.354 2 2 .707-.707L11.707 16l1.647-1.646-.707-.707zm6.708 0l2 2 .353.353-.353.354-2 2-.707-.707L20.293 16l-1.646-1.646.707-.707z" fillRule="evenodd" fillOpacity="1" fill="inherit" stroke="none"></path></svg>
        </div>
        <div className={styles['title']}>{title}</div>
        <button role="button" type="button" aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M6 5.293l4.789-4.79.707.708-4.79 4.79 4.79 4.789-.707.707-4.79-4.79-4.789 4.79-.707-.707L5.293 6 .502 1.211 1.21.504 6 5.294z" fillRule="nonzero" fillOpacity="1" fill="inherit" stroke="none"></path></svg>
        </button>
      </div>
      <div className={clsx(styles['body'], padding && styles['padding'])}>
        {children}
      </div>
    </div>
  )
}