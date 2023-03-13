/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from '@figmania/common'
import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react'
import { FigmaContext } from '../context/FigmaContext'

export interface FigmaProviderProps extends PropsWithChildren {
  controller: Controller<any>
}

export const FigmaProvider: FunctionComponent<FigmaProviderProps> = ({ controller, children }) => {
  const [config, setConfig] = useState<Record<string, any>>({})

  const saveConfig = (value: {}) => {
    controller.emit('config:save', { ...config, ...value })
    setConfig({ ...config, ...value })
  }

  const onConfigChanged = (value: {}) => {
    setConfig(value)
  }

  useEffect(() => {
    controller.addEventHandler('config:changed', onConfigChanged)
    saveConfig({})
    return () => { controller.removeEventHandler('config:changed', onConfigChanged) }
  }, [controller])

  return <FigmaContext.Provider value={{ controller, config, saveConfig }}>{children}</FigmaContext.Provider>
}
