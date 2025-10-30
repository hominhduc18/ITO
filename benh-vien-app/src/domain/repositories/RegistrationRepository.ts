import type { Patient } from '@domain/entities/Patient'
import type { Appointment } from '@domain/entities/Appointment'
import type { AncillaryOrder } from '@domain/entities/AncillaryOrder'

export interface RegistrationPayload {
  patient: Patient
  appointment: Appointment
  orders: AncillaryOrder[]
  submittedAt: Date
}

export interface RegistrationRepository {
  submit(payload: RegistrationPayload): Promise<{ registrationId: string }>
}
