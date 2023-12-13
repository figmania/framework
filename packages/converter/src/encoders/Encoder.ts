export interface EncoderContext {
  add(buffer: ArrayBuffer): Promise<void>
  finalize(): Promise<ArrayBuffer>
}

export interface EncoderOptions {
  width: number
  height: number
  fps: number
  loop: boolean
  lossy: boolean
}

export type Encoder = (options: EncoderOptions) => EncoderContext
