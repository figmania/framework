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

export const Default = {} satisfies Story

export const WithIcon = { args: { icon: ICON.SYMBOL_COMPONENT } } satisfies Story

export const Small = { args: { size: 'sm' } } satisfies Story
