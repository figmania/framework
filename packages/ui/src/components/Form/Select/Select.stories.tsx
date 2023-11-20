import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ICON } from '../../Icon/Icon'
import { Select } from './Select'

const meta = {
  component: Select,
  args: {
    value: 'opacity',
    options: [
      { label: 'Opacity', value: 'opacity', icon: ICON.ANIMATE_OPACITY },
      { label: 'Translate X', value: 'translate-x', icon: ICON.ANIMATE_X },
      { label: 'Translate Y', value: 'translate-y', icon: ICON.ANIMATE_Y }
    ]
  }
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  render(args) {
    const [value, setValue] = useState(args.value)
    return <Select {...args} value={value} onChange={(option) => { setValue(option.value) }} />
  }
} satisfies Story
