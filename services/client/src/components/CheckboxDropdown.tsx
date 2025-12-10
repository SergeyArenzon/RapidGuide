import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { useWatch } from "react-hook-form"
import { useVirtualizer } from "@tanstack/react-virtual"
import type { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

// --- Type Definitions ---

export type FlatOption = {
  value: string
  label: string
}

export type CategoryOption = {
  value: string
  label: string
  subcategories?: Array<{ value: string; label: string }>
}

export type CheckboxDropdownProps = {
  name: string
  label: string
  options: Array<FlatOption | CategoryOption>
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

// Ensure this height matches the visual height of a CommandItem, including padding/margin
const ITEM_HEIGHT = 36

type FlatItem = {
  type: "category-header" | "subcategory"
  category: CategoryOption | { value: string; label: string }
  subcategory?: { value: string; label: string }
} 

// --- Component ---

export function CheckboxDropdown({
  name,
  label,
  options = [],
  placeholder,
  register,
  setValue,
  control,
  disabled = false,
  className = "",
  maxBadges = 3
}: CheckboxDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const selectedItems = useWatch({ control, name }) as Array<string>
  const parentRef = React.useRef<HTMLDivElement>(null)

  // Check if options are categorized (have subcategories) or flat
  const isCategorized = Array.isArray(options) && options.length > 0 &&
    options.some((opt) => 'subcategories' in opt && Array.isArray((opt as any).subcategories) && (opt as any).subcategories.length > 0)

  // Flatten all items: category headers + subcategories (if categorized) or just items (if flat)
  // React Compiler automatically memoizes this based on dependencies (options, isCategorized)
  function computeFlatItems(): Array<FlatItem> {
    if (options.length === 0) {
      return []
    }

    if (!isCategorized) {
      // Flat mode: just return the options as subcategories
      return (options as Array<FlatOption>).map((option) => ({
        type: "subcategory" as const,
        category: { value: "", label: "" },
        subcategory: option,
      })) as Array<FlatItem>
    }

    // Categorized mode: category headers + subcategories
    const items = [] as Array<FlatItem>
    
    (options as Array<CategoryOption>).forEach((category: CategoryOption) => {
      // Only add category header if it has subcategories
      if (category.subcategories && category.subcategories.length > 0) {
        items.push({
          type: "category-header",
          category,
        })
        
        // Add all subcategories
        category.subcategories.forEach((subcategory: { value: string; label: string }) => {
          items.push({
            type: "subcategory",
            category,
            subcategory,
          })
        })
      }
    })
    
    return items
  }
  
  const flatItems = computeFlatItems()

  // Filter flatItems based on search
  // React Compiler automatically memoizes this based on dependencies (flatItems, searchValue, options, isCategorized)
  function computeFilteredFlatItems(): Array<FlatItem> {
    if (!searchValue.trim()) return flatItems
    
    const lowerSearch = searchValue.toLowerCase()
    
    if (!isCategorized) {
      // Flat mode: simple filter
      return flatItems.filter((item: FlatItem) => 
        item.subcategory?.label.toLowerCase().includes(lowerSearch)
      )
    }

    // Categorized mode: filter by category and subcategory
    const filtered = [] as Array<FlatItem>
    
    (options as Array<CategoryOption>).forEach((category: CategoryOption) => {
      const matchesCategory = category.label.toLowerCase().includes(lowerSearch)
      const matchingSubcategories = category.subcategories?.filter((sub: { value: string; label: string }) =>
        sub.label.toLowerCase().includes(lowerSearch)
      ) || []
      
      // If category matches or has matching subcategories, include it
      if (matchesCategory || matchingSubcategories.length > 0) {
        // Add category header
        filtered.push({
          type: "category-header",
          category,
        })
        
        // Add subcategories: all if category matches, otherwise only matching ones
        const subcategoriesToAdd = matchesCategory ? category.subcategories! : matchingSubcategories
        subcategoriesToAdd.forEach((subcategory: { value: string; label: string }) => {
          filtered.push({
            type: "subcategory",
            category,
            subcategory,
          })
        })
      }
    })
    
    return filtered
  }
  
  const filteredFlatItems = computeFilteredFlatItems()

  // --- Utility Functions ---
  const getCategorySubcategories = (categoryValue: string) => {
    if (!isCategorized) return []
    const category = (options as Array<CategoryOption>).find((cat) => cat.value === categoryValue)
    return category?.subcategories?.map((sub) => sub.value) || []
  }

  const isCategoryFullySelected = (categoryValue: string) => {
    if (!isCategorized) return false
    const subcategories = getCategorySubcategories(categoryValue)
    return subcategories.length > 0 && subcategories.every((sub) => selectedItems.includes(sub))
  }

  const handleCategoryToggle = (categoryValue: string) => {
    if (!isCategorized) return
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
    if (isCategorized) {
      for (const category of options as Array<CategoryOption>) {
        const subcategory = category.subcategories?.find((sub) => sub.value === value)
        if (subcategory) return subcategory.label
      }
    } else {
      const option = (options as Array<FlatOption>).find(opt => opt.value === value)
      if (option) return option.label
    }
    return value
  }

  const removeItem = (value: string, type: "category" | "item", e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    if (type === "category" && isCategorized) {
      handleCategoryToggle(value)
    } else {
      const currentValues = [...selectedItems]
      setValue(
        name,
        currentValues.filter((item) => item !== value),
        { shouldValidate: true },
      )
    }
  }

  // Get badges to display (categories when fully selected, individual items otherwise)
  const getBadgesToDisplay = () => {
    if (!isCategorized) {
      return selectedItems.map((value) => ({
        value,
        label: getLabelForValue(value),
        type: "item" as const,
      }))
    }

    const badges: Array<{ value: string; label: string; type: "category" | "item" }> = []
    const processedItems = [] as Array<string>

    // First, check for fully selected categories
    (options as Array<CategoryOption>).forEach((category: CategoryOption) => {
      if (isCategoryFullySelected(category.value)) {
        badges.push({ value: category.value, label: category.label, type: "category" })
        // Mark all subcategories as processed
        category.subcategories?.forEach((sub: { value: string; label: string }) => {
          if (!processedItems.includes(sub.value)) {
            processedItems.push(sub.value)
          }
        })
      }
    })

    // Then add individual items that aren't part of fully selected categories
    selectedItems.forEach((item) => {
      if (!processedItems.includes(item)) {
        badges.push({ value: item, label: getLabelForValue(item), type: "item" })
      }
    })

    return badges
  }

  // --- TanStack Virtualizer Logic ---
  const CATEGORY_HEADER_HEIGHT = 28

  const virtualizer = useVirtualizer({
    count: filteredFlatItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = filteredFlatItems[index]
      return item.type === "category-header" ? CATEGORY_HEADER_HEIGHT : ITEM_HEIGHT
    },
    overscan: 5,
    enabled: open,
  })

  // FIX: Use setTimeout to ensure the CommandList height is stable before measuring
  React.useLayoutEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        virtualizer.measure()
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [open, virtualizer])

  const virtualItems = open ? virtualizer.getVirtualItems() : []
  const totalSize = open ? virtualizer.getTotalSize() : 0
  
  // --- Display Logic ---
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
          className={`w-full justify-start h-auto min-h-10 ${selectedItems.length > 0 ? "pl-3 pr-3" : ""} ${className}`}
          disabled={disabled}>
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
            <span className="text-muted-foreground">{placeholder || `Select ${label.toLowerCase()}`}</span>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${label.toLowerCase()}...`}
            value={searchValue}
            onValueChange={setSearchValue}
          />

          {/* CommandList is the scrollable container, holding the ref and scroll styles */}
          <CommandList
            className="relative"
            ref={parentRef}
            style={{ height: totalSize }}>
            {/* Display empty state if filtering yields no results */}
            {filteredFlatItems.length === 0 && <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>}
            
            {/* Conditional rendering for virtualized content, only when open */}
            {open && filteredFlatItems.length > 0 && (
              <>
                {virtualItems.map((virtualRow) => {
                  const item = filteredFlatItems[virtualRow.index]
                  
                  if (item.type === "category-header") {
                    // Use CommandGroup with heading for category headers
                    return (
                      <CommandGroup
                        key={`group-${item.category.value}`}
                        heading={item.category.label}
                        data-index={virtualRow.index}
                        ref={virtualizer.measureElement}
                        className="w-full absolute"
                        style={{ 
                          transform: `translateY(${virtualRow.start}px)`,
                          height: `${CATEGORY_HEADER_HEIGHT}px`
                        }}
                      />
                    )
                  }
                  
                  if (item.subcategory) {
                    return (
                      <CommandItem
                        key={item.subcategory.value}
                        data-index={virtualRow.index}
                        ref={virtualizer.measureElement}
                        onSelect={() => handleItemToggle(item.subcategory!.value)}
                        className="flex items-center gap-2 cursor-pointer pl-6 w-full absolute"
                        style={{ transform: `translateY(${virtualRow.start}px)` }}
                      >
                        <Checkbox
                          checked={selectedItems.includes(item.subcategory.value)}
                          onCheckedChange={() => handleItemToggle(item.subcategory!.value)}
                          id={`${name}-${item.subcategory.value}`}
                          className="mr-2"
                        />
                        <Label htmlFor={`${name}-${item.subcategory.value}`} onClick={(e) => e.stopPropagation()} className="flex-grow cursor-pointer">
                          {item.subcategory.label}
                        </Label>
                        {selectedItems.includes(item.subcategory.value) && <Check className="h-4 w-4 text-primary" />}
                      </CommandItem>
                    )
                  }
                  
                  return null
                })}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}