import { prettyPrint } from '@figmania/common'
import clsx from 'clsx'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import { FunctionComponent, useEffect, useState } from 'react'
import styles from './Code.module.scss'
import './Code.theme.scss'

hljs.registerLanguage('xml', xml)

export interface CodeProps {
  source: string
  indent?: boolean
  className?: string
}

const LOADING_HTML = '<span class="hljs-tag"><span class="hljs-name">Loading ...</span></span>'

export const Code: FunctionComponent<CodeProps> = ({ source, indent, className }) => {
  const [code, setCode] = useState<string>()

  useEffect(() => {
    const { value } = hljs.highlight(indent ? prettyPrint(source) : source, { language: 'xml' })
    setCode(value)
  }, [source])

  return (
    <code className={clsx(styles['code'], 'code', className)} dangerouslySetInnerHTML={{ __html: code ?? LOADING_HTML }} />
  )
}
