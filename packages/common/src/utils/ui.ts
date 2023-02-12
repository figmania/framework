export interface UIDownloadOptions {
  type: string
  filename: string
}

export function uiDownload(contents: string, { type, filename }: UIDownloadOptions) {
  const blob = new Blob([contents], { type })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = filename
  link.click()
}
