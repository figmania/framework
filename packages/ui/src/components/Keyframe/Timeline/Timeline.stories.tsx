import { useArgs } from '@storybook/preview-api'
import { type Meta, type StoryObj } from '@storybook/react'
import { ICON } from '../../Icon/Icon'
import { Timeline } from './Timeline'

const meta = {
  parameters: { padding: false },
  component: Timeline,
  args: {
    bar: { duration: 2, tick: 0.1 },
    config: { icon: ICON.ANIMATE_OPACITY, label: 'Opacity', from: 0, to: 1, min: 0, max: 1, step: 0.1, precision: 2, suffix: '%' },
    timeline: {
      property: 'opacity',
      initialValue: 0,
      transitions: [{ from: 0.0, to: 1, value: 1, ease: 'ease-in-out' }, { from: 1, to: 2.0, value: 0, ease: 'ease-in-out' }]
    },
    style: {
      height: 60,
      width: '100%',
      backgroundColor: 'var(--background-color)'
    }
  }
} satisfies Meta<typeof Timeline>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  render(args) {
    const [{ timeline }, updateArgs] = useArgs<typeof args>()
    return (
      <Timeline {...args} timeline={timeline} onChange={(newTimeline) => { updateArgs({ timeline: newTimeline }) }} />
    )
  }
} satisfies Story
