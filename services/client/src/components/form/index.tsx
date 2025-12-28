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
  fields: Array<FieldConfig | (FieldConfig & { name: keyof T })>
  onSubmit: (data: T) => void
  onChange?: (data: Partial<T>) => void
  title?: string
  description?: string
  isLoading?: boolean
  error?: string | null
  schema: z.ZodSchema<T>
  formClassName?: string
}

export default function Form<T extends FieldValues>({
  fields,
  onSubmit,
  onChange,
  title,
  description,
  isLoading = false,
  schema,
  formClassName
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
    defaultValues: fields.filter(field => {
      if (field.type === 'submit' || field.type === 'cancel') return false;
      if ('hide' in field && (field as any).hide) return false;
      return 'name' in field;
    }).reduce((acc, field) => {
      if ('name' in field) {
        (acc as any)[(field as any).name] = field.type === 'checkbox' ? [] : '';
      }
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

  // Helper function to convert colSpan to Tailwind class
  const getColSpanClass = (colSpan?: number | 'full') => {
    if (!colSpan) return '';
    if (colSpan === 'full') return 'col-span-full';
    return `col-span-${colSpan}`;
  };

  // Render field based on type
  const renderField = (field: FieldConfig, index: number) => {
    const colSpanClass = 'colSpan' in field ? getColSpanClass(field.colSpan) : '';
    const combinedClassName = [
      'colSpan' in field && field.className ? field.className : '',
      colSpanClass,
      'colSpan' in field && !field.className && colSpanClass ? '' : ''
    ].filter(Boolean).join(' ');
    
    switch (field.type) {
      case 'text':
        return (
          <FormFieldBase
            key={'name' in field ? field.name : index}
            name={'name' in field ? field.name : ''}
            label={field.label}
            helperText={'helperText' in field ? field.helperText : undefined}
            errors={errors}
            required={'required' in field ? field.required : false}
            disabled={field.disabled}
            className={field.className}
          >
            <Input
              id={'name' in field ? field.name : `field-${index}`}
              type={'inputType' in field ? (field.inputType || 'text') : 'text'}
              placeholder={'placeholder' in field ? field.placeholder : undefined}
              disabled={field.disabled || isLoading}
              {
                ...register(
                  ('name' in field ? field.name : '') as Path<T>,
                  ('inputType' in field && field.inputType === 'number')
                    ? { valueAsNumber: true }
                    : undefined
                )
              }
            />
          </FormFieldBase>
        )

      case 'textarea':
        return (
          <FormFieldBase
            key={'name' in field ? field.name : index}
            name={'name' in field ? field.name : ''}
            label={field.label}
            helperText={'helperText' in field ? field.helperText : undefined}
            errors={errors}
            required={'required' in field ? field.required : false}
            disabled={field.disabled}
            className={field.className}>
            <Textarea
              id={'name' in field ? field.name : `field-${index}`}
              className={`min-h-[${6 * 24}px]`}
              placeholder={'placeholder' in field ? field.placeholder : undefined}
              disabled={field.disabled || isLoading}
              {...register(('name' in field ? field.name : '') as Path<T>)} 
            />
          </FormFieldBase>
        )

      case 'checkbox':
        return (
          <FormFieldBase
            key={'name' in field ? field.name : index}
            name={'name' in field ? field.name : ''}
            label={field.label}
            helperText={'helperText' in field ? field.helperText : undefined}
            errors={errors}
            required={'required' in field ? field.required : false}
            disabled={field.disabled}
            className={field.className}>
              <CheckboxDropdown
                key={'name' in field ? field.name : index}
                name={'name' in field ? field.name : ''}
                label={field.label}
                options={'options' in field ? field.options : []}
                placeholder={'placeholder' in field ? field.placeholder : undefined}
                helperText={'helperText' in field ? field.helperText : undefined}
                register={register}
                watch={watch}
                required={'required' in field ? field.required : false}
                setValue={setValue}
                control={control}
                disabled={field.disabled || isLoading}/>

          </FormFieldBase>
        )
      case 'select':
        return (
          <FormFieldBase
            key={'name' in field ? field.name : index}
            name={'name' in field ? field.name : ''}
            label={field.label}
            helperText={'helperText' in field ? field.helperText : undefined}
            errors={errors}
            required={'required' in field ? field.required : false}
            disabled={field.disabled}
            className={field.className}>
              <SelectDropdown
                key={'name' in field ? field.name : index}
                name={'name' in field ? field.name : ''}
                label={field.label}
                options={'options' in field ? field.options : []}
                placeholder={'placeholder' in field ? field.placeholder : undefined}
                helperText={'helperText' in field ? field.helperText : undefined}
                register={register}
                watch={watch}
                setValue={setValue}
                disabled={field.disabled || isLoading}
                isLoading={'isLoading' in field ? field.isLoading : false}/>
          </FormFieldBase>
        )

      case 'submit':
        return (
          <Button
            key={`submit-${index}`}
            type="submit"
            className={`w-full ${field.className || ''}`}
            disabled={field.disabled || isLoading}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin text-secondary" /> : null}
            {isLoading ? "Submitting..." : field.label}
          </Button>
        )

      case 'cancel':
        return (
          <Button
            key={`cancel-${index}`}
            type="button"
            variant="outline"
            className={`w-full ${field.className || ''}`}
            disabled={field.disabled || isLoading}
            onClick={field.onClick}
          >
            {field.label}
          </Button>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className={formClassName || "w-full max-w-2xl mx-auto space-y-6 px-6 bg-white  max-h-min  py-10"}>
      {(title || description) && (
        <div className={`space-y-2 ${formClassName?.includes('grid') ? 'col-span-full' : ''}`}>
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}

      {fields.filter(field => !('hide' in field) || !(field as any).hide).map((field, index) => renderField(field, index))}
    </form>
  )
}
