import { useMemo } from 'react'
import { usersColumns, createUsersActions } from '@/config/usersTableConfig'
import { rolesColumns, createRolesActions } from '@/config/rolesTableConfig'
import type { User, Role, PagedData } from '@/types'

interface UseTabDataProps {
  activeTab: string
  users: PagedData<User>
  roles: PagedData<Role>
  usersLoading: boolean
  rolesLoading: boolean
  usersError: string | null
  rolesError: string | null
  page: number
  rolesPage: number
  query: string
  rolesQuery: string
  handlePageChange: (page: number) => void
  handleRolesPageChange: (page: number) => void
  handleQueryChange: (query: string) => void
  handleRolesQueryChange: (query: string) => void
  handleEditUser: (user: User) => void
  handleDeleteUser: (user: User) => void
  handleEditRole: (role: Role) => void
  handleDeleteRole: (role: Role) => void
}

// View-model that maps raw queries/mutations into per-tab UI state & handlers.
export function useTabData({
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
}: UseTabDataProps) {
  const usersActions = useMemo(
    () => createUsersActions(handleEditUser, handleDeleteUser),
    [handleEditUser, handleDeleteUser]
  )
  const rolesActions = useMemo(
    () => createRolesActions(handleEditRole, handleDeleteRole),
    [handleEditRole, handleDeleteRole]
  )

  const isUsers = activeTab === 'users'
  return useMemo(
    () => ({
      currentData: isUsers ? users : roles,
      currentLoading: isUsers ? usersLoading : rolesLoading,
      currentError: isUsers ? usersError : rolesError,
      currentPage: isUsers ? page : rolesPage,
      currentQuery: isUsers ? query : rolesQuery,
      currentColumns: isUsers ? usersColumns : rolesColumns,
      currentActions: isUsers ? usersActions : rolesActions,
      currentHandlePageChange: isUsers
        ? handlePageChange
        : handleRolesPageChange,
      currentHandleQueryChange: isUsers
        ? handleQueryChange
        : handleRolesQueryChange,
      currentPlaceholder: isUsers ? 'Search by name...' : 'Search roles...',
      currentButtonText: isUsers ? 'Add user' : 'Add role',
      currentEmptyMessage: isUsers ? 'No users found' : 'No roles found',
      currentLoadingMessage: isUsers ? 'Loading users...' : 'Loading roles...',
      currentErrorMessage: isUsers
        ? 'Unable to load users. Please try again.'
        : 'Unable to load roles. Please try again.',
    }),
    [
      isUsers,
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
      usersActions,
      rolesActions,
      handlePageChange,
      handleRolesPageChange,
      handleQueryChange,
      handleRolesQueryChange,
    ]
  )
}
