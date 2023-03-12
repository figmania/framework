import { ConfigSchema } from '@figmania/common'
import { useEffect, useState } from 'react'
import { useController } from './useController'

const lastConfig = {}

export function useConfig<C>(): [C, (config: Partial<C>) => void] {
  const [config, setConfig] = useState<C>(lastConfig as C)
  const controller = useController<ConfigSchema<C>>()

  const onConfigChanged = (value: C) => {
    Object.assign(lastConfig, value)
    setConfig({ ...lastConfig as C })
  }

  const saveConfig = (value: Partial<C>) => {
    controller.emit('config:save', value)
    Object.assign(lastConfig, value)
    setConfig({ ...config, ...value })
  }

  useEffect(() => {
    controller.addEventHandler('config:changed', onConfigChanged)
    return () => { controller.removeEventHandler('config:changed', onConfigChanged) }
  }, [controller])

  return [config, saveConfig]
}
