import { useCallback, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersTable } from "@/components/UsersTable"
import { RolesTable } from "@/components/RolesTable"
import { useUrlState } from "@/hooks/useUrlState"
import { useUsersQuery } from "@/hooks/useUsersQuery"
import { useRolesQuery } from "@/hooks/useRolesQuery"
import { useRolesMapQuery } from "@/hooks/useRolesMapQuery"

function App() {
  const {
    activeTab,
    page,
    query,
    rolesPage,
    rolesQuery,
    handleTabChange,
    handlePageChange,
    handleQueryChange,
    handleRolesPageChange,
    handleRolesQueryChange
  } = useUrlState()

  const { users, loading: usersLoading, error: usersError, deleteUser } = useUsersQuery(page, query)
  const { roles, loading: rolesLoading, error: rolesError } = useRolesQuery(rolesPage, rolesQuery)
  const rolesMap = useRolesMapQuery()

  // Handle empty page navigation for users
  useEffect(() => {
    if (!usersLoading && users.data.length === 0 && page > 1) {
      handlePageChange(page - 1)
    }
  }, [users.data.length, page, usersLoading, handlePageChange])

  const handleDeleteUser = useCallback(async (userId: string) => {
    try {
      await deleteUser(userId)
    } catch (e: unknown) {
      // Error is handled by React Query automatically
      console.error('Failed to delete user:', e)
    }
  }, [deleteUser])

  return (
    <div className="mx-auto w-[850px] py-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTable 
            users={users}
            rolesMap={rolesMap}
            loading={usersLoading}
            error={usersError}
            query={query}
            page={page}
            onQueryChange={handleQueryChange}
            onPageChange={handlePageChange}
            onDeleteUser={handleDeleteUser}
          />
        </TabsContent>

        <TabsContent value="roles">
          <RolesTable
            roles={roles}
            loading={rolesLoading}
            error={rolesError}
            query={rolesQuery}
            page={rolesPage}
            onQueryChange={handleRolesQueryChange}
            onPageChange={handleRolesPageChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App
