import { AtrulePlain, DeclarationPlain, Raw, RulePlain, ValuePlain } from 'css-tree'

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
