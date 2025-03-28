"use client"

import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import Link from "next/link"
import { LogOut, User } from "lucide-react"

export function UserButton() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="relative group">
      <div className="flex items-center cursor-pointer">
        <span className="mr-1">{user.displayName || user.email}</span>
        <span className="text-xs">▼</span>
      </div>
      <div className="absolute right-0 top-full mt-2 bg-white shadow-md rounded-md hidden group-hover:block z-10 w-48 border border-gray-200">
        <div className="py-2">
          <Link href="/profile" className="flex items-center px-4 py-2 hover:bg-gray-100">
            <User className="h-4 w-4 mr-2" />
            My Profile
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  )
}

