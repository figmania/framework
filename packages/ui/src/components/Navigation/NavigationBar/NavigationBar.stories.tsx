import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ICON } from '../../Icon/Icon'
import { NavigationBar } from './NavigationBar'

const meta = {
  component: NavigationBar,
  parameters: { padding: false },
  args: {
    selectedIndex: 0,
    items: [
      { icon: ICON.APP_EFFECTS, label: 'Effects' },
      { icon: ICON.APP_LIBRARY, label: 'Library' },
      { icon: ICON.APP_SETTINGS, label: 'Settings' }
    ]
  }
} satisfies Meta<typeof NavigationBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  render(args) {
    const [selectedIndex, setSelectedIndex] = useState(args.selectedIndex)
    return <NavigationBar items={args.items} selectedIndex={selectedIndex} onChange={(_, index) => { setSelectedIndex(index) }} />
  }
} satisfies Story
