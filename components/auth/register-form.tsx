"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { ChromeIcon as Google } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RegisterFormProps {
  onSuccess?: () => void
  onLoginClick: () => void
}

export function RegisterForm({ onSuccess, onLoginClick }: RegisterFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const { signUp, signInWithGoogle, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (password !== confirmPassword) {
      setFormError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password, name)
      if (onSuccess) onSuccess()
    } catch (error: any) {
      // Error is handled in the auth hook, no need to set it here
      console.log("Register error handled by auth hook")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsLoading(true)

    try {
      console.log("Attempting Google sign in from register form...")
      await signInWithGoogle()
      console.log("Google sign in successful from register form, calling onSuccess")
      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error("Google sign in error:", error)
      setFormError(error?.message || "Failed to sign in with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {(formError || error) && (
        <Alert variant="destructive">
          <AlertDescription>{formError || error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-white border-gray-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white border-gray-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white border-gray-300"
          />
          <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-white border-gray-300"
          />
        </div>
        <Button type="submit" className="bg-black text-white hover:bg-gray-800 w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <span className="relative bg-white px-2 text-gray-500 text-sm">Or continue with</span>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <Google className="mr-2 h-4 w-4" />
        Sign up with Google
      </Button>

      <div className="text-center">
        <Button type="button" variant="link" onClick={onLoginClick} className="text-gray-600">
          Already have an account? Sign in
        </Button>
      </div>
    </div>
  )
}

