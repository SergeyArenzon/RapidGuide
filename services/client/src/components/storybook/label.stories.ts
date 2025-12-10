import type { Meta, StoryObj } from '@storybook/react-vite'

import { Label } from '../ui/label'

const meta = {
  title: 'Form/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Default Label',
    htmlFor: 'default-input',
  },
}

export const Required: Story = {
  args: {
    children: 'Required Field *',
    htmlFor: 'required-input',
  },
}

export const WithDescription: Story = {
  args: {
    children: 'Email Address',
    htmlFor: 'email-input',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Label',
    htmlFor: 'disabled-input',
    className: 'opacity-50 cursor-not-allowed',
  },
}
