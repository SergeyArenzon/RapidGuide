import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { useWatch } from "react-hook-form"
import type { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { useVirtualizer } from "@tanstack/react-virtual"

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
  maxListHeight?: number
}

const ITEM_HEIGHT = 36 // Consistent estimated height

export function CheckboxDropdown({
  name,
  label,
  options,
  placeholder,
  register,
  setValue,
  control,
  disabled = false,
  className = "",
  maxBadges = 3,
  maxListHeight = 256,
}: CheckboxDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const selectedItems = (useWatch({ control, name }) as Array<string>) || []

  // --- Utility Functions ---
  const handleItemToggle = (value: string) => {
    const currentValues = [...selectedItems]
    setValue(
      name,
      currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value],
      { shouldValidate: true },
    )
  }

  React.useEffect(() => {
    register(name)
  }, [register, name])

  const getLabelForValue = (value: string) => {
    const option = options.find(opt => opt.value === value)
    return option ? option.label : value
  }

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
  
  // --- Filtering Logic ---
  const filteredOptions = React.useMemo(() => {
    const lowerSearch = searchValue.toLowerCase()
    return options.filter(option =>
      option.label.toLowerCase().includes(lowerSearch)
    )
  }, [options, searchValue])

  // --- Display Logic ---
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
      
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${label.toLowerCase()}...`}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          
          <CommandListRenderer
            // Key forces remount/reset on open/close
            key={open ? 'open' : 'closed'}
            open={open}
            filteredOptions={filteredOptions}
            selectedItems={selectedItems}
            maxListHeight={maxListHeight}
            handleItemToggle={handleItemToggle}
            name={name}
            label={label}
          />

        </Command>
      </PopoverContent>
    </Popover>
  )
}

// --- NEW COMPONENT FOR VIRTUALIZED RENDERING ---
interface CommandListRendererProps {
  open: boolean;
  filteredOptions: Array<{ value: string; label: string }>;
  selectedItems: string[];
  maxListHeight: number;
  handleItemToggle: (value: string) => void;
  name: string;
  label: string;
}

function CommandListRenderer({
  open,
  filteredOptions,
  selectedItems,
  maxListHeight,
  handleItemToggle,
  name,
  label,
}: CommandListRendererProps) {
  
  const parentRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
    enabled: open, 
  })

  // AGGRESSIVE FIX: Force measurement using scrollToIndex(0) after mounting
  React.useEffect(() => {
      if (parentRef.current && open) {
          // Use setTimeout 0ms to ensure the call runs after the Popover's initial mount/transition is settled.
          const timer = setTimeout(() => {
              virtualizer.scrollToIndex(0, { align: 'start' });
          }, 0); 
          return () => clearTimeout(timer);
      }
  }, [open, virtualizer]); 

  // --- Virtualization Data ---
  const virtualItems = virtualizer.getVirtualItems()
  // const totalSize = virtualizer.getTotalSize()
  const paddingTop = virtualItems.length > 0 ? virtualItems[0]?.start || 0 : 0
  // const paddingBottom = virtualItems.length > 0 ? totalSize - (virtualItems[virtualItems.length - 1]?.end || 0) : 0

  if (filteredOptions.length === 0) {
    return (
      <CommandList>
        <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
      </CommandList>
    )
  }

  // Render the virtualized list
  return (
    <CommandList ref={parentRef} >
      <CommandGroup 
      style={{ paddingTop }}>
            {virtualItems.map((virtualRow) => {
              const option = filteredOptions[virtualRow.index]
              
              return (
                <CommandItem
                  key={option.value}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  onSelect={() => handleItemToggle(option.value)}
                  className="flex items-center gap-2 cursor-pointer"
                >
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
              )
            })}
      </CommandGroup>
    </CommandList>
  )
}