"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { HierarchyRepository } from "./repository"

const HierarchyContext = createContext<HierarchyRepository | null>(null)

export function HierarchyProvider({
  repo,
  children,
}: {
  repo: HierarchyRepository
  children: ReactNode
}) {
  return (
    <HierarchyContext.Provider value={repo}>
      {children}
    </HierarchyContext.Provider>
  )
}

export function useHierarchyRepository(): HierarchyRepository {
  const ctx = useContext(HierarchyContext)
  if (!ctx) throw new Error("useHierarchyRepository must be used inside HierarchyProvider")
  return ctx
}
