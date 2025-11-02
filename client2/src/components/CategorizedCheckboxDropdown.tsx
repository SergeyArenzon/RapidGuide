import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { useWatch } from "react-hook-form"
import type { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export type CategoryOption = {
  value: string
  label: string
  subcategories: Array<{ value: string; label: string }>
}

export type CategorizedCheckboxDropdownProps = {
  name: string
  label?: string
  options: Array<CategoryOption>
  placeholder?: string
  register: UseFormRegister<any>
  watch: UseFormWatch<any>
  setValue: UseFormSetValue<any>
  control: Control<any>
  disabled?: boolean
  required?: boolean
  className?: string
  maxBadges?: number
}

export function CategorizedCheckboxDropdown({
  name,
  label,
  options,
  placeholder = "Select options",
  register,
  watch,
  setValue,
  control,
  disabled = false,
  required = false,
  className = "",
  maxBadges = 3,
}: CategorizedCheckboxDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const selectedItems = (useWatch({ control, name }) as Array<string>) || []

  // Get all subcategory values for a category
  const getCategorySubcategories = (categoryValue: string) => {
    const category = options.find((cat) => cat.value === categoryValue)
    return category ? category.subcategories.map((sub) => sub.value) : []
  }

  // Check if a category is fully selected (all subcategories selected)
  const isCategoryFullySelected = (categoryValue: string) => {
    const subcategories = getCategorySubcategories(categoryValue)
    return subcategories.length > 0 && subcategories.every((sub) => selectedItems.includes(sub))
  }

  // Check if a category is partially selected (some subcategories selected)
  const isCategoryPartiallySelected = (categoryValue: string) => {
    const subcategories = getCategorySubcategories(categoryValue)
    return subcategories.some((sub) => selectedItems.includes(sub)) && !isCategoryFullySelected(categoryValue)
  }

  // Handle category toggle
  const handleCategoryToggle = (categoryValue: string) => {
    const subcategories = getCategorySubcategories(categoryValue)
    const currentValues = [...selectedItems]

    if (isCategoryFullySelected(categoryValue)) {
      // Uncheck all subcategories
      const newValues = currentValues.filter((item) => !subcategories.includes(item))
      setValue(name, newValues, { shouldValidate: true })
    } else {
      // Check all subcategories
      const newValues = [...new Set([...currentValues, ...subcategories])]
      setValue(name, newValues, { shouldValidate: true })
    }
  }

  // Handle individual item toggle
  const handleItemToggle = (value: string) => {
    const currentValues = [...selectedItems]
    setValue(
      name,
      currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value],
      { shouldValidate: true },
    )
  }

  // Get label for a value
  const getLabelForValue = (value: string) => {
    for (const category of options) {
      const subcategory = category.subcategories.find((sub) => sub.value === value)
      if (subcategory) return subcategory.label
    }
    return value
  }

  // Register the field (needed for validation)
  React.useEffect(() => {
    register(name)
  }, [register, name])

  // Get badges to display (categories when fully selected, individual items otherwise)
  const getBadgesToDisplay = () => {
    const badges: Array<{ value: string; label: string; type: "category" | "item" }> = []
    const processedItems = new Set<string>()

    // First, check for fully selected categories
    options.forEach((category) => {
      if (isCategoryFullySelected(category.value)) {
        badges.push({ value: category.value, label: category.label, type: "category" })
        // Mark all subcategories as processed
        category.subcategories.forEach((sub) => processedItems.add(sub.value))
      }
    })

    // Then add individual items that aren't part of fully selected categories
    selectedItems.forEach((item) => {
      if (!processedItems.has(item)) {
        badges.push({ value: item, label: getLabelForValue(item), type: "item" })
      }
    })

    return badges
  }

  // Remove selected item or category
  const removeItem = (value: string, type: "category" | "item", e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    if (type === "category") {
      // Remove all subcategories of this category
      handleCategoryToggle(value)
    } else {
      // Remove individual item
      const currentValues = [...selectedItems]
      setValue(
        name,
        currentValues.filter((item) => item !== value),
        { shouldValidate: true },
      )
    }
  }

  const badgesToDisplay = getBadgesToDisplay()
  const displayBadges = badgesToDisplay.slice(0, maxBadges)
  const remainingCount = badgesToDisplay.length - maxBadges

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-start h-auto min-h-11 ${selectedItems.length > 0 ? "pl-3 pr-3" : ""} ${className}`}
          disabled={disabled}
        >
          {selectedItems.length > 0 ? (
            <div className="flex flex-wrap gap-1 max-w-full">
              {displayBadges.map((badge) => (
                <Badge
                  key={`${badge.type}-${badge.value}`}
                  variant={badge.type === "category" ? "default" : "secondary"}
                  className="text-xs flex items-center gap-1 max-w-[150px]"
                >
                  <span className="truncate">{badge.label}</span>
                  <span
                    role="button"
                    onClick={(e) => removeItem(badge.value, badge.type, e)}
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
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search options...`} />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>

            {options.map((category) => (
              <CommandGroup key={category.value} heading={category.label}>
                {/* Category header with checkbox */}
                <CommandItem
                  onSelect={() => handleCategoryToggle(category.value)}
                  className="flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Checkbox
                    checked={isCategoryFullySelected(category.value)}
                    ref={(el) => {
                      if (el) {
                        // @ts-ignore - indeterminate is a valid DOM property but not in the TypeScript types
                        el.indeterminate = isCategoryPartiallySelected(category.value)
                      }
                    }}
                    onCheckedChange={() => handleCategoryToggle(category.value)}
                    id={`${name}-category-${category.value}`}
                    className="mr-2"
                  />
                  <span className="flex-grow cursor-pointer font-medium">{category.label}</span>
                  {isCategoryFullySelected(category.value) && <Check className="h-4 w-4 text-primary" />}
                </CommandItem>

                <Separator className="my-1" />

                {/* Subcategories */}
                {category.subcategories.map((subcategory) => (
                  <CommandItem
                    key={subcategory.value}
                    onSelect={() => handleItemToggle(subcategory.value)}
                    className="flex items-center gap-2 cursor-pointer pl-6"
                  >
                    <Checkbox
                      checked={selectedItems.includes(subcategory.value)}
                      onCheckedChange={() => handleItemToggle(subcategory.value)}
                      id={`${name}-${subcategory.value}`}
                      className="mr-2"
                    />
                    <span className="flex-grow cursor-pointer">{subcategory.label}</span>
                    {selectedItems.includes(subcategory.value) && <Check className="h-4 w-4 text-primary" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
