import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'
import { createTourSchema} from '@rapid-guide-io/contracts'
import type { CreateTourDto } from '@rapid-guide-io/contracts';
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
  const api = React.useMemo(() => new Api(), [])
  const queryClient = useQueryClient()

  // Fetch categories and subcategories using TanStack Query
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.tour.getCategories(),
    retry: false,
  })

  const { data: subcategories = [], isLoading: isLoadingSubcategories } = useQuery({
    queryKey: ['subcategories'],
    queryFn: () => api.tour.getSubCategories(),
    retry: false,
  })

  // Mutation for creating a tour
  const createTourMutation = useMutation({
    mutationFn: (tour: CreateTourDto) => api.tour.createTour(tour),
    onSuccess: () => {
      toast.success('Tour created successfully!')
      // Invalidate tours query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['tours'] })
      navigate({ to: '/guide/tours' })
    },
    onError: (error: Error) => {
      console.error('Error creating tour:', error)
      toast.error(error.message || 'Failed to create tour')
    },
  })

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

  const fields: Array<FieldConfig & { name: keyof CreateTourDto }> = [
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

  const isLoading = isLoadingCategories || isLoadingSubcategories || createTourMutation.isPending

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to create a new tour.
        </p>
      </div>

      <Form<CreateTourDto>
        fields={fields}
        schema={createTourSchema}
        onSubmit={(data) => createTourMutation.mutate(data)}
        submitButtonText="Create Tour"
        isLoading={isLoading}
        onCancel={() => navigate({ to: '/guide/tours' })}
        cancelButtonText="Cancel"
      />
    </div>
  )
}

