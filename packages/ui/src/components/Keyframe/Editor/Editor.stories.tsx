import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { ICON } from '../../Icon/Icon'
import { Editor } from './Editor'

const meta = {
  parameters: { padding: false },
  component: Editor,
  args: {
    bar: { duration: 2, tick: 0.1 },
    allowMultiple: true,
    config: {
      opacity: { icon: ICON.ANIMATE_OPACITY, label: 'Opacity', from: 0, to: 1, min: 0, max: 1, step: 0.1, precision: 2, suffix: '%' },
      x: { icon: ICON.ANIMATE_X, label: 'Move X', from: 0, to: 100, min: -1000, max: 1000, step: 10, precision: 0, suffix: 'px' },
      y: { icon: ICON.ANIMATE_Y, label: 'Move Y', from: 0, to: 100, min: -1000, max: 1000, step: 10, precision: 0, suffix: 'px' },
      scale: { icon: ICON.ANIMATE_SCALE, label: 'Scale', from: 0.5, to: 1.0, min: 0, max: 2, step: 0.1, precision: 2, suffix: '%' },
      rotation: { icon: ICON.ANIMATE_ROTATION, label: 'Rotate', from: 0, to: 360, min: -720, max: 720, step: 10, precision: 0, suffix: '°' }
    },
    timelines: [{
      property: 'opacity',
      initialValue: 0,
      transitions: [{ from: 0.0, to: 0.5, value: 1, ease: 'ease-in-out' }, { from: 1.5, to: 2.0, value: 0, ease: 'ease-in-out' }]
    }, {
      property: 'x',
      initialValue: 100,
      transitions: [{ from: 0.5, to: 1.5, value: 0, ease: 'ease-in-out' }]
    }]
  }
} satisfies Meta<typeof Editor>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  render(args) {
    const [{ timelines }, updateArgs] = useArgs<typeof args>()
    return (
      <div style={{ height: 200, display: 'flex', flexDirection: 'column' }}>
        <Editor {...args} timelines={timelines} onChange={(value) => { updateArgs({ timelines: value }) }} />
      </div>
    )
  }
} satisfies Story
