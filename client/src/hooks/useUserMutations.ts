import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL } from '@/utils/constants'

// User mutations (delete, future create/update) centralize invalidation.
async function deleteUserApi(userId: string): Promise<void> {
  const res = await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
}

export function useUserMutations() {
  const queryClient = useQueryClient()

  const deleteUserMutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return {
    deleteUser: deleteUserMutation.mutateAsync,
    isDeleting: deleteUserMutation.isPending,
    deleteError: deleteUserMutation.error?.message || null,
    resetDeleteError: deleteUserMutation.reset,
  }
}


