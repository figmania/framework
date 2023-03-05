import { createRef, FunctionComponent, PropsWithChildren } from 'react'
import { ClipboardContext } from '../context/ClipboardContext'

export const ClipboardProvider: FunctionComponent<PropsWithChildren> = (props) => {
  const textareaRef = createRef<HTMLTextAreaElement>()

  const clipboard = (value: string) => {
    if (!textareaRef.current) { return }
    textareaRef.current.value = value
    textareaRef.current.select()
    document.execCommand('copy')
  }

  return (
    <ClipboardContext.Provider value={clipboard}>
      {props.children}
      <textarea ref={textareaRef} wrap="soft" readOnly={true} style={{ opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} />
    </ClipboardContext.Provider>
  )
}
