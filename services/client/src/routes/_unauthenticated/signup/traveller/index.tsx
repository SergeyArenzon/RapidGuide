import { Suspense, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { createTravellerSchema } from '@rapid-guide-io/contracts';
import { TravellerSignupSkeleton } from './-skeleton';
import { useCreateTravellerMutation, useTravellerFormData } from './-hooks';
import type z from 'zod';
import type { CreateTravellerDto } from '@rapid-guide-io/contracts';
import { Error } from '@/components/Error';
import Form from '@/components/form';

export const Route = createFileRoute('/_unauthenticated/signup/traveller/')({
  component: () => (
    <Suspense fallback={<TravellerSignupSkeleton />}>
      <TravellerSignupContent />
    </Suspense>
  ),
  staticData: {
    label: 'Create Traveller Profile',
    showBreadcrumb: false,
  },
})


function TravellerSignupContent() {
  const [formState, setFormState] = useState<CreateTravellerDto>({
    bio: '',
    subcategories_id: [],
    languages_code: [],
    country_code: '',
    city_id: 0
  });

  const {
    languages,
    countries,
    cities,
    categories,
    subCategories,
  } = useTravellerFormData()

  const createTravellerMutation = useCreateTravellerMutation()

  const handleFormChange = (currentState: Partial<z.infer<typeof createTravellerSchema>>) => {
    setFormState((prev: CreateTravellerDto) => ({ ...prev, ...currentState }));
  };

  const handleSubmit = (data: z.infer<typeof createTravellerSchema>) => {
    createTravellerMutation.mutate(data)
  }

  if (createTravellerMutation.isError) {
    return (
      <Error
        title="Failed to create traveller profile"
        description="Please try again later"
        retryAction={() => createTravellerMutation.reset()}
      />
    )
  }

  return (
    <Form
      title="Traveller Profile Information"
      description="Complete your traveller profile information below"
      schema={createTravellerSchema}
      fields={[
        {
          type: "textarea",
          name: "bio",
          label: "Bio",
          placeholder: "Tell us about yourself...",
          helperText: "Write a short bio to introduce yourself to others.",
        },
        {
          type: "checkbox",
          name: "subcategories_id",
          label: "Categories",
          options: categories.map((cat) => ({ 
            value: cat.id, 
            label: cat.name,
            subcategories: subCategories.filter(subcat => subcat.category_id === cat.id).map(subcat => ({
              value: subcat.id,
              label: subcat.name
            }))
          })),
          placeholder: "Select your favorite categories",
          helperText: "Select the categories that interest you.",
        },
        {
          type: "checkbox",
          name: "languages_code",
          label: "Languages",
          options: languages.map((lang) => ({ value: lang.code, label: lang.name })),
          placeholder: "Select languages",
          helperText: "Select the languages you speak.",
        },
        {
          type: "select",
          name: "country_code",
          label: "Country",
          options: countries.map(country => ({ value: country.code, label: country.name })),
          placeholder: "Select country",
          helperText: "Select the country you live in.",
        },
        {
          type: "select",
          name: "city_id",
          label: "City",
          options: cities.filter(city => city.country_code === formState.country_code).map(city => ({ value: Number(city.id), label: city.name })),
          placeholder: "Select city",
          hide: !formState.country_code,
          helperText: "Select the city you live in.",
        },
        {
          type: 'submit',
          label: 'Save Profile',
        },
      ]}
      onSubmit={handleSubmit}
      onChange={handleFormChange} 
      isLoading={createTravellerMutation.isPending}
    />
  )
}
  
