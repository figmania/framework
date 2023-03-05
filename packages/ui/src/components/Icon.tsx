import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes } from 'react'
import styles from './Icon.module.scss'
import { ThemeSize } from './PluginUI'

export enum ICON {
  ANIMATION_OPACITY = 'animation-opacity',
  ANIMATION_ROTATE = 'animation-rotate',
  ANIMATION_SCALE = 'animation-scale',
  ANIMATION_TRANSLATE_X = 'animation-translate-x',
  ANIMATION_TRANSLATE_Y = 'animation-translate-y',
  EASE_IN_BACK = 'ease-in-back',
  EASE_IN_OUT_BACK = 'ease-in-out-back',
  EASE_IN_OUT = 'ease-in-out',
  EASE_IN = 'ease-in',
  EASE_LINEAR = 'ease-linear',
  EASE_OUT_BACK = 'ease-out-back',
  EASE_OUT = 'ease-out',
  TRANSITION_DELAY = 'transition-delay',
  TRANSITION_DURATION = 'transition-duration',
  TRANSITION_FROM = 'transition-from',
  TRANSITION_TO = 'transition-to',
  TRANSITION_TRIGGER = 'transition-trigger',
  UI_ANIMATE_OFF = 'ui-animate-off',
  UI_ANIMATE_ON = 'ui-animate-on',
  UI_CLIPBOARD = 'ui-clipboard',
  UI_DOWNLOAD = 'ui-download',
  UI_FORWARD = 'ui-forward',
  UI_INSTANCE = 'ui-instance',
  UI_SETTINGS = 'ui-settings',
  UI_WARNING = 'ui-warning',
  UI_PLUS = 'ui-plus',
  UI_MINUS = 'ui-minus',
  UI_INFO = 'ui-info',
  UI_VISIBLE = 'ui-visible',
  UI_HIDDEN = 'ui-hidden',
  CONTROL_LOOP = 'control-loop',
  CONTROL_PAUSE = 'control-pause',
  CONTROL_PLAY = 'control-play',
  CONTROL_RESET = 'control-reset'
}

export interface IconProps extends HTMLAttributes<HTMLDivElement> {
  icon: ICON
  color?: string
  size?: ThemeSize
  disabled?: boolean
  mute?: boolean
}

export const Icon: FunctionComponent<IconProps> = ({ icon, color, size, disabled, mute, className, style, ...props }) => {
  return (
    <div
      className={clsx(
        styles['icon'],
        styles[`icon-${icon}`],
        styles[size ?? 'md'],
        disabled && styles['disabled'],
        mute && styles['mute'],
        className
      )}
      style={{ ...style, backgroundColor: color }}
      {...props}>
    </div>
  )
}
