import { Languages, MapPin, Tag } from 'lucide-react'
import { useGuideCard } from './useGuideCard'
import type { LanguageDto, SubCategoryDto } from '@rapid-guide-io/contracts'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface GuideCardProps {
  guideId: string
}

export function GuideCard({ guideId }: GuideCardProps) {
  const { guide, languages, subcategories, country, city } = useGuideCard(guideId)

  const initials = guide.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Map language codes to language names
  const guideLanguages = guide.languages_code
    .map((code) => languages.find((lang) => lang.code === code))
    .filter((lang): lang is LanguageDto => lang !== undefined)

  // Map subcategory IDs to subcategory names
  const guideSubcategories = guide.subcategories_id
    .map((id) => subcategories.find((sub) => sub.id === id))
    .filter((sub): sub is SubCategoryDto => sub !== undefined)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {initials || 'GU'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <CardTitle className="text-xl">{guide.name}</CardTitle>
            <CardDescription>{guide.bio || 'Meet the guide hosting this tour'}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Location */}
          {(city || country) && (
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-sm">
                  {city?.name && country?.name
                    ? `${city.name}, ${country.name}`
                    : country?.name || city?.name || ''}
                </p>
              </div>
            </div>
          )}

          {/* Languages */}
          {guideLanguages.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <Languages className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {guideLanguages.map((lang) => (
                    <span
                      key={lang.code}
                      className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
                    >
                      {lang.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subcategories */}
          {guideSubcategories.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {guideSubcategories.map((sub) => (
                    <span
                      key={sub.id}
                      className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

