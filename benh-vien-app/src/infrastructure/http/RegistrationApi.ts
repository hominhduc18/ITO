import type { RegistrationRepository, RegistrationPayload } from '@domain/repositories/RegistrationRepository'
import { API_BASE_URL } from '@infra/config/env'

export class RegistrationApi implements RegistrationRepository {
  async submit(payload: RegistrationPayload) {
    // If no API base URL configured, simulate a server response
    if (!API_BASE_URL) {
      await new Promise(r => setTimeout(r, 500))
      const fakeId = 'REG-' + Math.random().toString(36).slice(2, 8).toUpperCase()
      return { registrationId: fakeId }
    }

    // Real call
    const body = {
      ...payload,
      patient: { ...payload.patient, dob: payload.patient.dob.toISOString() },
      appointment: { ...payload.appointment, preferredDate: payload.appointment.preferredDate.toISOString() },
      submittedAt: payload.submittedAt.toISOString(),
    }

    const res = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('HTTP_' + res.status)
    return res.json() as Promise<{ registrationId: string }>
  }
}
