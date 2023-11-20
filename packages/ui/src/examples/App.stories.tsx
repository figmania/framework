import type { Meta, StoryObj } from '@storybook/react'
import { App } from './App'

const meta = {
  component: App,
  parameters: { padding: false }
} satisfies Meta<typeof App>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {} satisfies Story
