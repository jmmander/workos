import type { Role } from "@/types"

export const rolesColumns = [
  {
    key: "name",
    header: "Name",
    width: "w-[240px]",
    render: (role: Role) => (
      <div className="flex items-center gap-2">
        {role.name}
        {role.isDefault && (
          <span className="inline-flex items-center rounded-full bg--foreground px-1.5 py-0 text-[10px] font-medium text-primary ring-1 ring-inset ring-primary">
            Default
          </span>
        )}
      </div>
    )
  },
  {
    key: "description",
    header: "Description",
    width: "w-[350px]",
    render: (role: Role) => (
      <div className="text-sm leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis" title={role.description}>
        {role.description}
      </div>
    )
  },
  {
    key: "created",
    header: "Created",
    width: "w-[200px]",
    render: (role: Role) => new Date(role.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }
]

export const createRolesActions = (
  handleEditRole: (role: Role) => void,
  handleDeleteRole: (role: Role) => void
) => [
  { label: "Edit role", handler: handleEditRole },
  { label: "Delete role", handler: handleDeleteRole }
]
