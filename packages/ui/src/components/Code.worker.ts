/// <reference lib="webworker" />

import { getHighlighter, renderToHtml } from 'shiki-es'
import { WorkerMessage } from './Code.types'

const highlighter$ = getHighlighter({ theme: 'nord', langs: ['xml', 'css', 'html'] })

self.onmessage = async ({ data: { id, lang, code } }: MessageEvent<WorkerMessage>) => {
  const highlighter = await highlighter$
  self.postMessage({
    id,
    lang,
    code: renderToHtml(highlighter.codeToThemedTokens(code, lang), {
      elements: {
        pre: ({ children }) => children,
        code: ({ children }) => children,
        line: ({ children }) => children
      }
    })
  } as WorkerMessage)
}

export default null
