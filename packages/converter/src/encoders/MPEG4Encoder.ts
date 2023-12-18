import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import { Encoder } from './Encoder'

async function loadFfmpeg(): Promise<FFmpeg> {
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm'
  const ffmpeg = new FFmpeg()
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
  })
  await ffmpeg.createDir('images')
  ffmpeg.on('log', ({ type, message }) => {
    console.info('ffmpeg', type, message)
  })
  return ffmpeg
}

export const MPEG4Encoder: Encoder = ({ width, height, fps, lossy }) => {
  const promise = loadFfmpeg()
  let index = 0
  return {
    async add(buffer: ArrayBuffer): Promise<void> {
      const ffmpeg = await promise
      const filename = String(index).padStart(4, '0')
      await ffmpeg.writeFile(`images/${filename}.png`, new Uint8Array(buffer))
      index += 1
    },
    async finalize(): Promise<ArrayBuffer> {
      const ffmpeg = await promise
      await ffmpeg.exec([
        '-r', String(fps),
        '-pattern_type', 'sequence',
        '-i', 'images/%04d.png',
        '-c:v', 'h264',
        '-vb', lossy ? '2M' : '10M',
        '-s', `${width}x${height}`,
        '-r', String(fps),
        'images/output.mp4'
      ])
      const data = await ffmpeg.readFile('images/output.mp4') as Uint8Array
      ffmpeg.terminate()
      return data.buffer
    }
  }
}
