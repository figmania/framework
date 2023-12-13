import { render } from '@figmania/gsap'
import 'gsap'

export interface SvgRendererContext {
  duration: number
  take: (value: number) => Promise<ArrayBuffer>
  process: (fn: (frame: ArrayBuffer) => Promise<void>) => Promise<void>
  destroy: () => void
}

export interface SvgRendererOptions {
  width: number
  height: number
  fps: number
  output: 'raw' | 'png'
}

export function canvasToBlob(canvas: HTMLCanvasElement, type?: string) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Invalid Image Data'))
      } else {
        resolve(blob)
      }
    }, type)
  })
}

export function SvgRenderer(svg: SVGSVGElement, { width, height, fps, output }: SvgRendererOptions): SvgRendererContext {
  const timeline = render(svg)
  const image = document.createElement('img')
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })!

  function renderImage(): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      image.onload = () => {
        context.drawImage(image, 0, 0)
        if (output === 'png') {
          canvasToBlob(canvas, 'image/png').then((blob) => blob.arrayBuffer()).then(resolve)
        } else if (output === 'raw') {
          resolve(context.getImageData(0, 0, width, height).data.buffer)
        } else {
          reject(new Error(`Invalid output format: ${output}`))
        }
      }
      image.src = `data:image/svg+xml;base64,${btoa(svg.outerHTML)}`
    })
  }

  const duration = timeline.duration()

  const take = (value: number) => {
    timeline.time(value)
    return renderImage()
  }

  const process = async (fn: (frame: ArrayBuffer) => void | Promise<void>) => {
    for (let i = 0; i <= duration; i += 1 / fps) {
      await fn(await take(i))
    }
    destroy()
  }

  const destroy = () => {
    image.remove()
    canvas.remove()
  }

  return { duration, take, process, destroy }
}
