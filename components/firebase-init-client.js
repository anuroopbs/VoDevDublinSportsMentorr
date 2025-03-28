"use client"

import { useEffect, useState } from "react"
import { initializeFirebase } from "@/lib/firebase"

// Component to initialize Firebase on the client side
export default function FirebaseInitClient() {
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const init = async () => {
      try {
        await initializeFirebase()
        setInitialized(true)
      } catch (err) {
        console.error("Firebase initialization error:", err)
        setError(err)
      }
    }

    init()
  }, [])

  // This component doesn't render anything visible
  return null
}

