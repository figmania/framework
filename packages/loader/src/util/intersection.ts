export interface SvgAnimateIntersectionObserverTarget extends Element {
  play: () => void
  reverse: () => void
}

export const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (isIntersecting) {
      (target as SvgAnimateIntersectionObserverTarget).play()
    } else {
      (target as SvgAnimateIntersectionObserverTarget).reverse()
    }
  })
})
