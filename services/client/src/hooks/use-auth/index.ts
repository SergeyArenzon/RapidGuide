import { useEffect } from 'react'
import { refreshSession } from './helpers'
import { useSessionStore } from '@/store/useSession'

export const useAuth = (): { isLoading: boolean } => {
  const { setLoading, isLoading } = useSessionStore((state) => state)

  useEffect(() => {
    const fetchAuthInit = async () => {
      setLoading(true)
      try {
        await refreshSession()
      } catch (error) {
        console.error('Failed to fetch session', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAuthInit()
  }, [setLoading])
  
  return { isLoading }
}


