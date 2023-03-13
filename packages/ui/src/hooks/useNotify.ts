import { NotifySchema } from '@figmania/common'
import { useController } from './useFigma'

export function useNotify(): (message: string) => void {
  const controller = useController<NotifySchema>()
  return (message: string) => { controller.emit('notify', message) }
}
