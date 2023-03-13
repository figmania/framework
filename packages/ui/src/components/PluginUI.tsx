import { ResizeSchema } from '@figmania/common'
import clsx from 'clsx'
import { createRef, FunctionComponent, HTMLAttributes, PointerEvent, PropsWithChildren, useEffect, useState } from 'react'
import { useController } from '../hooks/useFigma'
import styles from './PluginUI.module.scss'

export type ThemeType = 'dark' | 'light'
export type ThemeSize = 'sm' | 'md'

export interface WindowSize {
  width: number
  height: number
}

export interface PluginUIProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  theme: ThemeType
  minSize?: WindowSize
  maxSize?: WindowSize
}

export const PluginUI: FunctionComponent<PluginUIProps> = ({ theme, children, className, minSize, maxSize, ...props }) => {
  const controller = useController<ResizeSchema>()
  const [resizing, setResizing] = useState(false)
  const handleRef = createRef<HTMLDivElement>()

  useEffect(() => {
    document.body.classList.remove('figmania-dark', 'figmania-light')
    document.body.classList.add(`figmania-${theme}`)
  }, [theme])

  return (
    <div className={clsx(styles['plugin-ui'], styles[`theme-${theme}`], className)} {...props}>
      {children}
      <div ref={handleRef} className={styles['handle']}
        onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
          if (!handleRef.current) { return }
          setResizing(true)
          handleRef.current.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event: PointerEvent) => {
          if (!resizing) { return }
          let width = event.clientX + 16
          let height = event.clientY + 16
          if (minSize) { width = Math.max(minSize.width, width); height = Math.max(minSize.height, height) }
          if (maxSize) { width = Math.min(maxSize.width, width); height = Math.min(maxSize.height, height) }
          controller.emit('window:resize', { width: Math.floor(width), height: Math.floor(height) })
        }}
        onPointerUp={(event: PointerEvent) => {
          if (!handleRef.current) { return }
          setResizing(false)
          handleRef.current.releasePointerCapture(event.pointerId)
        }}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <g>
            <path d="M0 16L16 0V16H0Z" fill="#2B2B2B"></path>
            <path d="M10 16L16 9.99999V12L12 16H10Z" fill="#2F343F"></path>
            <path d="M6 16L16 6V8L8 16H6Z" fill="#2F343F"></path>
            <path d="M2 16L16 2V4L4 16H2Z" fill="#2F343F"></path>
          </g>
        </svg>
      </div>
    </div>
  )
}
