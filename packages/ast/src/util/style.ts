import { AtrulePlain, CssNodePlain, DeclarationPlain, Raw, RulePlain, ValuePlain, fromPlainObject, generate } from 'css-tree'
import { AnimProps } from './transform'

export function value(raw: string): ValuePlain {
  return { type: 'Value', children: [{ type: 'Raw', value: raw }] }
}

export function declaration(property: string, raw: string, important = false): DeclarationPlain {
  return { type: 'Declaration', property, value: value(raw), important }
}

export function prelude(raw: string): Raw {
  return { type: 'Raw', value: raw }
}

export function rule(selector: string, declarations: DeclarationPlain[]): RulePlain {
  return {
    type: 'Rule',
    prelude: prelude(selector),
    block: {
      type: 'Block',
      children: declarations
    }
  }
}

export function atrule(selector: string, from: DeclarationPlain[], to: DeclarationPlain[]): AtrulePlain {
  return {
    type: 'Atrule',
    name: 'keyframes',
    prelude: prelude(selector),
    block: {
      type: 'Block',
      children: [
        rule('0%', from),
        rule('100%', to)
      ]
    }
  }
}

export function buildStylesheet(animMap: Map<string, AnimProps>): string {
  const stylesheet: CssNodePlain = {
    type: 'StyleSheet',
    children: [
      rule('svg', [
        declaration('backface-visibility', 'hidden'),
        declaration('perspective', '1000px')
      ]),
      rule('svg *', [
        declaration('transform-box', 'fill-box'),
        declaration('transform-origin', 'center'),
        declaration('will-change', 'transform, opacity')
      ])
    ]
  }
  for (const [id, props] of animMap.entries()) { stylesheet.children.push(...buildStyleRules(id, props)) }
  return generate(fromPlainObject(stylesheet))
}

export function buildDeclarations({ rotation, opacity, x, y, scale }: AnimProps, index: 0 | 1) {
  const result: DeclarationPlain[] = []
  const transforms: string[] = []
  if (opacity) { result.push(declaration('opacity', String(opacity[index]))) }
  if (x) { transforms.push(`translateX(${x[index]}px)`) }
  if (y) { transforms.push(`translateY(${y[index]}px)`) }
  if (rotation) { transforms.push(`rotate(${rotation[index]}deg)`) }
  if (scale) { transforms.push(`scale(${scale[index]})`) }
  if (transforms.length > 0) { result.push(declaration('transform', transforms.join(' '))) }
  return result
}

export function buildStyleRules(id: string, props: AnimProps): CssNodePlain[] {
  const from = buildDeclarations(props, 0)
  const to = buildDeclarations(props, 1)
  return [
    rule(`#${id}`, [
      declaration('animation', `anim-${id} ${props.duration}s ${props.delay}s ${props.ease} 1 both`),
      ...from
    ]),
    atrule(`anim-${id}`, from, to)
  ]
}
