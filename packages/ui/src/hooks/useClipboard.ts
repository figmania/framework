import { useContext } from 'react'
import { ClipboardContext } from '../context/ClipboardContext'

export function useClipboard() {
  return useContext(ClipboardContext)
}
