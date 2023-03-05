import { Controller } from '@figmania/common'
import { createContext } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ControllerContext = createContext<Controller<any>>(null!)
