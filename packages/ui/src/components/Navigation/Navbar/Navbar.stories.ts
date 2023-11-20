import type { Meta, StoryObj } from '@storybook/react'
import { ICON } from '../../Icon/Icon'
import { Navbar } from './Navbar'

const meta = {
  component: Navbar,
  parameters: { padding: false },
  args: {
    label: 'Navbar'
  }
} satisfies Meta<typeof Navbar>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {} satisfies Story

export const WithIcon = { args: { icon: ICON.SYMBOL_COMPONENT } } satisfies Story
