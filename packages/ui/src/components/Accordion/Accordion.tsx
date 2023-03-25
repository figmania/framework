import clsx from 'clsx'
import { FunctionComponent, ReactNode, useState } from 'react'
import { Button } from '../Button/Button'
import { ICON, Icon } from '../Icon/Icon'
import styles from './Accordion.module.scss'

export interface AccordionProps {
  title: string
  active: boolean
  disabled?: boolean
  children?: ReactNode
  activate: () => void
  renderHeader?: () => ReactNode
  renderSettings?: () => ReactNode
}

export const Accordion: FunctionComponent<AccordionProps> = ({ title, active, children, disabled, renderHeader, renderSettings, activate }) => {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className={clsx(styles['accordion'], active ? styles['active'] : styles['inactive'], disabled ? styles['disabled'] : styles['enabled'])}>
      <div className={styles['header']} onClick={() => { if (!active && activate) { activate() } }}>
        <Icon className={styles['icon']} icon={ICON.UI_FORWARD}></Icon>
        <div className={styles['title']}><span>{title}</span></div>
        {renderHeader?.()}
        {renderSettings && (
          <Button icon={ICON.APP_SETTINGS} onClick={() => { if (active) { setShowSettings(!showSettings) } }} selected={active && showSettings}></Button>
        )}
      </div>
      {(renderSettings && showSettings && active) && (
        <div className={styles['settings']}>{renderSettings()}</div>
      )}
      {(active) && (<div className={styles['body']}>{children}</div>)}
    </div>
  )
}
