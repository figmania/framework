export function getSelectorIndex(root: HTMLElement, selector: string, target: EventTarget | null) {
  if (!root) { return }
  const slot = closestSelector(selector, target)
  if (!slot) { return }
  const slots = Array.from(root.querySelectorAll(selector))
  const index = slots.indexOf(slot)
  return index === -1 ? undefined : index
}

export function closestSelector<T extends HTMLElement = HTMLElement>(selectors: string, element: EventTarget | null): T | undefined {
  let current = element as T | undefined
  while (current) {
    if (current.matches(selectors)) {
      return current
    }
    current = current.parentElement as T | undefined
  }
}