"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { piSDK, type PiUser } from "@/lib/pi-sdk"

interface PiContextType {
  user: PiUser | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  verifyWallet: (address: string) => Promise<boolean>
}

const PiContext = createContext<PiContextType | undefined>(undefined)

export function PiProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PiUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const savedUser = await piSDK.getUser()
      setUser(savedUser)
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function signIn() {
    try {
      setIsLoading(true)
      const authResult = await piSDK.authenticate()
      setUser(authResult.user)

      // Save to localStorage
      localStorage.setItem("pi_user", JSON.stringify(authResult.user))
      localStorage.setItem("pi_access_token", authResult.accessToken)
    } catch (error) {
      console.error("Sign in failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function signOut() {
    try {
      await piSDK.signOut()
      setUser(null)
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  async function verifyWallet(address: string): Promise<boolean> {
    if (!user) return false
    return piSDK.verifyWalletOwnership(address, user.uid)
  }

  return (
    <PiContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
        verifyWallet,
      }}
    >
      {children}
    </PiContext.Provider>
  )
}

export function usePi() {
  const context = useContext(PiContext)
  if (context === undefined) {
    throw new Error("usePi must be used within a PiProvider")
  }
  return context
}
