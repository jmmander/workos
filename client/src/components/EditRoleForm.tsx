import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRoleMutations } from '@/hooks/useRoleMutations'
import type { Role } from '@/types'

interface EditRoleFormProps {
  role: Role | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditRoleForm({ role, open, onOpenChange }: EditRoleFormProps) {
  const [editingName, setEditingName] = useState<string>('')
  const [editingDescription, setEditingDescription] = useState<string>('')
  const { updateRole, isUpdating, updateError } = useRoleMutations()

  // Update form state when role changes
  useEffect(() => {
    if (role) {
      setEditingName(role.name)
      setEditingDescription(role.description)
    }
  }, [role])

  const handleSaveRole = useCallback(async () => {
    if (!role || !editingName.trim() || isUpdating) {
      return
    }

    try {
      await updateRole({
        roleId: role.id,
        data: {
          name: editingName.trim(),
          description: editingDescription.trim(),
          isDefault: role.isDefault, // Keep existing isDefault value
        },
      })

      // Success - close modal
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update role:', error)
      // Error is already handled by React Query and available in updateError
    }
  }, [
    role,
    editingName,
    editingDescription,
    isUpdating,
    updateRole,
    onOpenChange,
  ])

  const handleCancel = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Edit role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="role-name"
              className="block text-xs font-medium mb-1"
            >
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="role-name"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              placeholder="Enter role name"
              autoFocus
            />
          </div>
          <div>
            <label
              htmlFor="role-description"
              className="block text-xs font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="role-description"
              value={editingDescription}
              onChange={(e) => setEditingDescription(e.target.value)}
              placeholder="Enter role description"
              className="placeholder:text-placeholder flex w-full min-w-0 rounded border border-gray-a5 bg-transparent px-1 py-2 text-sm leading-5 font-normal tracking-normal transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 shadow-input-inset focus:outline-none focus-ring min-h-[100px] resize-none"
              rows={4}
            />
          </div>
        </div>
        {updateError && (
          <div className="text-sm text-destructive-foreground mt-2 text-right">
            Error updating role: {updateError}
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveRole}
            loading={isUpdating}
            disabled={!editingName.trim()}
          >
            {isUpdating ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
