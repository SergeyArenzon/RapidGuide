import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Suspense } from 'react'
import { createTourSchema} from '@rapid-guide-io/contracts'
import type { CreateTourDto } from '@rapid-guide-io/contracts';
import type { FieldConfig } from '@/components/form/types'
import Form from '@/components/form'
import { Error } from '@/components/Error';
import { useTourFormData, useCreateTourMutation } from './-hooks';
import { CreateTourSkeleton } from './-skeleton';

export const Route = createFileRoute('/_authenticated/guide/tours/new/')({
  component: () => (
    <Suspense fallback={<CreateTourSkeleton />}>
      <CreateTourComponent />
    </Suspense>
  ),
  staticData: {
    label: 'Create Tour',
    description: 'Fill in the details below to create a new tour.',
  },
})

function CreateTourComponent() {
  const navigate = useNavigate()
  const { subcategoryOptions } = useTourFormData()
  const createTourMutation = useCreateTourMutation()
  const formClassName = "grid grid-cols-2 gap-6 items-center"

  const fields: Array<FieldConfig | (FieldConfig & { name: keyof CreateTourDto })> = [
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
      rows: 4
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
      className: 'col-span-2',
    },
    {
      type: 'submit',
      label: 'Create Tour',
    },
    {
      type: 'cancel',
      label: 'Cancel',
      onClick: () => navigate({ to: '/guide/tours' }),
    },
  ]

  if (createTourMutation.isError) return <Error
    title="Failed to create tour"
    description="Please try again later"
    retryAction={() => createTourMutation.reset()}
  />
  
  return (
    <div className="flex justify-center"> 
      <Form<CreateTourDto>
        fields={fields}
        schema={createTourSchema}
        onSubmit={(data) => createTourMutation.mutate(data)}
        isLoading={createTourMutation.isPending}
        formClassName={formClassName}
      />
      </div>
    
  )
}
