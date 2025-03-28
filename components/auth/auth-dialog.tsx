"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"

interface AuthDialogProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "login" | "register"
}

export function AuthDialog({ isOpen, onClose, defaultTab = "login" }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab)

  const handleSuccess = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{activeTab === "login" ? "Sign in to your account" : "Create an account"}</DialogTitle>
        </DialogHeader>

        {activeTab === "login" ? (
          <LoginForm onSuccess={handleSuccess} onRegisterClick={() => setActiveTab("register")} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} onLoginClick={() => setActiveTab("login")} />
        )}
      </DialogContent>
    </Dialog>
  )
}

