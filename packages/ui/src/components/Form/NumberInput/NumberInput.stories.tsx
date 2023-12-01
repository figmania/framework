import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ICON } from '../../Icon/Icon'
import { NumberInput } from './NumberInput'

const meta = {
  component: NumberInput,
  args: {
    name: 'input',
    placeholder: 'Type value ...',
    precision: 2,
    suffix: '%',
    defaultValue: 0,
    icon: ICON.ANIMATE_OPACITY,
    value: 0,
    min: 0,
    max: 1,
    step: 0.1
  }
} satisfies Meta<typeof NumberInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  render(args) {
    const [value, setValue] = useState(args.value)
    return <NumberInput {...args} value={value} onChange={(newValue) => { setValue(newValue) }} />
  }
} satisfies Story
