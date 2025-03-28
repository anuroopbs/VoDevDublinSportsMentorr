"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { useFirebase } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
  error: null,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { auth, googleProvider, isInitialized } = useFirebase()

  // Set persistence and listen for auth state changes
  useEffect(() => {
    if (!isInitialized || !auth) {
      return
    }

    const setupAuth = async () => {
      try {
        // Import auth functions dynamically
        const { browserLocalPersistence, setPersistence, onAuthStateChanged } = await import("firebase/auth")

        // Set persistence
        await setPersistence(auth, browserLocalPersistence)

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user)
          } else {
            setUser(null)
          }
          setLoading(false)
        })

        return unsubscribe
      } catch (error) {
        console.error("Auth setup error:", error)
        setLoading(false)
        return () => {}
      }
    }

    const unsubscribePromise = setupAuth()

    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe())
    }
  }, [auth, isInitialized])

  const signUp = async (email: string, password: string, name: string) => {
    if (!auth) {
      setError("Authentication not initialized")
      throw new Error("Authentication not initialized")
    }

    setError(null)
    try {
      // Import auth functions dynamically
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name })
      }
    } catch (error: any) {
      console.error("Sign up error:", error.code, error.message)

      // Provide more user-friendly error messages
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please try another email or sign in.")
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.")
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.")
      } else {
        setError(error.message || "An error occurred during sign up. Please try again.")
      }

      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      setError("Authentication not initialized")
      throw new Error("Authentication not initialized")
    }

    setError(null)
    try {
      // Import auth functions dynamically
      const { signInWithEmailAndPassword } = await import("firebase/auth")

      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.error("Sign in error:", error.code, error.message)

      // Provide more user-friendly error messages
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setError("Invalid email or password. Please try again.")
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.")
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later or reset your password.")
      } else {
        setError(error.message || "An error occurred during sign in. Please try again.")
      }

      throw error
    }
  }

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      setError("Google authentication not initialized")
      throw new Error("Google authentication not initialized")
    }

    setError(null)
    try {
      // Import auth functions dynamically
      const { signInWithPopup } = await import("firebase/auth")

      const result = await signInWithPopup(auth, googleProvider)
      console.log("Google sign in successful:", result.user.displayName)
      return result
    } catch (error: any) {
      console.error("Google sign in error:", error.code, error.message)

      // Provide more user-friendly error messages
      if (error.code === "auth/popup-closed-by-user") {
        setError("Sign in was cancelled. Please try again.")
      } else if (error.code === "auth/popup-blocked") {
        setError("Pop-up was blocked by your browser. Please allow pop-ups for this site.")
      } else if (error.code === "auth/cancelled-popup-request") {
        setError("Multiple pop-up requests were detected. Please try again.")
      } else if (error.code === "auth/configuration-not-found") {
        setError("Authentication configuration issue. Please contact support.")
        console.error(
          "Firebase configuration error. Check your Firebase project settings and make sure Google authentication is enabled.",
        )
      } else {
        setError(error.message || "An error occurred during Google sign in. Please try again.")
      }

      throw error
    }
  }

  const logout = async () => {
    if (!auth) {
      setError("Authentication not initialized")
      throw new Error("Authentication not initialized")
    }

    setError(null)
    try {
      // Import auth functions dynamically
      const { signOut } = await import("firebase/auth")

      await signOut(auth)
    } catch (error: any) {
      console.error("Logout error:", error.code, error.message)
      setError(error.message || "An error occurred during logout. Please try again.")
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, logout, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

