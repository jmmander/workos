import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRoleMutations } from "@/hooks/useRoleMutations"
import type { Role } from "@/types"

interface EditRoleFormProps {
  role: Role | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditRoleForm({ role, open, onOpenChange }: EditRoleFormProps) {
  const [editingName, setEditingName] = useState<string>("")
  const [editingDescription, setEditingDescription] = useState<string>("")
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
          isDefault: role.isDefault // Keep existing isDefault value
        }
      })

      // Success - close modal
      onOpenChange(false)
    } catch (error: any) {
      console.error("Failed to update role:", error)
      // Error is already handled by React Query and available in updateError
    }
  }, [role, editingName, editingDescription, isUpdating, updateRole, onOpenChange])

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
            <label htmlFor="role-name" className="block text-xs font-medium mb-1">
              Name
            </label>
            <Input
              id="role-name"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              placeholder="Enter role name"
              className="focus:ring-0 focus:ring-offset-0 focus:outline-none"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="role-description" className="block text-xs font-medium mb-1">
              Description
            </label>
            <textarea
              id="role-description"
              value={editingDescription}
              onChange={(e) => setEditingDescription(e.target.value)}
              placeholder="Enter role description"
              className="w-full min-h-[100px] px-3 py-2 border border-gray-a3 rounded-lg text-sm resize-none focus:ring-0 focus:ring-offset-0 focus:outline-none"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
            Cancel
          </Button>
          <Button onClick={handleSaveRole} loading={isUpdating} disabled={!editingName.trim()}>
            {isUpdating ? "Saving..." : "Save changes"}
          </Button>
          {updateError && (
            <div className="text-sm text-destructive mt-2">{updateError}</div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
