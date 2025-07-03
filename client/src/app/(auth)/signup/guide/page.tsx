"use client"
import Form from "@/components/form";
import { useQuery } from "@tanstack/react-query";
import Api from "@/utils/api";
import Loading from "@/components/Loading";
import { Error } from "@/components/Error";
import { useState } from "react";
import Logo from "@/components/Logo";

type GuideFormValues = {
    bio: string
    categories: string[]
    languages: string[]
    name: string
    country: string
    city: string
}

export default function SignupGuide() {
  const [formState, setFormState] = useState<GuideFormValues>({
    bio: '',
    categories: [],
    languages: [],
    name: '',
    country: '',
    city: ''
  });
  const api = new Api();

  
  const handleFormChange = (currentState: Partial<GuideFormValues>) => {
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
    

  const handleSubmit = (data: GuideFormValues) => {
    console.log("Form submitted:", data)
    // Handle form submission here
  }
  console.log({formState});
  
  
  if (isLoadingLanguages || isLoadingCategories) return <Loading/>

  if (errorLanguages) return <Error retryAction={() => refetchLanguages()}/>
  if (errorCategories) return <Error retryAction={() => refetchCategories()}/>
  
  return (
        <Form
          title="Profile Information"
          description="Complete your profile information below"
          fields={[
            {
              type: "text",
              name: "name",
              label: "Guide Name",
              placeholder: "Enter guide name",
              required: true,
              validation: {
                min: 2,
                max: 100,
              },
              helperText: "Your full name as it appears on your ID.",
            },
            {
              type: "textarea",
              name: "bio",
              label: "Bio",
              placeholder: "Tell us about yourself...",
              required: true,
              validation: {
                min: 10,
                max: 500,
              },
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
              required: true,
              validation: {
                min: 1,
              },
              helperText: "Select the categories that interest you.",
            },
            {
              type: "checkbox",
              name: "languages",
              label: "Languages",
              options: languages?.map((lang) => ({ value: lang.code, label: lang.name })) || [],
              placeholder: "Select languages",
              required: true,
              validation: {
                min: 1,
              },
              helperText: "Select the languages you speak.",
            },
            {
              type: "select",
              name: "country",
              label: "Country",
              options: countries?.map(country => ({ value: country.code, label: country.name })) || [],
              placeholder: "Select country",
              required: true,
              helperText: "Select the country you live in.",
            },
            {
              type: "select",
              name: "city",
              label: "City",
              options: cities?.map(city => ({ value: String(city.id), label: city.name })) || [],
              placeholder: "Select city",
              required: Boolean(formState?.country),
              disabled: !Boolean(formState?.country),
              validation: {
                min: formState?.country ? 1 : 0,
                max: 1,
              },
              helperText: "Select the city you live in.",
              isLoading: isLoadingCities
            },
          ]}
          onSubmit={handleSubmit}
          onChange={handleFormChange} 
          submitButtonText="Save Profile"
        />
  )
}

