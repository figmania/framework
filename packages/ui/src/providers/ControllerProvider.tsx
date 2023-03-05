/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, createController, createUIDelegate } from '@figmania/common'
import { FunctionComponent, PropsWithChildren } from 'react'
import { ControllerContext } from '../context/ControllerContext'

export interface ControllerProviderProps extends PropsWithChildren {
  controller?: Controller<any>
}

export const ControllerProvider: FunctionComponent<ControllerProviderProps> = (props) => {
  const controller = props.controller ?? createController(createUIDelegate())
  return <ControllerContext.Provider value={controller}>{props.children}</ControllerContext.Provider>
}
