import { HTMLAttributes } from 'react'

export type TooltipProps = Pick<HTMLAttributes<HTMLElement>, 'data-tooltip-id' | 'data-tooltip-content'>

export function tooltip(content: string): TooltipProps {
  return {
    'data-tooltip-id': 'tooltip',
    'data-tooltip-content': content
  }
}
