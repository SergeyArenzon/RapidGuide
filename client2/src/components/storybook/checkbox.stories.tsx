import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Checkbox } from '../ui/checkbox'

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { 
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: 'default-checkbox',
  },
}

export const Checked: Story = {
  args: {
    id: 'checked-checkbox',
    checked: true,
  },
}

export const Unchecked: Story = {
  args: {
    id: 'unchecked-checkbox',
    checked: false,
  },
}

export const Disabled: Story = {
  args: {
    id: 'disabled-checkbox',
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    id: 'disabled-checked-checkbox',
    disabled: true,
    checked: true,
  },
}

export const WithLabel: Story = {
  args: {
    id: 'labeled-checkbox',
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <label 
        htmlFor={args.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
}

export const WithDescription: Story = {
  args: {
    id: 'description-checkbox',
  },
  render: (args) => (
    <div className="flex items-start space-x-2">
      <Checkbox {...args} className="mt-0.5" />
      <div className="grid gap-1.5 leading-none">
        <label 
          htmlFor={args.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Marketing emails
        </label>
        <p className="text-xs text-muted-foreground">
          You agree to receive marketing emails from us.
        </p>
      </div>
    </div>
  ),
}

export const Invalid: Story = {
  args: {
    id: 'invalid-checkbox',
    'aria-invalid': true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <label 
        htmlFor={args.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Required field
      </label>
    </div>
  ),
}
