import { useCallback, useState } from "react"

export function useUrlState() {
  const urlParams = new URLSearchParams(window.location.search)
  
  const [activeTab, setActiveTab] = useState(urlParams.get('tab') || 'users')
  const [page, setPage] = useState(parseInt(urlParams.get('page') || '1'))
  const [query, setQuery] = useState(urlParams.get('search') || '')
  const [rolesPage, setRolesPage] = useState(parseInt(urlParams.get('rolesPage') || '1'))
  const [rolesQuery, setRolesQuery] = useState(urlParams.get('rolesSearch') || '')

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

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab)
    updateURL({ tab })
  }, [updateURL])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
    updateURL({ 
      tab: activeTab,
      page: newPage,
      search: query || '',
      rolesPage,
      rolesSearch: rolesQuery || ''
    })
  }, [activeTab, query, rolesPage, rolesQuery, updateURL])

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery)
    setPage(1)
    updateURL({ 
      tab: activeTab,
      page: 1,
      search: newQuery || '',
      rolesPage,
      rolesSearch: rolesQuery || ''
    })
  }, [activeTab, rolesPage, rolesQuery, updateURL])

  const handleRolesPageChange = useCallback((newPage: number) => {
    setRolesPage(newPage)
    updateURL({ 
      tab: activeTab,
      page,
      search: query || '',
      rolesPage: newPage,
      rolesSearch: rolesQuery || ''
    })
  }, [activeTab, page, query, rolesQuery, updateURL])

  const handleRolesQueryChange = useCallback((newQuery: string) => {
    setRolesQuery(newQuery)
    setRolesPage(1)
    updateURL({ 
      tab: activeTab,
      page,
      search: query || '',
      rolesPage: 1,
      rolesSearch: newQuery || ''
    })
  }, [activeTab, page, query, updateURL])

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
    handleRolesQueryChange
  }
}
