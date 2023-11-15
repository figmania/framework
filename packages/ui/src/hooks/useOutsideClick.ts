import { RefObject, useRef } from 'react'
import { useEventListener } from './useEventListener'

export function useOutsideClick<T extends HTMLElement = HTMLElement>(condition: boolean, handler: (event: MouseEvent) => void): RefObject<T> {
  const ref = useRef<T>(null)

  useEventListener('mousedown', (event) => {
    if (!condition) { return }
    if (!ref?.current || ref.current.contains(event.target as Node)) { return }
    handler(event)
  }, [condition])

  return ref
}
