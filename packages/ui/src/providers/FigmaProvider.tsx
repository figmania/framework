/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, FigmaLogger, FigmaLoggerOptions, LogLevel } from '@figmania/common'
import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react'
import { FigmaContext } from '../context/FigmaContext'

export interface FigmaProviderProps extends PropsWithChildren {
  controller: Controller<any>
  defaultConfig?: Record<string, any>
  logOptions?: FigmaLoggerOptions
}

export const FigmaProvider: FunctionComponent<FigmaProviderProps> = ({ controller, defaultConfig, logOptions, children }) => {
  const [config, setConfig] = useState<Record<string, any>>()

  const logger = new FigmaLogger({ name: 'UI', minLevel: LogLevel.SILLY, date: false, ...logOptions })

  const saveConfig = (value: {}) => {
    controller.emit('config:save', { ...config, ...value })
    setConfig({ ...defaultConfig, ...config, ...value })
  }

  const onConfigChanged = (value: {}) => {
    setConfig(value)
  }

  useEffect(() => {
    controller.addEventHandler('config:changed', onConfigChanged)
    saveConfig({})
    return () => { controller.removeEventHandler('config:changed', onConfigChanged) }
  }, [controller])

  return <FigmaContext.Provider value={{ controller, config, defaultConfig, saveConfig, logger }}>{children}</FigmaContext.Provider>
}
