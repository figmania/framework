export function parseJSON<T>(value: string | null): T | null {
  if (!value) { return null }
  try {
    return JSON.parse(value)
  } catch (error) {
    return null
  }
}
