export type Priority = 'routine' | 'urgent' | 'stat'
export interface AncillaryOrder {
  id: string
  name: string
  category: string
  priority: Priority
  note?: string
}
