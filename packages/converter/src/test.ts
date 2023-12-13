import { convert } from '.'
import { svgString } from './test.svg'

interface TestOptions {
  width: number
  height: number
  fps: number
  lossy: boolean
  loop: boolean
}

async function convertApng(options: TestOptions) {
  // Create Container
  const container = document.createElement('div')
  container.classList.add('container')
  document.body.appendChild(container)

  // Create Image
  const image = document.createElement('img')
  image.width = options.width
  image.height = options.height
  container.appendChild(image)

  // Create Size Info
  const pre = document.createElement('pre')
  pre.innerHTML = '...'
  container.appendChild(pre)

  const startTime = new Date()
  const data = await convert(svgString, { format: 'apng', ...options })
  const endTime = new Date()
  const duration = endTime.getTime() - startTime.getTime()

  // Open APNG
  const blob = new Blob([new Uint8Array(data)], { type: 'image/apng' })
  pre.innerHTML = [
    `DURATION: ${duration}`,
    `QUALITY: ${options.lossy ? 'LOSSY' : 'LOSSLESS'}`,
    `FPS: ${options.fps}`,
    `SIZE: ${Math.ceil(blob.size / 1000)} KB`
  ].join('\n')
  image.src = window.URL.createObjectURL(blob)
}

async function convertMp4(options: TestOptions) {
  // Create Container
  const container = document.createElement('div')
  container.classList.add('container')
  document.body.appendChild(container)

  // Create Video
  const video = document.createElement('video')
  video.width = options.width
  video.height = options.height
  container.appendChild(video)

  // Create Size Info
  const pre = document.createElement('pre')
  pre.innerHTML = '...'
  container.appendChild(pre)

  const startTime = new Date()
  const data = await convert(svgString, { format: 'mp4', ...options })
  const endTime = new Date()
  const duration = endTime.getTime() - startTime.getTime()

  // Open APNG
  const blob = new Blob([new Uint8Array(data)], { type: 'video/mp4' })
  pre.innerHTML = [
    `DURATION: ${duration}`,
    `QUALITY: ${options.lossy ? 'LOSSY' : 'LOSSLESS'}`,
    `FPS: ${options.fps}`,
    `SIZE: ${Math.ceil(blob.size / 1000)} KB`
  ].join('\n')

  // Create Source
  const source = document.createElement('source')
  source.type = 'video/mp4'
  source.src = window.URL.createObjectURL(blob)
  video.loop = options.loop
  video.autoplay = true
  video.muted = true
  video.appendChild(source)
}

convertApng({ width: 640, height: 320, fps: 30, loop: true, lossy: false })
convertMp4({ width: 640, height: 320, fps: 30, loop: true, lossy: false })
