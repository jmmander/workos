import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDebounced } from '@/hooks/useDebounced'
import { API_URL } from '@/utils/constants'
import type { User, PagedData } from '@/types'

//Direct API calls used in React query hooks
async function fetchUsers(page: number, query: string): Promise<PagedData<User>> {
  const url = new URL(`${API_URL}/users`)
  if (query) url.searchParams.set("search", query)
  url.searchParams.set("page", String(page))
  
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Users ${res.status}`)
  return res.json()
}

async function deleteUserApi(userId: string): Promise<void> {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
}

// React query hooks
export function useUsersQuery(page: number, query: string) {
  const debouncedQuery = useDebounced(query, 300)
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: ['users', 'paginated', page, debouncedQuery],
    queryFn: () => fetchUsers(page, debouncedQuery),
  })

  const deleteUserMutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: async () => {
      // Invalidate and refetch users data, wait for it to complete
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return {
    users: usersQuery.data || { data: [], next: null, prev: null, pages: 0 },
    loading: usersQuery.isLoading,
    error: usersQuery.error?.message || deleteUserMutation.error?.message || null,
    deleteUser: deleteUserMutation.mutateAsync,
  }
}
