export function round(number: number, precision = 3) {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}
