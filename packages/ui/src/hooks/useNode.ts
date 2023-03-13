import { CreateSchema } from '@figmania/common'
import { useEffect, useState } from 'react'
import { useController } from './useFigma'

export function useNode<S extends CreateSchema>(initialNode?: S['events']['node:select']): S['events']['node:select'] {
  const [node, setNode] = useState<S['events']['node:select']>(initialNode!)
  const controller = useController()
  useEffect(() => {
    controller.addEventHandler('node:select', setNode)
    return () => { controller.removeEventHandler('node:select', setNode) }
  }, [])
  return node
}
