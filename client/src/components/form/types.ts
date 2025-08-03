// Field types
type BaseFieldConfig = {
    name: string
    label: string
    helperText?: string
    required?: boolean
    disabled?: boolean
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
    options: Array<{ value: string; label: string }>
    placeholder?: string
  }
  type CategorizedCheckboxFieldConfig = BaseFieldConfig & {
    type: 'categorized-checkbox'
    options: Array<{ value: string; label: string, subcategories: Array<{ value: string; label: string }> }>
    placeholder?: string
  }
  
  type SelectFieldConfig = BaseFieldConfig & {
    type: 'select'
    options: Array<{ value: string | number; label: string }>
    placeholder?: string
    isLoading?: boolean
  }
  
  
  
type FieldConfig = TextFieldConfig | TextareaFieldConfig | CheckboxFieldConfig | SelectFieldConfig | CategorizedCheckboxFieldConfig
  
export type { FieldConfig, TextFieldConfig, TextareaFieldConfig, CheckboxFieldConfig, SelectFieldConfig, CategorizedCheckboxFieldConfig }