import { SearchIcon } from "./SearchIcon"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  query: string
  placeholder?: string
  loading?: boolean
  onQueryChange: (query: string) => void
  onPageChange: (page: number) => void
}

export function SearchBar({
  query,
  placeholder = "Search...",
  loading = false,
  onQueryChange,
  onPageChange
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <SearchIcon className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4" />
      <Input
        placeholder={placeholder}
        className="pl-7 pr-1"
        value={query}
        disabled={loading}
        onChange={(e) => {
          onPageChange(1)
          onQueryChange(e.target.value)
        }}
      />
    </div>
  )
}
