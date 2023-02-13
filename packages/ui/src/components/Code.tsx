import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'
import styles from './Code.module.scss'
import { WorkerMessage } from './Code.types'

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  source: string
  lang: 'xml' | 'css' | 'html'
}

type OnWorkerMessage = (event: MessageEvent<WorkerMessage>) => void

export const Code: FunctionComponent<CodeProps> = ({ source, lang, className, ...props }) => {
  const worker = useMemo(() => new Worker(new URL('./Code.worker.ts', import.meta.url), { type: 'module' }), [])
  const jobId = useRef(0)
  const [code, setCode] = useState<string>()

  const onMessage: OnWorkerMessage = ({ data }) => {
    if (data.id !== jobId.current) { return }
    setCode(data.code)
  }

  useEffect(() => {
    worker.addEventListener('message', onMessage)
    return () => {
      worker.removeEventListener('message', onMessage)
      worker.terminate()
    }
  }, [])

  useEffect(() => {
    setCode('<span style="color: #81A1C1">Loading ...</span>')
    jobId.current++
    worker.postMessage({ id: jobId.current, lang, code: source } as WorkerMessage)
  }, [source, lang])

  if (!code) { return <></> }

  return (
    <pre dangerouslySetInnerHTML={{ __html: code }} className={clsx(styles['code'], className)} {...props}></pre>
  )
}
