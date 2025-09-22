"use client"

import { useState } from "react"
import { UserTable } from "@/components/users/user-table"
import { UserForm } from "@/components/users/user-form"
import { DeleteUserDialog } from "@/components/users/delete-user-dialog"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { CreateUserForm, User } from "@/lib/types"
import type { ApiUser, CreateApiUser, UpdateApiUser } from "@/lib/api"
import { createUser, deleteUserAccount, updateUser } from "@/lib/api"

type ViewMode = "list" | "create" | "edit"

// Mapper: API -> UI
function mapApiUserToUser(apiUser: ApiUser): User {
  return {
    // id: apiUser.idusers,
    username: apiUser.UserName,
    fullName: apiUser.Full_Name ?? "",
    role: apiUser.Role,
    email: apiUser.EmailId ?? undefined,
    isActive: apiUser.Is_Active === 1,
  }
}

// Mapper: UI -> API (for creating)
function mapUserFormToCreateApi(data: CreateUserForm): CreateApiUser {
  return {
    UserName: data.username,
    Full_Name: data.fullName,
    Role: data.role,
    EmailId: data.email,
    Password: data.password, // required
    Is_Active: 1,
  }
}

// Mapper: UI -> API (for updating)
function mapUserFormToUpdateApi(data: CreateUserForm, isActive = 1): UpdateApiUser {
  return {
    UserName: data.username,
    Full_Name: data.fullName,
    Role: data.role,
    EmailId: data.email,
    Password: data.password || undefined, // optional for update
    Is_Active: isActive,
  }
}

export default function UsersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)

  const handleEditUser = (apiUser: ApiUser) => {
  setSelectedUser(mapApiUserToUser(apiUser))
  setEditingUserId(apiUser.idusers) // store backend id
  setViewMode("edit")
}

  const handleDeleteUser = (apiUser: ApiUser) => {
  setUserToDelete(mapApiUserToUser(apiUser))
  setEditingUserId(apiUser.idusers) // store backend id
}


  const handleCreateUser = () => {
    setSelectedUser(null)
    setViewMode("create")
  }

  // const handleEditUser = (apiUser: ApiUser) => {
  //   setSelectedUser(mapApiUserToUser(apiUser))
  //   setViewMode("edit")
  // }

  // const handleDeleteUser = (apiUser: ApiUser) => {
  //   setUserToDelete(mapApiUserToUser(apiUser))
  // }

  const handleFormSubmit = async (data: CreateUserForm) => {
  setIsLoading(true)
  try {
    if (viewMode === "create") {
      await createUser(mapUserFormToCreateApi(data))
    } else if (editingUserId !== null) {
      await updateUser(
        editingUserId,
        mapUserFormToUpdateApi(data, selectedUser?.isActive ? 1 : 0)
      )
    }

    setViewMode("list")
    setSelectedUser(null)
    setEditingUserId(null)
  } catch (error) {
    console.error(error)
  } finally {
    setIsLoading(false)
  }
}


  const handleFormCancel = () => {
    setViewMode("list")
    setSelectedUser(null)
  }

  const handleConfirmDelete = async () => {
  if (editingUserId !== null) {
    await deleteUserAccount(editingUserId)
    setUserToDelete(null)
    setEditingUserId(null)
  }
}


  return (
    <ProtectedRoute requiredRoles={["Admin"]}>
      <div className="space-y-6">
        {viewMode === "list" ? (
          <>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Users</h1>
              <p className="text-muted-foreground">
                Manage system users and their access permissions
              </p>
            </div>
            <UserTable
              onCreateUser={handleCreateUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleFormCancel}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {viewMode === "create" ? "Create User" : "Edit User"}
                </h1>
                <p className="text-muted-foreground">
                  {viewMode === "create"
                    ? "Add a new user to the system"
                    : `Update ${selectedUser?.fullName}'s information`}
                </p>
              </div>
            </div>
            <UserForm
  user={selectedUser ?? undefined} // null → undefined
  onSubmit={handleFormSubmit}
  onCancel={handleFormCancel}
  isLoading={isLoading}
/>


          </>
        )}
      </div>

      <DeleteUserDialog
  user={userToDelete}
  open={!!userToDelete}
  onOpenChange={(open) => !open && setUserToDelete(null)}
  onConfirm={handleConfirmDelete}
/>

    </ProtectedRoute>
  )
}
