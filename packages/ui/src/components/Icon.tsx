import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes } from 'react'
import styles from './Icon.module.scss'
import { ThemeSize } from './PluginUI'

export type Icons = (
  'animation-opacity' | 'animation-rotate' | 'animation-scale' | 'animation-translate-x' | 'animation-translate-y' |
  'ease-in-back' | 'ease-in-out-back' | 'ease-in-out' | 'ease-in' | 'ease-linear' | 'ease-out-back' | 'ease-out' |
  'transition-delay' | 'transition-duration' | 'transition-from' | 'transition-to' | 'transition-trigger' |
  'ui-animate-off' | 'ui-animate-on' | 'ui-clipboard' | 'ui-download' | 'ui-forward' | 'ui-instance' | 'ui-settings' | 'ui-warning' | 'ui-plus' | 'ui-minus' | 'ui-info' | 'ui-visible' | 'ui-hidden' |
  'control-loop' | 'control-pause' | 'control-play' | 'control-reset'
)

export interface IconProps extends HTMLAttributes<HTMLDivElement> {
  icon: Icons
  color?: string
  size?: ThemeSize
  isDisabled?: boolean
  mute?: boolean
}

export const Icon: FunctionComponent<IconProps> = ({ icon, color, size, isDisabled, mute, className, style, ...props }) => {
  return (
    <div
      className={clsx(
        styles['icon'],
        styles[`icon-${icon}`],
        styles[size ?? 'md'],
        isDisabled && styles['disabled'],
        mute && styles['mute'],
        className
      )}
      style={{ ...style, backgroundColor: color }}
      {...props}>
    </div>
  )
}
