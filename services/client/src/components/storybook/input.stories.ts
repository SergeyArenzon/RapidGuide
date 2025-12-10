import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Input } from '../ui/input'

const meta = {
  title: 'Form/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onChange: fn() },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: 'email',
    type: 'text',
    placeholder: 'Enter your email',
  },
}

export const Password: Story = {
  args: {
    id: 'password',
    type: 'password',
    placeholder: 'Enter your password',
  },
}

export const WithValue: Story = {
  args: {
    id: 'name',
    type: 'text',
    value: 'John Doe',
    placeholder: 'Enter your name',
  },
}

export const Disabled: Story = {
  args: {
    id: 'disabled',
    type: 'text',
    placeholder: 'Disabled input',
    disabled: true,
  },
}
