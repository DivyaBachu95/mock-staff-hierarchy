export interface StaffNode {
  id: string
  firstName: string
  lastName: string
  title?: string
  children: StaffNode[]
}

export interface HierarchyRepository {
  getHierarchy(): Promise<StaffNode[]>
}
