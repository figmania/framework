import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes } from 'react'
import styles from './Icon.module.css'

export enum ICON {
  ANIMATE_OPACITY = 'animate-opacity',
  ANIMATE_ROTATION = 'animate-rotation',
  ANIMATE_X = 'animate-x',
  ANIMATE_Y = 'animate-y',
  ANIMATE_SCALE = 'animate-scale',
  EASE_IN_BACK = 'ease-in-back',
  EASE_IN_OUT_BACK = 'ease-in-out-back',
  EASE_IN_OUT = 'ease-in-out',
  EASE_IN = 'ease-in',
  EASE_LINEAR = 'ease-linear',
  EASE_OUT_BACK = 'ease-out-back',
  EASE_OUT = 'ease-out',
  UI_FORWARD = 'ui-forward',
  UI_CLIPBOARD = 'ui-clipboard',
  UI_DOWNLOAD = 'ui-download',
  UI_WARNING = 'ui-warning',
  UI_PLUS = 'ui-plus',
  UI_MINUS = 'ui-minus',
  UI_RESIZE = 'ui-resize',
  UI_ADJUST = 'ui-adjust',
  UI_ELLIPSIS = 'ui-ellipsis',
  UI_CLOSE = 'ui-close',
  TRANSITION_FROM = 'transition-from',
  TRANSITION_TO = 'transition-to',
  TRANSITION_DELAY = 'transition-delay',
  TRANSITION_DURATION = 'transition-duration',
  TRANSITION_TRIGGER = 'transition-trigger',
  CONTROL_PLAY = 'control-play',
  CONTROL_CHECK_FILLED = 'control-check-filled',
  CONTROL_CHECK = 'control-check',
  CONTROL_OFF = 'control-off',
  CONTROL_ON = 'control-on',
  CONTROL_UNLOCK = 'control-unlock',
  CONTROL_LOCK = 'control-lock',
  CONTROL_SHOW = 'control-show',
  CONTROL_SHOW_HALF = 'control-show-half',
  CONTROL_HIDE = 'control-hide',
  LINK_WEB = 'link-web',
  LINK_SET = 'link-set',
  LINK_UNSET = 'link-unset',
  LINK_CLEAR = 'link-clear',
  STYLE_BLEND = 'style-blend',
  STYLE_BLEND_EMPTY = 'style-blend-empty',
  STYLE_HORIZONTAL = 'style-horizontal',
  STYLE_VERTICAL = 'style-vertical',
  STYLE_ANGLE = 'style-angle',
  STYLE_CORNER = 'style-corner',
  STYLE_CORNERS = 'style-corners',
  STYLE_VECTOR = 'style-vector',
  STYLE_WEIGHT = 'style-weight',
  SYMBOL_FRAME = 'symbol-frame',
  SYMBOL_COMPONENT = 'symbol-component',
  SYMBOL_RESET = 'symbol-reset',
  SYMBOL_CONNECT = 'symbol-connect',
  SYMBOL_DISCONNECT = 'symbol-disconnect',
  ALIGN_VERTICAL_TOP = 'align-vertical-top',
  ALIGN_VERTICAL_CENTER = 'align-vertical-center',
  ALIGN_VERTICAL_BOTTOM = 'align-vertical-bottom',
  ALIGN_VERTICAL_DISTRIBUTE = 'align-vertical-distribute',
  ALIGN_HORIZONTAL_LEFT = 'align-horizontal-left',
  ALIGN_HORIZONTAL_CENTER = 'align-horizontal-center',
  ALIGN_HORIZONTAL_RIGHT = 'align-horizontal-right',
  ALIGN_HORIZONTAL_DISTRIBUTE = 'align-horizontal-distribute',
  APP_DRAFT = 'app-draft',
  APP_TRASH = 'app-trash',
  APP_LIBRARY = 'app-library',
  APP_STYLES = 'app-styles',
  APP_SHARE = 'app-share',
  APP_MISSING_FONTS = 'app-missing-fonts',
  APP_SEARCH = 'app-search',
  APP_RECENT = 'app-recent',
  APP_RETURN = 'app-return',
  APP_DROPPER = 'app-dropper',
  APP_SMILEY = 'app-smiley',
  APP_EFFECTS = 'app-effects',
  APP_SETTINGS = 'app-settings',
  FONT_LINE_HEIGHT = 'font-line-height',
  FONT_LETTER_SPACING = 'font-letter-spacing',
  FONT_PARAGRAPH_SPACING = 'font-paragraph-spacing',
  FONT_PARAGRAPH_INDENT = 'font-paragraph-indent',
  FONT_FEATURE_TNUM = 'font-feature-tnum',
  FONT_FEATURE_SMCP = 'font-feature-smcp',
  FONT_FEATURE_LIGA = 'font-feature-liga',
  FONT_FEATURE_ONUM = 'font-feature-onum',
  FONT_FEATURE_HLIG = 'font-feature-hlig',
  FONT_FEATURE_SUPS = 'font-feature-sups',
  FONT_FEATURE_DLIG = 'font-feature-dlig',
  FONT_FEATURE_SUBS = 'font-feature-subs',
  FONT_FEATURE_FRAC = 'font-feature-frac',
  LAYOUT_ROWS = 'layout-rows',
  LAYOUT_ROWS_LIGHT = 'layout-rows-light',
  LAYOUT_COLUMNS = 'layout-columns',
  LAYOUR_COLUMNS_LIGHT = 'layour-columns-light',
  LAYOUT_GRID = 'layout-grid',
  LAYOUT_GRID_LIGHT = 'layout-grid-light',
  LAYOUT_LIST = 'layout-list',
  LAYOUT_BULLETS = 'layout-bullets'
}

export interface IconProps extends HTMLAttributes<HTMLDivElement> {
  icon: ICON
  color?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
}

export const Icon: FunctionComponent<IconProps> = ({ icon, color, size, disabled, style, className, ...props }) => {
  return (
    <div style={{ ...style, backgroundColor: color }} className={clsx(
      'icon',
      styles['icon'],
      styles[icon],
      styles[size ?? 'md'],
      disabled && styles['disabled'],
      className
    )} {...props} />
  )
}
