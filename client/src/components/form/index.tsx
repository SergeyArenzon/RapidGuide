"use client"

import { useEffect, useMemo } from  "react"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "../ui/input"
import { FormFieldBase } from "./FormFieldBase"
import { Textarea } from "../ui/textarea"
import { CheckboxDropdown } from "../CheckboxDropdown"
import SelectDropdown from "../SelectDropdown"
import { CheckboxFieldConfig, FieldConfig, TextFieldConfig, SelectFieldConfig } from "./types"
import { validateCheckbox, validateText, validateSelect } from "./validations"
import { CategorizedCheckboxDropdown } from "../CategorizedCheckboxDropdown"


type FormProps<T> = {
  fields: FieldConfig[]
  onSubmit: (data: T) => void
  onChange?: (data: Partial<T>) => void
  submitButtonText?: string
  title?: string
  description?: string
} & (
  | { 
      onCancel?: undefined; 
      cancelButtonText?: undefined 
    } // Neither exists
  | { 
    onCancel: () => void; 
    cancelButtonText: string 
  } // Both required
)

export default function Form<T>({
  fields,
  onSubmit,
  onChange,
  submitButtonText = "Submit",
  title,
  description
}: FormProps<T>) {
  // Generate Zod schema dynamically based on field configurations
  const generateZodSchema = () => {
    const schemaMap: Record<string, z.ZodTypeAny> = {}; // ✅ Correct type

    fields.forEach(field => {
      let fieldSchema: z.ZodTypeAny = z.string();
      
      if (field.type === 'textarea' || field.type === 'text') 
        fieldSchema = validateText(field as TextFieldConfig)
      if (field.type === 'checkbox' || field.type === 'categorized-checkbox') 
        fieldSchema = validateCheckbox(field as CheckboxFieldConfig)
      if (field.type === 'select') 
        fieldSchema = validateSelect(field as SelectFieldConfig)
      
      schemaMap[field.name] = fieldSchema
    })

    return z.object(schemaMap)
  }

  const schema = generateZodSchema()
  type FormValues = z.infer<typeof schema>

  // Setup form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = field.type === 'checkbox' ? [] : ''
      return acc
    }, {} as Record<string, unknown> )
  })

  // Set up subscription to form changes instead of watching all values
  useEffect(() => {
    if (!onChange) return;
    
    // Subscribe to form changes
    const subscription = watch((formValues) => {
      onChange(formValues as Partial<T>);
    });
    
    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [watch, onChange]);


  
  // Handle form submission
  const onSubmitHandler = (data: FormValues) => {
    onSubmit(data as T)
  }

  // Render field based on type
  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case 'text':
        return (
            <FormFieldBase
              key={field.name}
              name={field.name}
              label={field.label}
              helperText={field.helperText}
              errors={errors}
              required={field.required}>
              <Input 
                id={field.name} type={field.inputType || 'text'} 
                placeholder={field.placeholder} 
                disabled={field.disabled} 
                {...register(field.name)} />
            </FormFieldBase>
          
        )

      case 'textarea':
        return (
          <FormFieldBase
            key={field.name}
            name={field.name}
            label={field.label}
            helperText={field.helperText}
            errors={errors}
            required={field.required}>
            <Textarea
              id={field.name}
              className={`min-h-[${6 * 24}px]`}
              placeholder={field.placeholder}
              disabled={field.disabled}
              {...register(field.name)} 
            />
          </FormFieldBase>
        )

      case 'checkbox':
        return (
          <FormFieldBase
            key={field.name}
            name={field.name}
            label={field.label}
            helperText={field.helperText}
            errors={errors}
            required={field.required}>
              <CheckboxDropdown
                key={field.name}
                name={field.name}
                label={field.label}
                options={field.options}
                placeholder={field.placeholder}
                helperText={field.helperText}
                register={register}
                watch={watch}
                required={field.required}
                setValue={setValue}
                control={control}
                disabled={field.disabled}/>

          </FormFieldBase>
        )
      case 'categorized-checkbox':
        return (
          <FormFieldBase
            key={field.name}
            name={field.name}
            label={field.label}
            helperText={field.helperText}
            errors={errors}
            required={field.required}>
              <CategorizedCheckboxDropdown
                key={field.name}
                name={field.name}
                label={field.label}
                options={field.options}
                placeholder={field.placeholder}
                register={register}
                watch={watch}
                required={field.required}
                setValue={setValue}
                control={control}
                disabled={field.disabled}/>

          </FormFieldBase>
        )
      case 'select':
        return (
          <FormFieldBase
            key={field.name}
            name={field.name}
            label={field.label}
            helperText={field.helperText}
            errors={errors}
            required={field.required}>
              <SelectDropdown
                key={field.name}
                name={field.name}
                label={field.label}
                options={field.options}
                placeholder={field.placeholder}
                helperText={field.helperText}
                register={register}
                watch={watch}
                setValue={setValue}
                disabled={field.disabled}
                isLoading={field.isLoading}/>
          </FormFieldBase>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full max-w-2xl mx-auto space-y-6 px-6 bg-white  max-h-min  py-10">
      {(title || description) && (
        <div className="space-y-2">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}

      {fields.map(renderField)}

      <Button type="submit" className="w-full">
        {submitButtonText}
      </Button>
    </form>
  )
}
