import { CreateSchema } from '@figmania/common'
import { useEffect, useState } from 'react'
import { useController } from './useController'

export function useNode<S extends CreateSchema>(): S['events']['node:select'] {
  const [node, setNode] = useState<S['events']['node:select']>()
  const controller = useController()
  useEffect(() => controller.addEventHandler('node:select', setNode), [])
  return node!
}
