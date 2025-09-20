import { useCallback, useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTable } from '@/components/DataTable'
import { SearchBar } from '@/components/SearchBar'
import { PlusIcon } from '@/components/PlusIcon'
import { Button } from '@/components/ui/button'
import { EditRoleForm } from '@/components/EditRoleForm'
import { DeleteUserDialog } from '@/components/DeleteUserDialog'
import { useUrlState } from '@/hooks/useUrlState'
import { useUsersQuery } from '@/hooks/useUsersQuery'
import { useRolesQuery } from '@/hooks/useRolesQuery'
import { useRolesMapQuery } from '@/hooks/useRolesMapQuery'
import { useTabData } from '@/hooks/useTabData'
import { useUserMutations } from '@/hooks/useUserMutations'
import type { User, Role } from '@/types'

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
    handleRolesQueryChange,
  } = useUrlState()

  const { users, loading: usersLoading, error: usersError } = useUsersQuery(
    page,
    query
  )
  const {
    roles,
    loading: rolesLoading,
    error: rolesError,
  } = useRolesQuery(rolesPage, rolesQuery)
  const rolesMap = useRolesMapQuery()
  const { deleteUser, isDeleting, deleteError, resetDeleteError } =
    useUserMutations()

  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  // Handle empty page navigation for users
  useEffect(() => {
    if (!usersLoading && users.data.length === 0 && page > 1) {
      handlePageChange(page - 1)
    }
  }, [users.data.length, page, usersLoading, handlePageChange])

  // Modal handlers
  const handleEditUser = useCallback((user: User) => {
    console.log('Edit user:', user)
    // TODO: Implement user editing
  }, [])

  const handleDeleteUser = useCallback((user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }, [])

  const handleEditRole = useCallback((role: Role) => {
    setRoleToEdit(role)
    setEditModalOpen(true)
  }, [])

  const handleDeleteRole = useCallback((role: Role) => {
    console.log('Delete role:', role)
    // TODO: Implement role deletion
  }, [])

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false)
    setRoleToEdit(null)
  }, [])

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }, [])

  const handleConfirmDeleteUser = useCallback(
    async (userId: string) => {
      // Let the dialog own error display and closing on success.
      await deleteUser(userId)
      handleCloseDeleteDialog()
    },
    [deleteUser, handleCloseDeleteDialog]
  )

  // Get current tab data using custom hook
  const {
    currentData,
    currentLoading,
    currentError,
    currentPage,
    currentQuery,
    currentColumns,
    currentActions,
    currentHandlePageChange,
    currentHandleQueryChange,
    currentPlaceholder,
    currentButtonText,
    currentEmptyMessage,
    currentLoadingMessage,
    currentErrorMessage,
  } = useTabData({
    activeTab,
    users,
    roles,
    usersLoading,
    rolesLoading,
    usersError,
    rolesError,
    page,
    rolesPage,
    query,
    rolesQuery,
    handlePageChange,
    handleRolesPageChange,
    handleQueryChange,
    handleRolesQueryChange,
    handleEditUser,
    handleDeleteUser,
    handleEditRole,
    handleDeleteRole,
  })

  return (
    <div className="mx-auto w-[898px] p-6 box-border">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        {/* Persistent UI elements */}
        <div className="mb-6 flex items-center justify-between gap-2">
          <SearchBar
            query={currentQuery}
            placeholder={currentPlaceholder}
            loading={currentLoading}
            onQueryChange={currentHandleQueryChange}
            onPageChange={currentHandlePageChange}
          />
          <Button
            size="default"
            className="w-[110px] h-8"
            disabled={currentLoading}
          >
            <PlusIcon /> {currentButtonText}
          </Button>
        </div>

        {/* Single DataTable that updates based on active tab */}
        <DataTable
          data={currentData}
          columns={currentColumns}
          actions={currentActions}
          loading={currentLoading}
          error={currentError}
          page={currentPage}
          onPageChange={currentHandlePageChange}
          rolesMap={rolesMap}
          emptyMessage={currentEmptyMessage}
          loadingMessage={currentLoadingMessage}
          errorMessage={currentErrorMessage}
        />

        <EditRoleForm
          role={roleToEdit}
          open={editModalOpen}
          onOpenChange={handleCloseEditModal}
        />

        <DeleteUserDialog
          user={userToDelete}
          open={deleteDialogOpen}
          onOpenChange={handleCloseDeleteDialog}
          onDeleteUser={handleConfirmDeleteUser}
          isDeleting={isDeleting}
          error={deleteError}
          onResetError={resetDeleteError}
        />
      </Tabs>
    </div>
  )
}

export default App
