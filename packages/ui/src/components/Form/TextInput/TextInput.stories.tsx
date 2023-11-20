import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { TextInput } from './TextInput'

const meta = {
  component: TextInput,
  args: {
    type: 'text',
    name: 'input',
    placeholder: 'Type value ...',
    value: ''
  }
} satisfies Meta<typeof TextInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  render(args) {
    const [value, setValue] = useState(args.value)
    return <TextInput {...args} value={value} onChange={(newValue) => { setValue(newValue) }} />
  }
} satisfies Story
