import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Role } from "@/types"

interface EditRoleFormProps {
  role: Role | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRoleUpdate?: () => void
}

export function EditRoleForm({ role, open, onOpenChange, onRoleUpdate }: EditRoleFormProps) {
  const [editingName, setEditingName] = useState<string>("")
  const [editingDescription, setEditingDescription] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  // Update form state when role changes
  useEffect(() => {
    if (role) {
      setEditingName(role.name)
      setEditingDescription(role.description)
    }
  }, [role])

  const handleSaveRole = useCallback(async () => {
    if (!role || !editingName.trim() || isSaving) {
      return
    }
    
    setIsSaving(true)
    try {
      const response = await fetch(`http://localhost:3002/roles/${role.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingName.trim(),
          description: editingDescription.trim(),
          isDefault: role.isDefault // Keep existing isDefault value
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Update failed: ${response.status}`)
      }

      // Success - close modal and refresh data
      onOpenChange(false)
      
      // Trigger data refresh if callback provided
      if (onRoleUpdate) {
        onRoleUpdate()
      }
    } catch (error: any) {
      console.error("Failed to update role:", error)
      // TODO: Show error toast/message to user
      alert(error.message || "Failed to update role")
    } finally {
      setIsSaving(false)
    }
  }, [role, editingName, editingDescription, isSaving, onRoleUpdate, onOpenChange])

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
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSaveRole} loading={isSaving} disabled={!editingName.trim()}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
