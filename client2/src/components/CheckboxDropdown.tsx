import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { useWatch } from "react-hook-form"
import type { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export type CheckboxDropdownProps = {
  name: string
  label: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
  helperText?: string
  register: UseFormRegister<any>
  watch: UseFormWatch<any>
  setValue: UseFormSetValue<any>
  control: Control<any>
  disabled?: boolean
  required?: boolean
  className?: string
  maxBadges?: number
}

export function CheckboxDropdown({
  name,
  label,
  options,
  placeholder,
  register,
  watch,
  setValue,
  control,
  disabled = false,
  required = false,
  className = "",
  maxBadges = 3,
}: CheckboxDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const selectedItems = (useWatch({ control, name }) as string[]) || []

  const handleItemToggle = (value: string) => {
    const currentValues = [...selectedItems]
    setValue(
      name,
      currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value],
      { shouldValidate: true },
    )
  }

  // Register the field (needed for validation)
  React.useEffect(() => {
    register(name)
  }, [register, name])

  // Get label for a value
  const getLabelForValue = (value: string) => {
    const option = options.find(opt => opt.value === value)
    return option ? option.label : value
  }

  // Remove selected item
  const removeItem = (value: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    
    const currentValues = [...selectedItems]
    setValue(
      name,
      currentValues.filter((item) => item !== value),
      { shouldValidate: true },
    )
  }

  const displayBadges = selectedItems.slice(0, maxBadges)
  const remainingCount = selectedItems.length - maxBadges

  return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-start h-auto min-h-10 ${selectedItems.length > 0 ? "pl-3 pr-3" : ""} ${className}`}
            disabled={disabled}>
            {selectedItems.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-w-full">
                {displayBadges.map((value) => (
                  <Badge
                    key={value}
                    variant="secondary"
                    className="text-xs flex items-center gap-1 max-w-[150px]"
                  >
                    <span className="truncate">{getLabelForValue(value)}</span>
                    <span
                      role="button"
                      onClick={(e) => removeItem(value, e)}
                      className="hover:bg-muted-foreground/20 rounded-full p-0.5 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))}
                {remainingCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    +{remainingCount}
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder || `Select ${label.toLowerCase()}`}</span>
            )}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleItemToggle(option.value)}
                    className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedItems.includes(option.value)}
                      onCheckedChange={() => handleItemToggle(option.value)}
                      id={`${name}-${option.value}`}
                      className="mr-2"
                    />
                    <Label htmlFor={`${name}-${option.value}`} onClick={(e) => e.stopPropagation()} className="flex-grow cursor-pointer">
                      {option.label}
                    </Label>
                    {selectedItems.includes(option.value) && <Check className="h-4 w-4 text-primary" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
  )
}

