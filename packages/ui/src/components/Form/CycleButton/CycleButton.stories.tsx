import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { ICON } from '../../Icon/Icon'
import { CycleButton } from './CycleButton'

const meta = {
  component: CycleButton,
  argTypes: {
    value: { type: 'string' }
  },
  args: {
    value: 'linear',
    size: 'sm',
    options: [
      { value: 'linear', icon: ICON.EASE_LINEAR },
      { value: 'ease-in', icon: ICON.EASE_IN },
      { value: 'ease-out', icon: ICON.EASE_OUT },
      { value: 'ease-in-out', icon: ICON.EASE_IN_OUT }
    ]
  }
} satisfies Meta<typeof CycleButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  render(args) {
    const [{ value }, updateArgs] = useArgs<typeof args>()
    return <CycleButton {...args} value={value} onChange={(option) => { updateArgs({ value: option.value }) }} />
  }
} satisfies Story
