import clsx from 'clsx'
import hljs from 'highlight.js'
import { FunctionComponent, useEffect, useState } from 'react'
import styles from './Code.module.scss'
import './Code.theme.scss'

export interface CodeProps {
  source: string
  language: string
  className?: string
}

const LOADING_HTML = '<span class="hljs-tag"><span class="hljs-name">Loading ...</span></span>'

export const Code: FunctionComponent<CodeProps> = ({ source, language, className }) => {
  const [code, setCode] = useState<string>()

  useEffect(() => {
    const result = hljs.highlight(source, { language: 'html' })
    setCode(result.value)
  }, [source, language])

  return (
    <code className={clsx(styles['code'], 'code', className)} dangerouslySetInnerHTML={{ __html: code ?? LOADING_HTML }} />
  )
}
