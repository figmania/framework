import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes, useEffect, useState } from 'react'
import { getHighlighter, Highlighter, renderToHtml } from 'shiki-es'
import styles from './Code.module.scss'

const highlighter$ = getHighlighter({ theme: 'nord', langs: ['xml', 'css', 'html'] })

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  source: string
  lang: 'xml' | 'css' | 'html'
}

export const Code: FunctionComponent<CodeProps> = ({ source, lang, className, ...props }) => {
  const [highlighter, setHighlighter] = useState<Highlighter>()
  const [code, setCode] = useState<string>()

  useEffect(() => {
    highlighter$.then((result) => {
      setHighlighter(result)
    })
  }, [])

  useEffect(() => {
    if (!highlighter) { return }
    const tokens = highlighter.codeToThemedTokens(source, lang)
    const html = renderToHtml(tokens, {
      elements: {
        pre: ({ children }) => children,
        code: ({ children }) => children,
        line: ({ children }) => children
      }
    })
    setCode(html)
  }, [highlighter, source, lang])

  if (!highlighter || !code) { return <></> }

  return (
    <pre dangerouslySetInnerHTML={{ __html: code }} className={clsx(styles['code'], className)} {...props}></pre>
  )
}
