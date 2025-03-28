"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "./auth-provider"
import { ChromeIcon as Google } from "lucide-react"

export function LoginForm({ onSuccess, onRegisterClick }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState(null)

  const { signIn, signInWithGoogle, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setIsLoading(true)

    try {
      await signIn(email, password)
      if (onSuccess) onSuccess()
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setFormError(null)
    setIsLoading(true)

    try {
      await signInWithGoogle()
      if (onSuccess) onSuccess()
    } catch (error) {
      setFormError(error.message)
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
        </div>
        <Button type="submit" className="bg-black text-white hover:bg-gray-800 w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
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
        Sign in with Google
      </Button>

      <div className="text-center">
        <Button type="button" variant="link" onClick={onRegisterClick} className="text-gray-600">
          Don't have an account? Register
        </Button>
      </div>
    </div>
  )
}

