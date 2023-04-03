import camelcase from 'camelcase'
import decamelize from 'decamelize'

export type GsapEase = 'none' | 'power1.in' | 'power1.out' | 'power1.inOut'

export type AnimEase = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'

export const EaseAnimToGsap: Record<string, GsapEase> = {
  'linear': 'none',
  'ease-in': 'power1.in',
  'ease-out': 'power1.out',
  'ease-in-out': 'power1.inOut'
}

export const EaseGsapToAnim: Record<string, AnimEase> = {
  'none': 'linear',
  'power1.in': 'ease-in',
  'power1.out': 'ease-out',
  'power1.inOut': 'ease-in-out'
}

export type Timeline = gsap.core.Timeline

export type TweenValue = string | number

export interface TweenProps {
  from: gsap.TweenVars
  to: gsap.TweenVars
  delay: number
  duration?: number
}

export interface AnimAttribute {
  propertyName: string
  value: string
}

export function getAnimAttributes(element: Element): AnimAttribute[] {
  return element.getAttributeNames().filter((name) => name.startsWith('anim:')).map((name) => name.split(':')[1]).map<AnimAttribute>((name) => ({
    propertyName: camelcase(name),
    value: element.getAttribute(`anim:${name}`)!
  }))
}

export function getAnimValue(value: string) {
  return isNaN(+value) ? value : parseFloat(value)
}

export function getDefaultProps(element: SVGSVGElement): gsap.TweenVars {
  return getAnimAttributes(element).reduce<gsap.TweenVars>((obj, { propertyName, value }) => {
    obj[propertyName] = propertyName === 'ease' ? EaseAnimToGsap[getAnimValue(value)] : getAnimValue(value)
    return obj
  }, {})
}

export function setDefaultProps(element: SVGSVGElement, props: gsap.TweenVars): void {
  element.setAttribute('anim', '')
  for (const [propertyName, value] of Object.entries(props)) {
    const attributeName = decamelize(propertyName, '-')
    element.setAttribute(`anim:${attributeName}`, String(value))
  }
}

export function getTweenProps(element: Element): TweenProps {
  return getAnimAttributes(element).reduce<TweenProps>((obj, { propertyName, value }) => {
    if (propertyName === 'delay') {
      obj.delay = parseFloat(value)
    } else if (propertyName === 'duration') {
      obj.duration = parseFloat(value)
    } else if (propertyName === 'ease') {
      obj.from.ease = EaseAnimToGsap[value]
      obj.to.ease = EaseAnimToGsap[value]
    } else {
      const values = value.split('|').map(getAnimValue)
      if (values.length === 1) {
        obj.to[propertyName] = values[0]
      } else {
        obj.from[propertyName] = values[0]
        obj.to[propertyName] = values[1]
      }
    }
    return obj
  }, { from: {}, to: {}, delay: 0 })
}

export function setTweenProps(element: Element, props: TweenProps): void {
  element.setAttribute('anim', '')
  const attributeMap: { [key: string]: string[] } = {}
  for (const [propertyName, value] of Object.entries(props.from)) {
    const attributeName = decamelize(propertyName, '-')
    if (!attributeMap[attributeName]) { attributeMap[attributeName] = [] }
    attributeMap[attributeName][0] = String(value)
  }
  for (const [propertyName, value] of Object.entries(props.to)) {
    const attributeName = decamelize(propertyName, '-')
    if (!attributeMap[attributeName]) { attributeMap[attributeName] = [] }
    attributeMap[attributeName][1] = String(value)
  }
  for (const [attributeName, values] of Object.entries(attributeMap)) {
    element.setAttribute(`anim:${attributeName}`, values[0] === undefined ? values[1] : `${values[0]}|${values[1]}`)
  }
  element.setAttribute('anim:delay', String(props.delay ?? 0))
  element.setAttribute('anim:duration', String(props.duration ?? 0))
}
