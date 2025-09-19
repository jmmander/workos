import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/utils/constants'
import type { Role, PagedData } from '@/types'

async function fetchAllRoles(): Promise<Record<string, Role>> {
  const map: Record<string, Role> = {}
  let currentPage: number | null = 1
  
  // Fetch all pages of roles. The API returns next: null when we reach the last page
  while (currentPage !== null) {
    const url = new URL(`${API_URL}/roles`)
    url.searchParams.set("page", String(currentPage))
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Roles ${res.status}`)
    const json: PagedData<Role> = await res.json()
    
    // Add all roles from this page to the map
    json.data.forEach((role) => {
      map[role.id] = role
    })
    
    currentPage = json.next
  }
  
  return map
}

export function useRolesMapQuery() {
  const rolesMapQuery = useQuery({
    queryKey: ['roles', 'map'],
    queryFn: fetchAllRoles,
    staleTime: 1000 * 60 * 2, // 2 minutes - shorter since this affects user display
  })

  return rolesMapQuery.data || {}
}
