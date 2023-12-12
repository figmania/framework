import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes } from 'react'
import styles from './Slot.module.scss'

export enum SlotUiState { DEFAULT = 'default', ACTIVE = 'active', INACTIVE = 'inactive', SELECTED = 'selected' }

export interface SlotProps extends HTMLAttributes<HTMLDivElement> {
  uiState: SlotUiState
  transitionState?: [boolean, boolean]
  selectedSide?: string
  isDual: boolean
  isLocked?: boolean
  lockedSide?: string
}

export const Slot: FunctionComponent<SlotProps> = ({ uiState, transitionState, isDual, isLocked, selectedSide, lockedSide, className, ...props }) => {
  const isTransition = transitionState != null
  const isStart = transitionState?.[0] ?? false
  const isEnd = transitionState?.[1] ?? false
  return (
    <div className={clsx(
      styles['slot'],
      styles[uiState],
      isTransition && styles['transition'],
      isStart && styles['start'],
      isEnd && styles['end'],
      isDual && styles['dual'],
      isLocked && styles['locked'],
      selectedSide && styles[selectedSide],
      lockedSide && styles[lockedSide],
      className
    )} {...props}>
      <div className={styles['key']}></div>
      {isLocked && <div className={styles['lock']} />}
    </div>
  )
}
