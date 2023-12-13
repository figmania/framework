import { APNGEncoder } from './encoders/APNGEncoder'
import { Encoder } from './encoders/Encoder'
import { MPEG4Encoder } from './encoders/MPEG4Encoder'
import { SvgRenderer } from './util/svg'

export type ConvertFormat = 'mp4' | 'apng'

export interface ConvertOptions {
  format: ConvertFormat
  width: number
  height: number
  fps: number
  loop: boolean
  lossy: boolean
}

const ENCODER_MAP: Record<ConvertFormat, Encoder> = {
  apng: APNGEncoder,
  mp4: MPEG4Encoder
}

const OUTPUT_MAP: Record<ConvertFormat, 'raw' | 'png'> = {
  apng: 'raw',
  mp4: 'png'
}

export async function convert(value: string, { format, width, height, fps, loop, lossy }: ConvertOptions): Promise<ArrayBuffer> {
  const parser = new DOMParser()
  const encoder = ENCODER_MAP[format]({ width, height, fps, loop, lossy })
  const doc = parser.parseFromString(value, 'text/html')
  const svg = doc.querySelector<SVGSVGElement>('svg')!
  const renderer = SvgRenderer(svg, { width, height, fps, output: OUTPUT_MAP[format] })
  await renderer.process((buffer) => encoder.add(buffer))
  return encoder.finalize()
}
