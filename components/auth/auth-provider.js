"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useFirebase } from "@/lib/firebase"

// Create auth context
const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
})

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [error, setError] = useState(null)
  const { auth, loading: firebaseLoading } = useFirebase()

  // Listen for auth state changes
  useEffect(() => {
    if (firebaseLoading || !auth) return

    const setupAuth = async () => {
      try {
        const { onAuthStateChanged } = await import("firebase/auth")

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user)
          setAuthLoading(false)
        })

        return unsubscribe
      } catch (error) {
        console.error("Auth setup error:", error)
        setError(error.message)
        setAuthLoading(false)
        return () => {}
      }
    }

    const unsubscribePromise = setupAuth()
    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe && unsubscribe())
    }
  }, [auth, firebaseLoading])

  // Sign in with email and password
  const signIn = async (email, password) => {
    if (!auth) {
      throw new Error("Authentication not initialized")
    }

    setError(null)
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Sign in error:", error)
      setError(error.message)
      throw error
    }
  }

  // Sign up with email and password
  const signUp = async (email, password, name) => {
    if (!auth) {
      throw new Error("Authentication not initialized")
    }

    setError(null)
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: name })
    } catch (error) {
      console.error("Sign up error:", error)
      setError(error.message)
      throw error
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error("Authentication not initialized")
    }

    setError(null)
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth")
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error("Google sign in error:", error)
      setError(error.message)
      throw error
    }
  }

  // Sign out
  const logout = async () => {
    if (!auth) {
      throw new Error("Authentication not initialized")
    }

    setError(null)
    try {
      const { signOut } = await import("firebase/auth")
      await signOut(auth)
    } catch (error) {
      console.error("Sign out error:", error)
      setError(error.message)
      throw error
    }
  }

  // Loading state combines Firebase loading and auth loading
  const loading = firebaseLoading || authLoading

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth
export function useAuth() {
  return useContext(AuthContext)
}

