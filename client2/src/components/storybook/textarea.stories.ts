import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Textarea } from '../ui/textarea'

const meta = {
  title: 'Form/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onChange: fn() },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
}

export const WithValue: Story = {
  args: {
    value: 'This is some sample text in the textarea.',
    placeholder: 'Enter your message...',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'This textarea is disabled',
  },
}

export const WithRows: Story = {
  args: {
    rows: 6,
    placeholder: 'This textarea has 6 rows...',
  },
}

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    placeholder: 'This field has an error',
    value: 'Invalid content',
  },
}

export const Resizable: Story = {
  args: {
    className: 'resize-y',
    placeholder: 'This textarea can be resized vertically...',
  },
}
