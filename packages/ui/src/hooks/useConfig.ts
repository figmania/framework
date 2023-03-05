import { ConfigSchema } from '@figmania/common'
import { useEffect, useState } from 'react'
import { useController } from './useController'

const lastConfig = {}

export function useConfig<C>(): [C, (config: Partial<C>) => void] {
  const [config, setConfig] = useState<C>(lastConfig as C)
  const controller = useController<ConfigSchema<C>>()
  const saveConfig = (value: Partial<C>) => {
    controller.emit('config:save', value)
    Object.assign(lastConfig, value)
    setConfig({ ...config, ...value })
  }
  useEffect(() => {
    controller.addEventHandler('config:changed', (value) => {
      Object.assign(lastConfig, value)
      setConfig(value)
    })
  }, [])
  return [config, saveConfig]
}
