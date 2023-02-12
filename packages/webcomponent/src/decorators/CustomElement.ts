export interface CustomElementStatic {
  observedAttributes: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new(...args: any[]): any
}

export function CustomElement<T extends CustomElementStatic>(selector: string) {
  return (constructor: T) => {
    window.customElements.define(selector, constructor)
    return constructor
  }
}
