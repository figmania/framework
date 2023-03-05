import { createContext } from 'react'

export const ClipboardContext = createContext<(value: string) => void>(null!)
