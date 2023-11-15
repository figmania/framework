// import { prettyPrint } from '@figmania/common'
import clsx from 'clsx'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import { FunctionComponent, useEffect, useState } from 'react'
import styles from './Code.module.scss'
import './Code.theme.scss'

hljs.registerLanguage('xml', xml)

export interface CodeProps {
  value: string
  indent?: boolean
  className?: string
}

const LOADING_HTML = '<span class="hljs-tag"><span class="hljs-name">Loading ...</span></span>'

export const Code: FunctionComponent<CodeProps> = ({ value, indent, className }) => {
  const [code, setCode] = useState<string>()

  useEffect(() => {
    // const result = hljs.highlight(indent ? prettyPrint(value) : value, { language: 'xml' })
    const result = hljs.highlight(value, { language: 'xml' })
    setCode(result.value)
  }, [value])

  return (
    <code className={clsx(styles['code'], 'code', className)} dangerouslySetInnerHTML={{ __html: code ?? LOADING_HTML }} />
  )
}
