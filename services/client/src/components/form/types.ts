// Field types
type BaseFieldConfig = {
    name: string
    label: string
    helperText?: string
    required?: boolean
    disabled?: boolean
    hide?: boolean
    className?: string
    validation?: {
      min?: number
      max?: number
      pattern?: RegExp
      message?: string
    }
  }
  
  type TextFieldConfig = BaseFieldConfig & {
    type: 'text'
    placeholder?: string
    inputType?: string // For HTML input types like 'email', 'password', etc.
  }
  
  type TextareaFieldConfig = BaseFieldConfig & {
    type: 'textarea'
    placeholder?: string
    rows?: number
  }
  
  type CheckboxFieldConfig = BaseFieldConfig & {
    type: 'checkbox'
    options: Array<
      | { value: string; label: string }
      | { value: string; label: string; subcategories?: Array<{ value: string; label: string }> }
    >
    placeholder?: string
  }
  
  type SelectFieldConfig = BaseFieldConfig & {
    type: 'select'
    options: Array<{ value: string | number; label: string }>
    placeholder?: string
    isLoading?: boolean
  }

  type SubmitButtonFieldConfig = {
    type: 'submit'
    label: string
    className?: string
    disabled?: boolean
  }

  type CancelButtonFieldConfig = {
    type: 'cancel'
    label: string
    onClick: () => void
    className?: string
    disabled?: boolean
  }
  
  
  
type FieldConfig = TextFieldConfig | TextareaFieldConfig | CheckboxFieldConfig | SelectFieldConfig | SubmitButtonFieldConfig | CancelButtonFieldConfig
  
export type { FieldConfig, TextFieldConfig, TextareaFieldConfig, CheckboxFieldConfig, SelectFieldConfig, SubmitButtonFieldConfig, CancelButtonFieldConfig }