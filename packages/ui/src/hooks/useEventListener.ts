import { DependencyList, useEffect } from 'react'

export function useEventListener<K extends keyof DocumentEventMap>(eventName: K, handler: (event: DocumentEventMap[K]) => void, deps: DependencyList) {
  useEffect(() => {
    document.addEventListener(eventName, handler)
    return () => { document.removeEventListener(eventName, handler) }
  }, [eventName, ...deps])
}
