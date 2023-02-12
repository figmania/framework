export function bufferDecodeUtf8(buffer: Uint8Array) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    const blob = new Blob([buffer], { type: 'image/svg+xml' })
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Could not read from blob'))
    reader.readAsText(blob, 'utf8')
  })
}
