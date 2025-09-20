import { useCallback, useState } from 'react'

// Lightweight URL state sync for tab/page/search for both Users and Roles.
// Keeps browser navigation (refresh, back/forward) predictable without a router.

export function useUrlState() {
  const urlParams = new URLSearchParams(window.location.search)

  const [activeTab, setActiveTab] = useState(urlParams.get('tab') || 'users')
  const [page, setPage] = useState(parseInt(urlParams.get('page') || '1'))
  const [query, setQuery] = useState(urlParams.get('search') || '')
  const [rolesPage, setRolesPage] = useState(
    parseInt(urlParams.get('rolesPage') || '1')
  )
  const [rolesQuery, setRolesQuery] = useState(
    urlParams.get('rolesSearch') || ''
  )

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
      // Reset both tabs' filters on tab switch
      setQuery('')
      setPage(1)
      setRolesQuery('')
      setRolesPage(1)

      if (tab === 'users') {
        // Keep only users defaults in URL; remove any roles params
        updateURL({ tab, page: 1, search: '', rolesPage: '', rolesSearch: '' })
      } else {
        // Keep only roles defaults in URL; remove users params
        updateURL({ tab, rolesPage: 1, rolesSearch: '', page: '', search: '' })
      }
    },
    [updateURL]
  )

  // Update Users page and preserve Roles filters in URL
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage)
      updateURL({
        tab: activeTab,
        page: newPage,
        search: query || '',
        rolesPage: '',
        rolesSearch: '',
      })
    },
    [activeTab, query, rolesPage, rolesQuery, updateURL]
  )

  // Update Users search and reset to page 1
  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery)
      setPage(1)
      updateURL({
        tab: activeTab,
        page: 1,
        search: newQuery || '',
        rolesPage: '',
        rolesSearch: '',
      })
    },
    [activeTab, rolesPage, rolesQuery, updateURL]
  )

  // Update Roles page and preserve Users filters in URL
  const handleRolesPageChange = useCallback(
    (newPage: number) => {
      setRolesPage(newPage)
      updateURL({
        tab: activeTab,
        rolesPage: newPage,
        rolesSearch: rolesQuery || '',
        page: '',
        search: '',
      })
    },
    [activeTab, page, query, rolesQuery, updateURL]
  )

  // Update Roles search and reset to page 1
  const handleRolesQueryChange = useCallback(
    (newQuery: string) => {
      setRolesQuery(newQuery)
      setRolesPage(1)
      updateURL({
        tab: activeTab,
        rolesPage: 1,
        rolesSearch: newQuery || '',
        page: '',
        search: '',
      })
    },
    [activeTab, page, query, updateURL]
  )

  return {
    activeTab,
    page,
    query,
    rolesPage,
    rolesQuery,
    handleTabChange,
    handlePageChange,
    handleQueryChange,
    handleRolesPageChange,
    handleRolesQueryChange,
  }
}
