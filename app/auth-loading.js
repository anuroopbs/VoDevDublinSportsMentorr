"use client"

import { useAuth } from "@/components/auth/auth-provider"

export default function AuthLoading() {
  const { loading } = useAuth()

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  )
}

