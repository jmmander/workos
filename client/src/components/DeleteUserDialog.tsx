import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { User } from "@/types"

interface DeleteUserDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleteUser: (userId: string) => Promise<void>
}

export function DeleteUserDialog({ user, open, onOpenChange, onDeleteUser }: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteConfirm = useCallback(async () => {
    if (user && !isDeleting) {
      setIsDeleting(true)
      try {
        await onDeleteUser(user.id)
        onOpenChange(false)
      } finally {
        setIsDeleting(false)
      }
    }
  }, [onDeleteUser, user, isDeleting, onOpenChange])

  const handleCancel = useCallback(() => {
    if (!isDeleting) {
      onOpenChange(false)
    }
  }, [isDeleting, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete user</DialogTitle>
        </DialogHeader>
        <DialogDescription>
            Are you sure? The user <span className="dialog-user-name">{user?.first} {user?.last}</span> will be permanently deleted.
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteConfirm} loading={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
