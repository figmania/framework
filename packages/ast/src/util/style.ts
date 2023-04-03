import { CssNodePlain, fromPlainObject, generate } from 'css-tree'
import { atrule, declaration, rule } from './styleAst'
import { AnimProps } from './transform'

export function buildStylesheet(animMap: Map<string, AnimProps>): string {
  const stylesheet: CssNodePlain = { type: 'StyleSheet', children: [] }
  for (const [id, props] of animMap.entries()) {
    stylesheet.children.push(...buildStyleRules(id, props))
  }
  return generate(fromPlainObject(stylesheet))
}

export function buildStyleRules(id: string, props: AnimProps): CssNodePlain[] {
  return [
    rule(`#${id}`, [
      declaration('transform-origin', props.transformOrigin),
      declaration('animation', `anim-${id} ${props.duration}s ${props.delay}s ${props.ease}`)
    ]),
    atrule(`anim-${id}`, [
      declaration('transform', 'rotate(0)')
    ], [
      declaration('transform', 'rotate(360deg)')
    ])
  ]
}

// const sample = `#id67fa0e0d {
//   transform-origin: center;
//   animation:spin 3s ease infinite;
// }
// @keyframes spin {
//   100% { transform:rotate(-360deg); } 
// }`
// const node = toPlainObject(parse(sample))
// debugger
