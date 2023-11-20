import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Tab } from './Tab'
import { Tabs } from './Tabs'

const meta = {
  component: Tabs,
  parameters: { padding: false },
  args: {
    selectedIndex: 0,
    items: [
      <Tab label='Tab 1'></Tab>,
      <Tab label='Tab 2'></Tab>,
      <Tab label='Tab 3'></Tab>
    ]
  }
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  render(args) {
    const [selectedIndex, setSelectedIndex] = useState(args.selectedIndex)
    return (
      <>
        <Tabs items={args.items} selectedIndex={selectedIndex} onChange={(index) => { setSelectedIndex(index) }}>
          <pre style={{ padding: '12px 16px', margin: 0 }}>Selected: {selectedIndex}</pre>
        </Tabs>
      </>
    )
  }
} satisfies Story
