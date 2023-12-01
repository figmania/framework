import type { Meta, StoryObj } from '@storybook/react'
import { Code } from './Code'

const meta = {
  component: Code,
  args: {
    value: '<div class="main"><p>Hello World</p></div>',
    indent: true
  }
} satisfies Meta<typeof Code>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {} satisfies Story
