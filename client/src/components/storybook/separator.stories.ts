import type { Meta, StoryObj } from '@storybook/react-vite'

import { Separator } from '../ui/separator'

const meta = {
  title: 'UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    className: 'w-48',
  },
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    className: 'h-12',
  },
}

export const Default: Story = {
  args: {
    className: 'w-48',
  },
}

export const NonDecorative: Story = {
  args: {
    decorative: false,
    className: 'w-48',
  },
}
