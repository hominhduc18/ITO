export type Gender = 'male' | 'female' | 'other'

export interface Patient {
  fullName: string
  dob: Date
  gender: Gender
  nationalId?: string
  phone: string
  insurance?: string
  address?: string
}
