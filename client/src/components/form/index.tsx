import { useEffect } from  "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Textarea } from "../ui/textarea"
import { CheckboxDropdown } from "../CheckboxDropdown"
import SelectDropdown from "../SelectDropdown"
import { Input } from "../ui/input"
import { FormFieldBase } from "./FormFieldBase"
import type * as z from "zod"
import type { DefaultValues, FieldValues, Path} from "react-hook-form";
import type { FieldConfig} from "./types";
import { Button } from "@/components/ui/button"


type FormProps<T extends FieldValues> = {
  fields: Array<FieldConfig & { name: keyof T }>
  onSubmit: (data: T) => void
  onChange?: (data: Partial<T>) => void
  submitButtonText?: string
  title?: string
  description?: string
  isLoading?: boolean
  error?: string | null
  schema: z.ZodSchema<T>
} & (
  | { 
      onCancel?: undefined; 
      cancelButtonText?: undefined 
    }
  | { 
    onCancel: () => void; 
    cancelButtonText: string 
  }
)

export default function Form<T extends FieldValues>({
  fields,
  onSubmit,
  onChange,
  submitButtonText = "Submit",
  title,
  description,
  isLoading = false,
  schema,
}: FormProps<T>) {
  
  // Setup form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors }
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce((acc, field) => {
      (acc as any)[field.name] = field.type === 'checkbox' ? [] : '';
      return acc;
    }, {} as DefaultValues<T>)
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
              required={field.required}
              disabled={field.disabled}>
              <Input 
                id={field.name} type={field.inputType || 'text'} 
                placeholder={field.placeholder} 
                disabled={field.disabled || isLoading} 
                {...register(field.name as Path<T>)} />
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
            required={field.required}
            disabled={field.disabled}>
            <Textarea
              id={field.name}
              className={`min-h-[${6 * 24}px]`}
              placeholder={field.placeholder}
              disabled={field.disabled || isLoading}
              {...register(field.name as Path<T>)} 
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
            required={field.required}
            disabled={field.disabled}>
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
                disabled={field.disabled || isLoading}/>

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
            required={field.required}
            disabled={field.disabled}>
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
                disabled={field.disabled || isLoading}
                isLoading={field.isLoading}/>
          </FormFieldBase>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="w-full max-w-2xl mx-auto space-y-6 px-6 bg-white  max-h-min  py-10">
      {(title || description) && (
        <div className="space-y-2">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}

      {fields.map(renderField)}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 size={20} className="animate-spin text-secondary" /> : null}
        {isLoading ? "Submitting..." : submitButtonText}
      </Button>
    </form>
  )
}
