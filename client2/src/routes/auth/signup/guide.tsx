import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import {  createGuideSchema } from '@rapid-guide-io/contracts';
import type {CreateGuideDto} from '@rapid-guide-io/contracts';
import { Error } from '@/components/Error';
import Form from '@/components/form';
import Loading from '@/components/Loading';
import Api from '@/lib/api';
import { useJwtTokenStore } from '@/store/useJwtToken';
import { AlertDialog, AlertDialogState, INITIAL_ALERT_DIALOG_STATE } from '@/components/AlertDialog';
import z from 'zod';

export const Route = createFileRoute('/auth/signup/guide')({
  component: RouteComponent,
})


function RouteComponent() {
    const { token } = useJwtTokenStore((state) => state);
    const [formState, setFormState] = useState<CreateGuideDto>({
      bio: '',
      subcategories_id: [],
      languages_code: [],
      name: '',
      country_code: '',
      city_id: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [dialogState, setDialogState] = useState<AlertDialogState>(INITIAL_ALERT_DIALOG_STATE);
    const api = new Api(token!);
  
    const handleFormChange = (currentState: Partial<z.infer<typeof createGuideSchema>>) => {
      setFormState((prev: CreateGuideDto) => ({ ...prev, ...currentState }));
    };
    
    // Queries
    const { data: languages, isLoading: isLoadingLanguages, error: errorLanguages, refetch: refetchLanguages } = useQuery({
      retry: false,  
      queryKey: ['languages'], 
      queryFn:() => api.getLanguages() });
  
    // const { data: subCategories, isLoading: isLoadingSubCategories, error: errorSubCategories, refetch: refetchSubCategories } = useQuery({
    //   retry: false,  
    //   queryKey: ['subCategories'], 
    //   queryFn:() => api.getSubCategories() });
    
    //   const { data: categories, isLoading: isLoadingCategories, error: errorCategories, refetch: refetchCategories } = useQuery({
    //   retry: false,  
    //   queryKey: ['categories'], 
    //   queryFn:() => api.getCategories() });
  
  
    // const { data: countries, isLoading: isLoadingCountries, error: errorCountries, refetch: refetchCountries } = useQuery({
    //   retry: false,  
    //   queryKey: ['countries'], 
    //   queryFn:() => api.getCountries() });
      
    // const { data: cities, isLoading: isLoadingCities, error: errorCities, refetch: refetchCities } = useQuery({
    //   retry: false,  
    //   queryKey: ['cities'], 
    //   queryFn:() => api.getCities()});
      
  
    // const handleSubmit = async (data: z.infer<typeof createGuideSchema>) => {
    //   try {
    //     setIsSubmitting(true);
    //     setSubmitError(null);
    //     await api.createGuide(data);
    //     setDialogState({
    //       open: true,
    //       title: 'Guide Profile Created',
    //       description: 'Your guide profile has been created successfully.',
    //       approveText: 'OK',
    //       onApprove: () => {
    //         router.navigate({ to: '/dashboard' });
    //       },
    //     }); 
    //   } catch (err) {
    //     const error = err as Error;
    //     setDialogState({
    //       open: true,
    //       title: 'Failed to create guide profile',
    //       description: error.message,
    //       approveText: 'Try again',
    //       variant: 'destructive',
    //       onApprove: () => {},
    //     }); 
    //     setSubmitError(error.message || 'Failed to create guide profile. Please try again.');
    //     console.error('Failed to create guide:', error);
    //   } finally {
    //     setIsSubmitting(false);
    //   }
    // }
      
    // if (isLoadingLanguages || isLoadingCategories || isLoadingCountries || isLoadingCities || isLoadingSubCategories) return <Loading/>
  
    if (errorLanguages) return <Error retryAction={() => refetchLanguages()}/>
    // if (errorCategories) return <Error retryAction={() => refetchCategories()}/>
    // if (errorCountries) return <Error retryAction={() => refetchCountries()}/>
    // if (errorCities) return <Error retryAction={() => refetchCities()}/>
    // if (errorSubCategories) return <Error retryAction={() => refetchSubCategories()}/>
    
    return (
      <>
        <AlertDialog
          open={dialogState.open}
          onOpenChange={(open) => setDialogState(prev => ({ ...prev, open }))}
          title={dialogState.title}
          description={dialogState.description}
          approveText={dialogState.approveText}
          onApprove={dialogState.onApprove}
          onCancel={dialogState.onCancel}
          cancelText={dialogState.cancelText}
          variant={dialogState.variant}
        /> 
        <Form
          title="Profile Information"
          description="Complete your profile information below"
          schema={createGuideSchema}
          fields={[
            {
              type: "text",
              name: "name",
              label: "Guide Name",
              placeholder: "Enter guide name",
              helperText: "Your full name as it appears on your ID.",
            },
            {
              type: "textarea",
              name: "bio",
              label: "Bio",
              placeholder: "Tell us about yourself...",
              helperText: "Write a short bio to introduce yourself to others.",
            },
            // {
            //   type: "categorized-checkbox",
            //   name: "subcategories_id",
            //   label: "Categories",
            //   options: categories?.map((cat) => ({ 
            //     value: cat.id, 
            //     label: cat.name,
            //     subcategories: subCategories?.filter(subcat => subcat.category_id === cat.id).map(subcat => ({
            //       value: subcat.id,
            //       label: subcat.name
            //     })) || []
            //   })) || [],
            //   placeholder: "Select categories",
            //   helperText: "Select the categories that interest you.",
            // },
            {
              type: "checkbox",
              name: "languages_code",
              label: "Languages",
              options: languages?.map((lang) => ({ value: lang.code, label: lang.name })) || [],
              placeholder: "Select languages",
              helperText: "Select the languages you speak.",
            },
            // {
            //   type: "select",
            //   name: "country_code",
            //   label: "Country",
            //   options: countries?.map(country => ({ value: country.code, label: country.name })) || [],
            //   placeholder: "Select country",
            //   helperText: "Select the country you live in.",
            // },
            // {
            //   type: "select",
            //   name: "city_id",
            //   label: "City",
            //   options: cities?.filter(city => city.country_code === formState?.country_code).map(city => ({ value: Number(city.id), label: city.name })) || [],
            //   placeholder: "Select city",
            //   disabled: !formState.country_code,
            //   helperText: "Select the city you live in.",
            //   isLoading: isLoadingCities
            // },
          ]}
        //   onSubmit={handleSubmit}
        //   onChange={handleFormChange} 
        onSubmit={()=>{}}
          onChange={()=>{}} 
          submitButtonText="Save Profile"
        //   isSubmitting={isSubmitting}
        />
      </>
    )
  }
  
  