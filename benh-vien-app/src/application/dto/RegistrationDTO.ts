export interface RegistrationDTO {
  patient: {
    fullName: string
    dob: string
    gender: 'male'|'female'|'other'
    nationalId?: string
    phone: string
    insurance?: string
    address?: string
  }
  appointment: {
    department: string
    preferredDate: string
    preferredTime: string // HH:mm
    symptoms?: string
  }
  orders: Array<{
    id: string
    name: string
    category: string
    priority: 'routine'|'urgent'|'stat'
    note?: string
  }>
}
