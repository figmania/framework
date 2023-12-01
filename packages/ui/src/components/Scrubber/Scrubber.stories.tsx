import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Scrubber } from './Scrubber'

const meta = {
  component: Scrubber,
  args: {
    value: 50,
    duration: 100
  }
} satisfies Meta<typeof Scrubber>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  render(args) {
    const [value, setValue] = useState(args.value)
    return <Scrubber {...args} value={value} onChange={(newValue) => { setValue(newValue) }} style={{ marginTop: 32 }} />
  }
} satisfies Story
