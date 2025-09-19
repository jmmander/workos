import type { User, Role } from "@/types"
import { formatJoined } from "@/utils/formatters"

export const usersColumns = [
  {
    key: "user",
    header: "User",
    width: "w-[301px]",
    render: (user: User) => (
      <div className="flex items-center gap-2">
        <img
          src={user.photo || ""}
          alt="avatar"
          className="size-6 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
        <span>{user.first} {user.last}</span>
      </div>
    )
  },
  {
    key: "role",
    header: "Role",
    width: "w-[277px]",
    render: (user: User, rolesMapParam?: Record<string, Role>) => rolesMapParam?.[user.roleId]?.name ?? ""
  },
  {
    key: "joined",
    header: "Joined",
    width: "w-[236px]",
    render: (user: User) => formatJoined(user.createdAt)
  }
]

export const createUsersActions = (
  handleEditUser: (user: User) => void,
  handleDeleteUser: (user: User) => void
) => [
  { label: "Edit user", handler: handleEditUser },
  { label: "Delete user", handler: handleDeleteUser }
]
