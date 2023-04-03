import 'hast'

declare module 'hast' {
  type AnimEase = 'none' | 'power1.out' | 'power1.in' | 'power1.inOut'

  interface Element {
    properties: Properties
  }

  interface Properties {
    [key: string]: string
    'id'?: string
    'anim'?: string
    'anim:duration'?: string
    'anim:ease'?: AnimEase
    'anim:transform-origin'?: string
    'anim:rotation'?: string
    'anim:opacity'?: string
    'anim:x'?: string
    'anim:y'?: string
    'anim:scale'?: string
  }
}
