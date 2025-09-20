import { useCallback, useState } from 'react'

// Lightweight URL state sync for tab/page/search for both Users and Roles.
// Keeps browser navigation (refresh, back/forward) predictable without a router.

export function useUrlState() {
  const urlParams = new URLSearchParams(window.location.search)

  const [activeTab, setActiveTab] = useState(urlParams.get('tab') || 'users')
  const [page, setPage] = useState(parseInt(urlParams.get('page') || '1'))
  const [query, setQuery] = useState(urlParams.get('search') || '')

  // Merge provided params into the current URL's search params.
  const updateURL = useCallback((params: Record<string, string | number>) => {
    const url = new URL(window.location.href)
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, String(value))
      } else {
        url.searchParams.delete(key)
      }
    })
    window.history.replaceState({}, '', url.toString())
  }, [])

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab)
      // Reset shared filters on tab switch and keep URL minimal
      setQuery('')
      setPage(1)
      updateURL({ tab, page: 1, search: '' })
    },
    [updateURL]
  )

  // Update page for active tab (shared state)
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage)
      updateURL({
        tab: activeTab,
        page: newPage,
        search: query || '',
      })
    },
    [activeTab, query, updateURL]
  )

  // Update search for active tab (shared) and reset to page 1
  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery)
      setPage(1)
      updateURL({
        tab: activeTab,
        page: 1,
        search: newQuery || '',
      })
    },
    [activeTab, updateURL]
  )

  return {
    activeTab,
    page,
    query,
    handleTabChange,
    handlePageChange,
    handleQueryChange,
  }
}
