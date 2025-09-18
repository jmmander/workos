export type PagedData<T> = {
  data: T[]
  next: number | null
  prev: number | null
  pages: number
}

export type User = {
  id: string
  createdAt: string
  updatedAt: string
  first: string
  last: string
  roleId: string
  photo?: string
}

export type Role = {
  id: string
  name: string
  description: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}
