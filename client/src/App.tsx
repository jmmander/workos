import './styles.css'
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersTable } from "@/components/UsersTable"
import { useDebounced } from "@/hooks/useDebounced"
import type { User, Role, PagedData } from "@/types"

const API_URL = "http://localhost:3002"

function App() {


  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
        <div className="text-sm text-muted-foreground">Users management coming soon.</div>
        </TabsContent>

        <TabsContent value="roles">
          <div className="text-sm text-muted-foreground">Roles management coming soon.</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App
