import { useCallback, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersTable } from "@/components/UsersTable"
import { RolesTable } from "@/components/RolesTable"
import { useDebounced } from "@/hooks/useDebounced"
import type { User, Role, PagedData } from "@/types"

const API_URL = "http://localhost:3002"

function App() {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounced(query, 300)

  const [users, setUsers] = useState<PagedData<User>>({ data: [], next: null, prev: null, pages: 0 })
  const [rolesMap, setRolesMap] = useState<Record<string, Role>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Roles tab state
  const [rolesPage, setRolesPage] = useState(1)
  const [rolesQuery, setRolesQuery] = useState("")
  const debouncedRolesQuery = useDebounced(rolesQuery, 300)
  const [roles, setRoles] = useState<PagedData<Role>>({ data: [], next: null, prev: null, pages: 0 })
  const [rolesLoading, setRolesLoading] = useState(false)
  const [rolesError, setRolesError] = useState<string | null>(null)
  const [rolesRefreshTrigger, setRolesRefreshTrigger] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function fetchUsers() {
      setLoading(true)
      setError(null)
      try {
        const url = new URL(`${API_URL}/users`)
        if (debouncedQuery) url.searchParams.set("search", debouncedQuery)
        url.searchParams.set("page", String(page))
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Users ${res.status}`)
        const json: PagedData<User> = await res.json()
        if (!cancelled) setUsers(json)
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Error")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchUsers()
    return () => {
      cancelled = true
    }
  }, [page, debouncedQuery])

  useEffect(() => {
    let cancelled = false
    async function fetchRoles() {
      setRolesLoading(true)
      setRolesError(null)
      try {
        const url = new URL(`${API_URL}/roles`)
        if (debouncedRolesQuery) url.searchParams.set("search", debouncedRolesQuery)
        url.searchParams.set("page", String(rolesPage))
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Roles ${res.status}`)
        const json: PagedData<Role> = await res.json()
        if (!cancelled) setRoles(json)
      } catch (e: any) {
        if (!cancelled) setRolesError(e.message || "Error")
      } finally {
        if (!cancelled) setRolesLoading(false)
      }
    }
    fetchRoles()
    return () => {
      cancelled = true
    }
  }, [rolesPage, debouncedRolesQuery, rolesRefreshTrigger])

  const refreshRoles = useCallback(() => {
    setRolesRefreshTrigger(prev => prev + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function fetchAllRoles() {
      try {
        const map: Record<string, Role> = {}
        let p: number | null = 1
        while (p) {
          const url = new URL(`${API_URL}/roles`)
          url.searchParams.set("page", String(p))
          const res = await fetch(url)
          if (!res.ok) throw new Error(`Roles ${res.status}`)
          const json: PagedData<Role> = await res.json()
          json.data.forEach((r) => (map[r.id] = r))
          p = json.next
        }
        if (!cancelled) setRolesMap(map)
      } catch (_) {
        // non-fatal for UI
      }
    }
    fetchAllRoles()
    return () => {
      cancelled = true
    }
  }, [])

  const deleteUser = async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
      
      // Remove user from local state
      const updatedUsers = {
        ...users,
        data: users.data.filter(user => user.id !== userId)
      }
      
      // If we deleted the last item on this page and we're not on page 1, go back one page
      if (updatedUsers.data.length === 0 && page > 1) {
        setPage(page - 1)
      } else {
        setUsers(updatedUsers)
      }
    } catch (e: any) {
      setError(e.message || "Failed to delete user")
    }
  }

  return (
    <div className="mx-auto w-[850px] py-6">
      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTable 
            users={users}
            rolesMap={rolesMap}
            loading={loading}
            error={error}
            query={query}
            page={page}
            onQueryChange={setQuery}
            onPageChange={setPage}
            onDeleteUser={deleteUser}
          />
        </TabsContent>

        <TabsContent value="roles">
          <RolesTable
            roles={roles}
            loading={rolesLoading}
            error={rolesError}
            query={rolesQuery}
            page={rolesPage}
            onQueryChange={setRolesQuery}
            onPageChange={setRolesPage}
            onRoleUpdate={refreshRoles}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App
