"use client"
import Form from "@/components/form";
import { useQuery } from "@tanstack/react-query";
import Api from "@/utils/api";
import Loading from "@/components/Loading";
import { Error } from "@/components/Error";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GuideBaseSchema } from "@/schema";
import { z } from "zod";


export default function SignupGuide() {
  const router = useRouter();
  const [formState, setFormState] = useState<z.infer<typeof GuideBaseSchema>>({
    bio: '',
    categories: [],
    languages: [],
    name: '',
    country: '',
    city: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const api = new Api();

  const handleFormChange = (currentState: Partial<z.infer<typeof GuideBaseSchema>>) => {
    setFormState(prev => ({ ...prev, ...currentState }));
  };
  
  // Queries
  const { data: languages, isLoading: isLoadingLanguages, error: errorLanguages, refetch: refetchLanguages } = useQuery({
    retry: false,  
    queryKey: ['languages'], 
    queryFn:() => api.getLanguages() });

  const { data: categories, isLoading: isLoadingCategories, error: errorCategories, refetch: refetchCategories } = useQuery({
    retry: false,  
    queryKey: ['categories'], 
    queryFn:() => api.getCategories() });

  const { data: countries, isLoading: isLoadingCountries, error: errorCountries, refetch: refetchCountries } = useQuery({
    retry: false,  
    queryKey: ['countries'], 
    queryFn:() => api.getCountries() });
  
  const { data: cities, isLoading: isLoadingCities, error: errorCities, refetch: refetchCities } = useQuery({
    retry: false,  
    enabled: Boolean(formState?.country),
    queryKey: ['cities', formState?.country], 
    queryFn:() => api.getCities(formState?.country || "")});
    

  const handleSubmit = async (data: z.infer<typeof GuideBaseSchema>) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      await api.createGuide(data);
      router.push('/dashboard');
    } catch (err) {
      const error = err as Error;
      setSubmitError(error?.message || 'Failed to create guide profile. Please try again.');
      console.error('Failed to create guide:', error);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  if (isLoadingLanguages || isLoadingCategories) return <Loading/>

  if (errorLanguages) return <Error retryAction={() => refetchLanguages()}/>
  if (errorCategories) return <Error retryAction={() => refetchCategories()}/>
  if (errorCountries) return <Error retryAction={() => refetchCountries()}/>
  
  return (
        <Form
          title="Profile Information"
          description="Complete your profile information below"
          schema={GuideBaseSchema}
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
            {
              type: "categorized-checkbox",
              name: "categories",
              label: "Categories",
              options: categories?.map((cat) => ({ 
                value: cat.id, 
                label: cat.name,
                subcategories: cat.subcategories?.map(subcat => ({
                  value: subcat.id,
                  label: subcat.name
                })) || []
              })) || [],
              placeholder: "Select categories",
              helperText: "Select the categories that interest you.",
            },
            {
              type: "checkbox",
              name: "languages",
              label: "Languages",
              options: languages?.map((lang) => ({ value: lang.code, label: lang.name })) || [],
              placeholder: "Select languages",
              helperText: "Select the languages you speak.",
            },
            {
              type: "select",
              name: "country",
              label: "Country",
              options: countries?.map(country => ({ value: country.code, label: country.name })) || [],
              placeholder: "Select country",
              helperText: "Select the country you live in.",
            },
            {
              type: "select",
              name: "city",
              label: "City",
              options: cities?.map(city => ({ value: city.id.toString(), label: city.name })) || [],
              placeholder: "Select city",
              disabled: !Boolean(formState?.country),
              helperText: "Select the city you live in.",
              isLoading: isLoadingCities
            },
          ]}
          onSubmit={handleSubmit}
          onChange={handleFormChange} 
          submitButtonText="Save Profile"
          isSubmitting={isSubmitting}
        />
  )
}

