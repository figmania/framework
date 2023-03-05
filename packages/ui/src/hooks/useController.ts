import { Controller, CreateSchema } from '@figmania/common'
import { useContext } from 'react'
import { ControllerContext } from '../context/ControllerContext'

export function useController<S extends CreateSchema>(): Controller<S> {
  return useContext(ControllerContext)
}