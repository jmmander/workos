import './styles.css'
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersTable } from "@/components/UsersTable"
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

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
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
          />
        </TabsContent>

        <TabsContent value="roles">
          <div className="text-sm text-muted-foreground">Roles management coming soon.</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App
