import { DependencyList, Ref, useCallback, useEffect, useState } from 'react'
import { getSelectorIndex } from '../util/dom'

export interface DragEvent {
  from: number
  to: number
}

export type DragStartFn = (event: DragEvent) => boolean

export type DragFn = (event: DragEvent) => void

export function useDragSlots(selector: string, startFn: DragStartFn, moveFn: DragFn, endFn: DragFn, deps: DependencyList = []): [Ref<HTMLDivElement>, DragEvent | undefined] {
  const [event, setEvent] = useState<DragEvent>()
  const [root, setRoot] = useState<HTMLDivElement>()

  const ref = useCallback((node: HTMLDivElement) => { setRoot(node) }, [])

  useEffect(() => {
    if (!root) { return () => { } }

    const onMouseDown = ({ target }: MouseEvent) => {
      const index = getSelectorIndex(root, selector, target)
      if (index == null) { return }
      const dragEvent: DragEvent = { from: index, to: index }
      const result = startFn(dragEvent)
      if (!result) { return }
      setEvent(dragEvent)
    }

    const onMouseMove = ({ target }: MouseEvent) => {
      if (!event) { return }
      const index = getSelectorIndex(root, selector, target)
      if (index == null || index === event.to) { return }
      const dragEvent = { from: event.from, to: index }
      setEvent(dragEvent)
      moveFn(dragEvent)
    }

    const onMouseUp = () => {
      if (!event) { return }
      setEvent(undefined)
      endFn(event)
    }

    root.addEventListener('mousedown', onMouseDown)
    root.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      root?.removeEventListener('mousedown', onMouseDown)
      root?.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [root, startFn, moveFn, endFn, ...deps])

  return [ref, event]
}
