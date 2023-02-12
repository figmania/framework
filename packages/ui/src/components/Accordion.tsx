import clsx from 'clsx'
import { FunctionComponent, ReactNode, useState } from 'react'
import styles from './Accordion.module.scss'
import { Button } from './Button'
import { Icon } from './Icon'

export interface AccordionProps {
  title: string
  active: boolean
  isDisabled?: boolean
  children?: ReactNode
  activate: () => void
  renderHeader?: () => ReactNode
  renderSettings?: () => ReactNode
}

export interface AccordionState {
  showSettings: boolean
}

export const Accordion: FunctionComponent<AccordionProps> = ({ title, active, children, isDisabled, renderHeader, renderSettings, activate }) => {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className={clsx(styles['accordion'], active ? styles['active'] : styles['inactive'], isDisabled ? styles['disabled'] : styles['enabled'])}>
      <div className={styles['header']} onClick={() => { if (!active && activate) { activate() } }}>
        <Icon className={styles['icon']} icon='ui-forward' mute></Icon>
        <div className={styles['title']}><span>{title}</span></div>
        {renderHeader?.()}
        {renderSettings && (
          <Button icon='ui-settings' onClick={() => { if (active) { setShowSettings(!showSettings) } }} isSelected={active && showSettings}></Button>
        )}
      </div>
      {(renderSettings && showSettings && active) && (
        <div className={styles['settings']}>{renderSettings()}</div>
      )}
      {(active) && (<div className={styles['body']}>{children}</div>)}
    </div>
  )
}
