import { ConfigSchema } from '@figmania/common'
import { useEffect, useState } from 'react'
import { useController } from './useController'

export function useConfig<C>(): [C, (config: Partial<C>) => void] {
  const [config, setConfig] = useState<C>({} as C)
  const controller = useController<ConfigSchema<C>>()
  const saveConfig = (value: Partial<C>) => {
    controller.emit('config:save', value)
    setConfig({ ...config, ...value })
  }
  useEffect(() => controller.addEventHandler('config:changed', setConfig), [])
  return [config, saveConfig]
}