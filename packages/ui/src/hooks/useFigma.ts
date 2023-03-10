import { Controller, CreateSchema } from '@figmania/common'
import { useContext } from 'react'
import { FigmaContext } from '../context/FigmaContext'

export function useFigma() {
  return useContext(FigmaContext)
}

export function useController<S extends CreateSchema>(): Controller<S> {
  return useFigma().controller
}

export function useConfig<C>(): [C, (value: Partial<C>) => void] {
  const { config, saveConfig } = useFigma()
  return [config, saveConfig]
}
