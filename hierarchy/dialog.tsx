"use client"

import { useCallback, useEffect, useState } from "react"
import { Tree, TreeNode } from "react-organizational-chart"
import { UserIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { StaffNode } from "./repository"
import { useHierarchyRepository } from "./context"

interface NodeCardProps {
  node: StaffNode
  collapsed: Set<string>
  onToggle: (id: string) => void
}

function NodeCard({ node, collapsed, onToggle }: NodeCardProps) {
  const hasChildren = node.children.length > 0
  const isCollapsed = collapsed.has(node.id)

  return (
    <div
      onClick={hasChildren ? () => onToggle(node.id) : undefined}
      className={[
        "inline-flex flex-col items-center gap-2 rounded-lg border bg-popover px-4 py-3 w-40 shadow-sm",
        hasChildren ? "cursor-pointer hover:bg-muted transition-colors" : "",
      ].join(" ")}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-400">
        <UserIcon className="h-5 w-5" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium leading-tight">
          {node.firstName} {node.lastName}
        </p>
        {node.title && (
          <p className="text-xs text-muted-foreground mt-0.5">{node.title}</p>
        )}
      </div>
      {hasChildren && (
        <p className="text-xs text-muted-foreground">
          {node.children.length} supervisee{node.children.length !== 1 ? "s" : ""}
          {isCollapsed ? " ▶" : ""}
        </p>
      )}
    </div>
  )
}

function OrgTreeNode({
  node,
  collapsed,
  onToggle,
}: {
  node: StaffNode
  collapsed: Set<string>
  onToggle: (id: string) => void
}) {
  const showChildren = !collapsed.has(node.id) && node.children.length > 0

  if (!showChildren) {
    return (
      <TreeNode label={<NodeCard node={node} collapsed={collapsed} onToggle={onToggle} />} />
    )
  }

  return (
    <TreeNode label={<NodeCard node={node} collapsed={collapsed} onToggle={onToggle} />}>
      {node.children.map((child) => (
        <OrgTreeNode key={child.id} node={child} collapsed={collapsed} onToggle={onToggle} />
      ))}
    </TreeNode>
  )
}

interface HierarchyTreeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HierarchyTreeDialog({ open, onOpenChange }: HierarchyTreeDialogProps) {
  const repo = useHierarchyRepository()
  const [roots, setRoots] = useState<StaffNode[]>([])
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!open) return
    repo.getHierarchy().then(setRoots)
  }, [open, repo])

  const handleToggle = useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Supervisor Hierarchy</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto py-6">
          {roots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No supervisor hierarchy available.</p>
          ) : (
            <div className="flex justify-center min-w-max mx-auto gap-12">
              {roots.map((root) => {
                const treeProps = {
                  lineWidth: "1.5px",
                  lineColor: "#94a3b8",
                  lineBorderRadius: "4px",
                  label: <NodeCard node={root} collapsed={collapsed} onToggle={handleToggle} />,
                }
                const showChildren = !collapsed.has(root.id) && root.children.length > 0
                return (
                  <Tree key={root.id} {...treeProps}>
                    {showChildren
                      ? root.children.map((child) => (
                          <OrgTreeNode
                            key={child.id}
                            node={child}
                            collapsed={collapsed}
                            onToggle={handleToggle}
                          />
                        ))
                      : null}
                  </Tree>
                )
              })}
            </div>
          )}
        </div>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}
