"use client"

// Client-side only Firebase initialization
import { useState, useEffect } from "react"
import firebaseConfig from "./firebase-config"

// Initialize Firebase only on client side
let firebaseApp = null
let firebaseAuth = null
let firebaseDb = null

// Function to initialize Firebase
export const initializeFirebase = async () => {
  if (typeof window === "undefined") {
    return { app: null, auth: null, db: null }
  }

  if (firebaseApp) {
    return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb }
  }

  try {
    // Dynamically import Firebase modules
    const { initializeApp } = await import("firebase/app")
    const { getAuth } = await import("firebase/auth")
    const { getFirestore } = await import("firebase/firestore")

    // Initialize Firebase
    firebaseApp = initializeApp(firebaseConfig)
    firebaseAuth = getAuth(firebaseApp)
    firebaseDb = getFirestore(firebaseApp)

    return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb }
  } catch (error) {
    console.error("Firebase initialization error:", error)
    return { app: null, auth: null, db: null }
  }
}

// Hook to use Firebase
export function useFirebase() {
  const [firebase, setFirebase] = useState({ app: null, auth: null, db: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initFirebase = async () => {
      try {
        const result = await initializeFirebase()
        setFirebase(result)
      } catch (err) {
        console.error("Error initializing Firebase:", err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    initFirebase()
  }, [])

  return { ...firebase, loading, error }
}

