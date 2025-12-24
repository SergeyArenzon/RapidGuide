import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createTourSchema} from '@rapid-guide-io/contracts'
import type { CreateTourDto } from '@rapid-guide-io/contracts';
import type { FieldConfig } from '@/components/form/types'
import Form from '@/components/form'
import Api from '@/lib/api'
import Loading from '@/components/Loading';
import { Error } from '@/components/Error';

export const Route = createFileRoute('/_authenticated/guide/tours/new')({
  component: CreateTourComponent,
  staticData: {
    label: 'Create Tour',
    description: 'Fill in the details below to create a new tour.',
  },
})


function CreateTourComponent() {
  const navigate = useNavigate()
  const api = new Api()
  const queryClient = useQueryClient()

  // Fetch categories and subcategories using TanStack Query
  const { 
    data: categories = [], 
    isLoading: isLoadingCategories, 
    isError: isErrorCategories, 
    refetch: refetchCategories } = useQuery({
      queryKey: ['categories'],
      queryFn: () => api.tour.getCategories(),
      retry: false,
  })

  const { 
    data: subcategories = [], 
    isLoading: isLoadingSubcategories, 
    isError: isErrorSubcategories, 
    refetch: refetchSubcategories } = useQuery({
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
  const subcategoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
    subcategories: subcategories
      .filter((sub) => sub.category_id === category.id)
      .map((sub) => ({
        value: sub.id,
        label: sub.name,
      })),
  }))

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

  if (isLoading) return <Loading />

  if (isErrorCategories) return <Error
    title="Failed to load categories or subcategories"
    description="Please try again later"
    retryAction={() => refetchCategories()}
  />
  if (isErrorSubcategories) return <Error
    title="Failed to load subcategories"
    description="Please try again later"
    retryAction={() => refetchSubcategories()}
  />
  if (createTourMutation.isError) return <Error
    title="Failed to create tour"
    description="Please try again later"
    retryAction={() => createTourMutation.reset()}
  />
  
  return (
    <div className="space-y-6">
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

