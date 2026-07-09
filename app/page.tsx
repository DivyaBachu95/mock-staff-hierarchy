"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { ListTree } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HierarchyProvider } from "@/hierarchy/context"
import { mockHierarchyRepository } from "@/hierarchy/mock-repository"

const HierarchyTreeDialog = dynamic(
  () => import("@/hierarchy/dialog").then((m) => ({ default: m.HierarchyTreeDialog })),
  { ssr: false }
)

export default function Home() {
  const [open, setOpen] = useState(false)

  return (
    <HierarchyProvider repo={mockHierarchyRepository}>
      <main className="flex min-h-screen items-center justify-center">
        <Button variant="outline" onClick={() => setOpen(true)}>
          <ListTree />
          Hierarchy Tree
        </Button>
        <HierarchyTreeDialog open={open} onOpenChange={setOpen} />
      </main>
    </HierarchyProvider>
  )
}
