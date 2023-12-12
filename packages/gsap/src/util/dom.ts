/* eslint-disable @stylistic/padding-line-between-statements */
import { AnimDefaults, AnimEase, AnimProperties, AnimProperty, AnimTimeline, deserializeAnimString } from '@figmania/common'

export function getAnimSvgAttributes(element: SVGSVGElement): AnimDefaults {
  return {
    transformOrigin: getAnimAttribute(element, 'transform-origin', '50% 50%'),
    ease: getAnimAttribute<AnimEase>(element, 'ease', 'ease-in-out')
  }
}

export function getAnimAttributes(element: Element): Record<AnimProperty, string | undefined> {
  return {
    x: getAnimAttribute(element, 'x'),
    y: getAnimAttribute(element, 'y'),
    opacity: getAnimAttribute(element, 'opacity'),
    rotation: getAnimAttribute(element, 'rotation'),
    scale: getAnimAttribute(element, 'scale')
  }
}

export function getAnimAttribute<T = string>(element: Element, name: string): T | undefined
export function getAnimAttribute<T = string>(element: Element, name: string, defaultValue: T): T
export function getAnimAttribute<T = string>(element: Element, name: string, defaultValue?: T): T | undefined {
  const result = element.getAttribute(`anim:${name}`) ?? defaultValue
  if (!result) { return undefined }
  return result as T
}

export function getAnimTimelines(element: Element, defaults: AnimDefaults): AnimTimeline[] {
  const props = getAnimAttributes(element)
  return AnimProperties.reduce<AnimTimeline[]>((arr, property) => {
    if (!props[property]) { return arr }
    const [initialValue, transitions] = deserializeAnimString(props[property]!, defaults)
    arr.push({ property, initialValue, transitions })
    return arr
  }, [])
}
