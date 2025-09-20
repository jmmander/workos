import { useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { User } from '@/types'

interface DeleteUserDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleteUser: (userId: string) => Promise<void>
  isDeleting: boolean
  error: string | null
  onResetError: () => void
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onDeleteUser,
  isDeleting,
  error,
  onResetError,
}: DeleteUserDialogProps) {
  const handleDeleteConfirm = useCallback(async () => {
    if (user && !isDeleting) {
      // Let upstream mutation manage error state; swallow rejection here.
      await onDeleteUser(user.id).catch(() => {})
    }
  }, [onDeleteUser, user, isDeleting])

  const handleCancel = useCallback(() => {
    if (!isDeleting) {
      onOpenChange(false)
    }
  }, [isDeleting, onOpenChange])

  // Clear error when dialog opens or target user changes
  useEffect(() => {
    if (open) onResetError()
  }, [open, user, onResetError])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete user</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure? The user{' '}
          <span className="dialog-user-name">
            {user?.first} {user?.last}
          </span>{' '}
          will be permanently deleted.
        </DialogDescription>
        {error && (
          <div className="text-sm text-destructive-foreground mt-2 text-right">
            Error deleting user: {error}
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            loading={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete user'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
