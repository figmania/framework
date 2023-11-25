import { useArgs } from '@storybook/preview-api'
import { type Meta, type StoryObj } from '@storybook/react'
import { ICON } from '../../Icon/Icon'
import { Navbar } from '../../Navigation/Navbar/Navbar'
import { Timeline } from './Timeline'

const meta = {
  parameters: { padding: false },
  component: Timeline,
  args: {
    duration: 20,
    style: { height: 54 },
    config: { icon: ICON.ANIMATE_OPACITY, label: 'Opacity', from: 0, to: 1, min: 0, max: 1, step: 0.1, precision: 2, suffix: '%' },
    transitions: [{ interval: { from: 0, to: 5 }, value: { from: 0, to: 1 } }, { interval: { from: 15, to: 20 }, value: { from: 1, to: 0 } }]
  }
} satisfies Meta<typeof Timeline>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  render(args) {
    const [{ transitions }, updateArgs] = useArgs<typeof args>()
    return (
      <>
        <Navbar icon={ICON.SYMBOL_COMPONENT} label='rect-center' style={{ height: 40 }} />
        <div style={{ overflowX: 'auto', backgroundColor: 'var(--background-color)' }}>
          <Timeline {...args} transitions={transitions} onChange={(newTransitions) => { updateArgs({ transitions: newTransitions }) }} />
        </div>
      </>

    )
  }
} satisfies Story
