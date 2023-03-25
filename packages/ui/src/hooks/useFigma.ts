import { Controller, CreateSchema, FigmaLogger } from '@figmania/common'
import { useContext } from 'react'
import { FigmaContext } from '../context/FigmaContext'

export function useFigma() {
  return useContext(FigmaContext)
}

export function useController<S extends CreateSchema>(): Controller<S> {
  return useFigma().controller
}

export function useConfig<C>(): [C, (value: Partial<C>) => void] {
  const { config, defaultConfig, saveConfig } = useFigma()
  return [config ?? defaultConfig, saveConfig]
}

export function useLogger(): FigmaLogger {
  return useFigma().logger
}
