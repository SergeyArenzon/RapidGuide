/**
 * Extracts a name from loader data generically.
 * Checks for common patterns like { tour: { name } }, { booking: { name } }, or direct { name }
 * 
 * This allows routes to dynamically set labels based on loaded entity data.
 * Works for any entity type (tour, booking, etc.) as long as it has a name property.
 * 
 * @param loaderData - The loader data from a route match
 * @returns The name string if found, undefined otherwise
 */
export function extractNameFromLoaderData(loaderData: unknown): string | undefined {
  if (!loaderData || typeof loaderData !== 'object') {
    return undefined
  }

  const data = loaderData as Record<string, unknown>

  // Check for direct name property
  if ('name' in data && typeof data.name === 'string') {
    return data.name
  }

  // Check for common entity patterns (tour, booking, etc.)
  for (const key in data) {
    const value = data[key]
    if (value && typeof value === 'object' && 'name' in value) {
      const name = (value as { name?: unknown }).name
      if (typeof name === 'string') {
        return name
      }
    }
  }

  return undefined
}




