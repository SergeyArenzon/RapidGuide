import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Suspense, useState } from 'react'
import { createTourSchema} from '@rapid-guide-io/contracts'
import { useCreateTourMutation, useTourFormData } from './-hooks';
import { CreateTourSkeleton } from './-skeleton';
import type { CreateTourDto } from '@rapid-guide-io/contracts';
import type { FieldConfig } from '@/components/form/types'
import Form from '@/components/form'
import { Error } from '@/components/Error';

export const Route = createFileRoute('/_authenticated/guide/tours/new/')({
  component: () => (
    <Suspense fallback={<CreateTourSkeleton />}>
      <CreateTourComponent />
    </Suspense>
  ),
  staticData: {
    label: 'Create Tour',
    description: 'Fill in the details below to create a new tour.',
    showBreadcrumb: true,
  },
})

function CreateTourComponent() {
  const navigate = useNavigate()
  const { subcategoryOptions, countries, cities } = useTourFormData()
  const createTourMutation = useCreateTourMutation()
  
  const [formState, setFormState] = useState<Partial<CreateTourDto>>({
    country_code: '',
    city_id: undefined,
  })
  

  const handleFormChange = (currentState: Partial<CreateTourDto>) => setFormState((prev) => ({ ...prev, ...currentState }))

  const fields: Array<FieldConfig | (FieldConfig & { name: keyof CreateTourDto })> = [
    {
      name: 'name',
      type: 'text',
      label: 'Tour Name',
      placeholder: 'Enter tour name',
      helperText: 'Clear, descriptive name',
      required: true,
    },
    {
      name: 'price',
      type: 'text',
      label: 'Price (€ per person)',
      placeholder: '0.00',
      inputType: 'number',
      helperText: 'Price per person in euros',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      placeholder: 'Enter tour description',
      helperText: 'Describe the tour highlights and experience',
      required: true,
      rows: 4,
      className: 'col-span-2'
    },
    {
      name: 'subcategory_ids',
      type: 'checkbox',
      label: 'Subcategories',
      placeholder: 'Select subcategories',
      options: subcategoryOptions,
      helperText: 'Select relevant subcategories',
      required: true,
      className: 'col-span-2',
    },
    {
      name: 'min_travellers',
      type: 'text',
      label: 'Minimum Travellers',
      placeholder: 'e.g., 1',
      inputType: 'number',
      helperText: 'Minimum required travelers',
      required: false,
    },
    {
      name: 'max_travellers',
      type: 'text',
      label: 'Maximum Travellers',
      placeholder: 'e.g., 10',
      inputType: 'number',
      helperText: 'Maximum capacity',
      required: false,
    },
    {
      name: 'duration_minutes',
      type: 'text',
      label: 'Duration (minutes)',
      placeholder: 'e.g., 120',
      inputType: 'number',
      helperText: 'Tour duration in minutes',
      required: false,
    },
    {
      name: 'country_code',
      type: 'select',
      label: 'Country',
      options: countries.map(country => ({ value: country.code, label: country.name })),
      placeholder: 'Select country',
      helperText: 'Tour country',
      required: true,
    },
    {
      name: 'city_id',
      type: 'select',
      label: 'City',
      options: cities.filter(city => city.country_code === formState.country_code).map(city => ({ value: Number(city.id), label: city.name })),
      placeholder: 'Select city',
      disabled: !formState.country_code,
      helperText: 'Tour city',
      required: true,
      className: 'col-span-2',
    },
    {
      type: 'submit',
      label: 'Create Tour',
      className: 'col-span-1',
    },
    {
      type: 'cancel',
      label: 'Cancel',
      onClick: () => navigate({ to: '/guide/tours' }),
      className: 'col-span-1',
    },
  ]

  if (createTourMutation.isError) return <Error
    title="Failed to create tour"
    description="Please try again later"
    retryAction={() => createTourMutation.reset()}
  />
  
  return (
    <div className='mt-4'> 
      <Form<CreateTourDto>
        fields={fields}
        schema={createTourSchema}
        onSubmit={(data) => createTourMutation.mutate(data)}
        onChange={handleFormChange}
        isLoading={createTourMutation.isPending}
        formClassName="grid grid-cols-2 gap-3"
      />
      </div>
    
  )
}
