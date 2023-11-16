import type { Meta, StoryObj } from '@storybook/react'
import { ICON } from '../Icon/Icon'
import { Button } from './Button'

const meta = {
  component: Button,
  args: {
    label: 'Button',
    size: 'md'
  }
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Basic = {} satisfies Story

export const WithIcon = { args: { icon: ICON.ALIGN_HORIZONTAL_CENTER } } satisfies Story

export const Small = { args: { size: 'sm' } } satisfies Story
