import { createFileRoute, useNavigate } from '@tanstack/react-router'
import React from 'react'
import * as z from 'zod'
import { toast } from 'sonner'
import type { CategoryDto, SubCategoryDto } from '@rapid-guide-io/contracts'
import type { CreateTourDto } from '@/lib/api/tour'
import type { FieldConfig } from '@/components/form/types'
import Form from '@/components/form'
import Api from '@/lib/api'

export const Route = createFileRoute('/_authenticated/guide/tours/new')({
  component: CreateTourComponent,
  staticData: {
    label: 'Create Tour',
  },
})

function CreateTourComponent() {
  const navigate = useNavigate()
  const [categories, setCategories] = React.useState<Array<CategoryDto>>([])
  const [subcategories, setSubcategories] = React.useState<Array<SubCategoryDto>>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const api = React.useMemo(() => new Api(), [])

  // Fetch categories and subcategories on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [categoriesData, subcategoriesData] = await Promise.all([
          api.tour.getCategories().catch(() => []),
          api.tour.getSubCategories().catch(() => []),
        ])
        setCategories(categoriesData)
        setSubcategories(subcategoriesData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load categories')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [api])

  // Prepare subcategory options grouped by category
  const subcategoryOptions = React.useMemo(() => {
    return categories.map((category) => ({
      value: category.id,
      label: category.name,
      subcategories: subcategories
        .filter((sub) => sub.category_id === category.id)
        .map((sub) => ({
          value: sub.id,
          label: sub.name,
        })),
    }))
  }, [categories, subcategories])

  const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.coerce.number().positive('Price must be a positive number'),
    duration_minutes: z.coerce.number().int().positive().optional().or(z.literal('')),
    min_travellers: z.coerce.number().int().positive().optional().or(z.literal('')),
    max_travellers: z.coerce.number().int().positive().optional().or(z.literal('')),
    subcategory_ids: z.array(z.string().uuid()).min(1, 'At least one subcategory is required'),
  })

  type FormValues = z.infer<typeof schema>

  const fields: Array<FieldConfig & { name: keyof FormValues }> = [
    {
      name: 'name',
      type: 'text',
      label: 'Tour Name',
      placeholder: 'Enter tour name',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      placeholder: 'Enter tour description',
      required: true,
      rows: 4,
    },
    {
      name: 'price',
      type: 'text',
      label: 'Price (per person)',
      placeholder: '0.00',
      inputType: 'number',
      required: true,
    },
    {
      name: 'duration_minutes',
      type: 'text',
      label: 'Duration (minutes)',
      placeholder: 'e.g., 120',
      inputType: 'number',
      required: false,
    },
    {
      name: 'min_travellers',
      type: 'text',
      label: 'Minimum Travellers',
      placeholder: 'e.g., 1',
      inputType: 'number',
      required: false,
    },
    {
      name: 'max_travellers',
      type: 'text',
      label: 'Maximum Travellers',
      placeholder: 'e.g., 10',
      inputType: 'number',
      required: false,
    },
    {
      name: 'subcategory_ids',
      type: 'checkbox',
      label: 'Subcategories',
      placeholder: 'Select subcategories',
      options: subcategoryOptions,
      required: true,
    },
  ]

  const handleSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)
      const createTourDto: CreateTourDto = {
        name: data.name,
        description: data.description,
        price: data.price,
        duration_minutes: data.duration_minutes === '' ? undefined : data.duration_minutes,
        min_travellers: data.min_travellers === '' ? undefined : data.min_travellers,
        max_travellers: data.max_travellers === '' ? undefined : data.max_travellers,
        subcategory_ids: data.subcategory_ids,
      }

      await api.tour.createTour(createTourDto)
      toast.success('Tour created successfully!')
      navigate({ to: '/guide/tours' })
    } catch (error) {
      console.error('Error creating tour:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create tour')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to create a new tour.
        </p>
      </div>

      <Form<FormValues>
        fields={fields}
        schema={schema}
        onSubmit={handleSubmit}
        submitButtonText="Create Tour"
        isLoading={isLoading}
        onCancel={() => navigate({ to: '/guide/tours' })}
        cancelButtonText="Cancel"
      />
    </div>
  )
}

