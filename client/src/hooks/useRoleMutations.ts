import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL } from '@/utils/constants'
import type { Role } from '@/types'

interface UpdateRoleData {
  name: string
  description: string
  isDefault: boolean
}

async function updateRole(roleId: string, data: UpdateRoleData): Promise<Role> {
  const response = await fetch(`${API_URL}/roles/${roleId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || `Update failed: ${response.status}`)
  }

  return response.json()
}

export function useRoleMutations() {
  const queryClient = useQueryClient()

  const updateRoleMutation = useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: UpdateRoleData }) => 
      updateRole(roleId, data),
    onSuccess: async () => {
      // Invalidate both paginated roles and the roles map, wait for completion
      await queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })

  return {
    updateRole: updateRoleMutation.mutateAsync,
    isUpdating: updateRoleMutation.isPending,
    updateError: updateRoleMutation.error?.message || null,
  }
}
