export function loadResource<T>(url: string, mimetype: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.overrideMimeType(mimetype)
    xhr.onload = () => { resolve(xhr.responseXML!.documentElement as unknown as T) }
    xhr.onerror = reject
    xhr.send('')
  })
}
