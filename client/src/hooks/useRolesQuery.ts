import { useQuery } from '@tanstack/react-query'
import { useDebounced } from '@/hooks/useDebounced'
import { API_URL } from '@/utils/constants'
import type { Role, PagedData } from '@/types'

async function fetchRoles(page: number, query: string): Promise<PagedData<Role>> {
  const url = new URL(`${API_URL}/roles`)
  if (query) url.searchParams.set("search", query)
  url.searchParams.set("page", String(page))
  
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Roles ${res.status}`)
  return res.json()
}

export function useRolesQuery(page: number, query: string) {
  const debouncedQuery = useDebounced(query, 300)

  const rolesQuery = useQuery({
    queryKey: ['roles', 'paginated', page, debouncedQuery],
    queryFn: () => fetchRoles(page, debouncedQuery),
  })

  return {
    roles: rolesQuery.data || { data: [], next: null, prev: null, pages: 0 },
    loading: rolesQuery.isLoading,
    error: rolesQuery.error?.message || null,
  }
}
