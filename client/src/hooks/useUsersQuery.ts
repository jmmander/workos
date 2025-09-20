import { useQuery } from '@tanstack/react-query'
import { useDebounced } from '@/hooks/useDebounced'
import { API_URL } from '@/utils/constants'
import type { User, PagedData } from '@/types'

//Direct API calls used in React query hooks
async function fetchUsers(
  page: number,
  query: string
): Promise<PagedData<User>> {
  const url = new URL(`${API_URL}/users`)
  if (query) url.searchParams.set('search', query)
  url.searchParams.set('page', String(page))

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Users ${res.status}`)
  return res.json()
}

// React query hooks
export function useUsersQuery(page: number, query: string) {
  const debouncedQuery = useDebounced(query, 300)

  const usersQuery = useQuery({
    queryKey: ['users', 'paginated', page, debouncedQuery],
    queryFn: () => fetchUsers(page, debouncedQuery),
  })

  return {
    users: usersQuery.data || { data: [], next: null, prev: null, pages: 0 },
    loading: usersQuery.isLoading,
    error: usersQuery.error?.message || null,
  }
}
