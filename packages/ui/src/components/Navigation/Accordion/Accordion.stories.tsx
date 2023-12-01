import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../../Button/Button'
import { Checkbox } from '../../Form/Checkbox/Checkbox'
import { ICON } from '../../Icon/Icon'
import { Accordion } from './Accordion'

const AccordionContents = (
  <div style={{ padding: '8px 12px', backgroundColor: 'var(--panel-inactive-color)' }}>Accordion Contents</div>
)

const meta = {
  component: Accordion,
  parameters: { padding: false },
  args: {
    active: true,
    label: 'Accordion Label',
    children: AccordionContents
  }
} satisfies Meta<typeof Accordion>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {} satisfies Story

export const Multiple = {
  render(args) {
    const items = ['A', 'B', 'C', 'D', 'E']
    const [selectedItem, setSelectedItem] = useState('A')
    return (
      <>
        {items.map((item) => (
          <Accordion key={item} {...args} label={`Accordion ${item}`} active={item === selectedItem} activate={() => {
            setSelectedItem(item)
          }} />
        ))}
      </>
    )
  }
} satisfies Story

export const WithHeader = {
  args: {
    renderHeader: () => <Button icon={ICON.UI_DOWNLOAD} label='Export' />
  }
} satisfies Story

export const WithSettings = {
  args: {
    renderSettings: () => (
      <>
        <Checkbox label='Option 1' name='option-1' />
        <Checkbox label='Option 2' name='option-2' />
      </>
    )
  }
} satisfies Story
