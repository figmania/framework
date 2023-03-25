/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigSchema, Controller, FigmaLogger } from '@figmania/common'
import { createContext } from 'react'

export interface FigmaContextProps<C, S extends ConfigSchema<C>> {
  controller: Controller<S>
  config?: C
  defaultConfig?: C
  saveConfig: (value: Partial<C>) => void
  logger: FigmaLogger
}

export const FigmaContext = createContext<FigmaContextProps<any, any>>(null!)
