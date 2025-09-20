import type { User, Role } from "@/types"
import { formatJoined } from "@/utils/formatters"

export const usersColumns = [
  {
    key: "user",
    header: "User",
    width: "w-[301px]",
    render: (item: User | Role) => {
      const user = item as User
      return (
        <div className="flex items-center gap-2">
          <img
            src={user.photo}
            alt="avatar"
            className="size-6 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <span>{user.first} {user.last}</span>
        </div>
      )
    }
  },
  {
    key: "role",
    header: "Role",
    width: "w-[277px]",
    render: (item: User | Role, rolesMapParam?: Record<string, Role>) => {
      const user = item as User
      return rolesMapParam?.[user.roleId]?.name ?? ""
    }
  },
  {
    key: "joined",
    header: "Joined",
    width: "w-[236px]",
    render: (item: User | Role) => {
      const user = item as User
      return formatJoined(user.createdAt)
    }
  }
]

export const createUsersActions = (
  handleEditUser: (user: User) => void,
  handleDeleteUser: (user: User) => void
) => [
  { 
    label: "Edit user", 
    handler: (item: User | Role) => {
      handleEditUser(item as User)
    }
  },
  { 
    label: "Delete user", 
    handler: (item: User | Role) => {
      handleDeleteUser(item as User)
    }
  }
]
