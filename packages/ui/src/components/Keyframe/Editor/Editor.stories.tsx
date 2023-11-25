import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { ICON } from '../../Icon/Icon'
import { Editor } from './Editor'

type PropertyKey = 'opacity' | 'x' | 'y' | 'scale' | 'rotate'

const meta = {
  parameters: { padding: false },
  component: Editor<PropertyKey>,
  args: {
    duration: 20,
    config: {
      opacity: { icon: ICON.ANIMATE_OPACITY, label: 'Opacity', from: 0, to: 1, min: 0, max: 1, step: 0.1, precision: 2, suffix: '%' },
      x: { icon: ICON.ANIMATE_X, label: 'Move X', from: 0, to: 100, min: -1000, max: 1000, step: 10, precision: 0, suffix: 'px' },
      y: { icon: ICON.ANIMATE_Y, label: 'Move Y', from: 0, to: 100, min: -1000, max: 1000, step: 10, precision: 0, suffix: 'px' },
      scale: { icon: ICON.ANIMATE_SCALE, label: 'Scale', from: 0.5, to: 1.0, min: 0, max: 2, step: 0.1, precision: 2, suffix: '%' },
      rotate: { icon: ICON.ANIMATE_ROTATION, label: 'Rotate', from: 0, to: 360, min: -720, max: 720, step: 10, precision: 0, suffix: '°' }
    },
    data: {
      opacity: [{ interval: { from: 0, to: 5 }, value: { from: 0, to: 1 } }, { interval: { from: 15, to: 20 }, value: { from: 1, to: 0 } }],
      x: [{ interval: { from: 5, to: 15 }, value: { from: 100, to: 0 } }],
      y: [],
      scale: [],
      rotate: []
    }
  }
} satisfies Meta<typeof Editor<PropertyKey>>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  render(args) {
    const [{ data }, updateArgs] = useArgs<typeof args>()
    return (
      <Editor {...args} data={data} onChange={(newData) => { updateArgs({ data: newData }) }} />
    )
  }
} satisfies Story
