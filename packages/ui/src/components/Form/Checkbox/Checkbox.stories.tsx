import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox } from './Checkbox'

const meta = {
  component: Checkbox,
  args: {
    name: 'checkbox',
    label: 'Checkbox'
  }
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  render(args) {
    const [value, setValue] = useState(args.value)
    return <Checkbox value={value} onChange={(newValue) => { setValue(newValue) }} {...args} />
  }
} satisfies Story
