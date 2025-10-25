"use client"

import { useMintSync } from "./use-mint-sync"
import { useMoodSync } from "./use-mood-sync"
import { useMessageSync } from "./use-message-sync"

/**
 * Hook principal qui active TOUS les syncs blockchain → MongoDB
 * 
 * À utiliser dans le layout principal de l'app pour que les événements
 * soient écoutés en permanence pendant que l'utilisateur navigue
 * 
 * Usage:
 * ```tsx
 * export default function RootLayout({ children }) {
 *   useBlockchainSync() // Active tous les listeners
 *   return <html>...</html>
 * }
 * ```
 */
export function useBlockchainSync() {
  // Active tous les hooks de synchronisation
  useMintSync()
  useMoodSync()
  useMessageSync()

  // Ce hook ne retourne rien, il travaille en arrière-plan
}
