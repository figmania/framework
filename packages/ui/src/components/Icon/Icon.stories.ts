import type { Meta, StoryObj } from '@storybook/react'
import { ICON, Icon } from '../Icon/Icon'

const meta = {
  component: Icon,
  args: {
    icon: ICON.SYMBOL_COMPONENT,
    size: 'md'
  }
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {} satisfies Story
