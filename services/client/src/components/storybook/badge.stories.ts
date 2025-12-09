import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '../ui/badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Default Badge',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Badge',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Badge',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Badge',
  },
}

export const WithIcon: Story = {
  args: {
    children: '🔥 Hot',
  },
}

export const LongText: Story = {
  args: {
    children: 'This is a longer badge text',
  },
}

export const AsChild: Story = {
  args: {
    asChild: true,
    children: 'Link Badge',
  },
}
