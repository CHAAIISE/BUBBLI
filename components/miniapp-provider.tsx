"use client"

import { useEffect, useState } from "react"
import { sdk } from "@farcaster/miniapp-sdk"

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initMiniApp = async () => {
      try {
        // Signal that the app is ready to be displayed
        await sdk.actions.ready()
        setIsReady(true)
      } catch (error) {
        console.error("Failed to initialize MiniApp SDK:", error)
        // If SDK fails, still show the app
        setIsReady(true)
      }
    }

    initMiniApp()
  }, [])

  // Show loading while initializing
  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-accent/20 to-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading BUBBLO...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
