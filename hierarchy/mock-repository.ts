import type { HierarchyRepository, StaffNode } from "./repository"

interface StaffRow {
  id: string
  firstName: string
  lastName: string
  supervisorName: string
  roles: string[]
}

const MOCK_ROWS: StaffRow[] = [
  { id: "a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5", firstName: "Patricia",    lastName: "Huang",      supervisorName: "",               roles: ["Supervisor"] },
  { id: "b2c3d4e5-f6a7-4b8c-9d0e-f1a2b3c4d5e6", firstName: "Gregory",     lastName: "Osei",       supervisorName: "Patricia Huang", roles: ["Supervisor"] },
  { id: "c3d4e5f6-a7b8-4c9d-0e1f-a2b3c4d5e6f7", firstName: "Natalie",     lastName: "Burns",      supervisorName: "Patricia Huang", roles: ["Supervisor"] },
  { id: "d4e5f6a7-b8c9-4d0e-1f2a-b3c4d5e6f7a8", firstName: "Raymond",     lastName: "Diaz",       supervisorName: "Gregory Osei",   roles: ["Supervisor"] },
  { id: "e5f6a7b8-c9d0-4e1f-2a3b-c4d5e6f7a8b9", firstName: "Sylvia",      lastName: "Torres",     supervisorName: "Natalie Burns",  roles: ["Supervisor"] },
  { id: "f6a7b8c9-d0e1-4f2a-3b4c-d5e6f7a8b9c0", firstName: "Anne",        lastName: "Rode",       supervisorName: "Gregory Osei",   roles: ["Inspector"]  },
  { id: "a7b8c9d0-e1f2-4a3b-4c5d-e6f7a8b9c0d1", firstName: "Bruce",       lastName: "Amundsen",   supervisorName: "Natalie Burns",  roles: ["Inspector"]  },
  { id: "b8c9d0e1-f2a3-4b4c-5d6e-f7a8b9c0d1e2", firstName: "Christopher", lastName: "Distefano",  supervisorName: "Raymond Diaz",   roles: ["Inspector"]  },
  { id: "c9d0e1f2-a3b4-4c5d-6e7f-a8b9c0d1e2f3", firstName: "Collin",      lastName: "O'Brien",    supervisorName: "Sylvia Torres",  roles: ["Inspector"]  },
  { id: "d0e1f2a3-b4c5-4d6e-7f8a-b9c0d1e2f3a4", firstName: "Maria",       lastName: "Espinoza",   supervisorName: "Gregory Osei",   roles: ["Inspector"]  },
  { id: "e1f2a3b4-c5d6-4e7f-8a9b-c0d1e2f3a4b5", firstName: "Kevin",       lastName: "Flanagan",   supervisorName: "Raymond Diaz",   roles: ["Inspector"]  },
  { id: "f2a3b4c5-d6e7-4f8a-9b0c-d1e2f3a4b5c6", firstName: "Tanya",       lastName: "Whitmore",   supervisorName: "Natalie Burns",  roles: ["Inspector"]  },
]

function buildTree(): StaffNode[] {
  const byName = new Map(
    MOCK_ROWS.map((s) => [`${s.firstName} ${s.lastName}`, s.id])
  )
  const nodes = new Map<string, StaffNode>(
    MOCK_ROWS.map((s) => [
      s.id,
      { id: s.id, firstName: s.firstName, lastName: s.lastName, title: s.roles[0], children: [] },
    ])
  )

  const roots: StaffNode[] = []
  for (const s of MOCK_ROWS) {
    const node = nodes.get(s.id)!
    if (!s.supervisorName) {
      roots.push(node)
    } else {
      const parentId = byName.get(s.supervisorName)
      if (parentId) {
        nodes.get(parentId)!.children.push(node)
      } else {
        roots.push(node)
      }
    }
  }
  return roots
}

class MockHierarchyRepository implements HierarchyRepository {
  async getHierarchy(): Promise<StaffNode[]> {
    return buildTree()
  }
}

export const mockHierarchyRepository = new MockHierarchyRepository()
