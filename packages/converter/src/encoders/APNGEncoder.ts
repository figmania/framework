import UPNG from 'upng-js'
import { Encoder } from './Encoder'

export const APNGEncoder: Encoder = ({ width, height, fps, loop, lossy }) => {
  const frames: ArrayBuffer[] = []
  return {
    async add(buffer: ArrayBuffer): Promise<void> {
      frames.push(buffer)
    },
    async finalize(): Promise<ArrayBuffer> {
      const delays = Array(frames.length).fill(1000 / fps)
      if (!loop) { delays[delays.length - 1] = -1 }
      return UPNG.encode(frames, width, height, lossy ? 256 : 0, delays)
    }
  }
}
