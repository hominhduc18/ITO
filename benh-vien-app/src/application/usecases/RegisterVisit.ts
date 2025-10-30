import type { RegistrationRepository } from '@domain/repositories/RegistrationRepository'
import type { RegistrationDTO } from '@application/dto/RegistrationDTO'

export class RegisterVisit {
  constructor(private repo: RegistrationRepository) {}

  async execute(dto: RegistrationDTO) {
    if (!dto.patient?.fullName?.trim()) throw new Error('PATIENT_NAME_REQUIRED')
    if (!dto.patient?.dob) throw new Error('DOB_REQUIRED')
    if (!dto.patient?.phone) throw new Error('PHONE_REQUIRED')
    if (!dto.appointment?.department) throw new Error('DEPARTMENT_REQUIRED')
    if (!dto.appointment?.preferredDate) throw new Error('PREFERRED_DATE_REQUIRED')
    if (!dto.appointment?.preferredTime) throw new Error('PREFERRED_TIME_REQUIRED')
    if (!dto.orders?.length) throw new Error('ORDERS_REQUIRED')

    const payload = {
      patient: {
        fullName: dto.patient.fullName,
        dob: new Date(dto.patient.dob),
        gender: dto.patient.gender,
        nationalId: dto.patient.nationalId,
        phone: dto.patient.phone,
        insurance: dto.patient.insurance,
        address: dto.patient.address,
      },
      appointment: {
        department: dto.appointment.department,
        preferredDate: new Date(dto.appointment.preferredDate),
        preferredTime: dto.appointment.preferredTime,
        symptoms: dto.appointment.symptoms,
      },
      orders: dto.orders.map(o => ({ id: o.id, name: o.name, category: o.category, priority: o.priority, note: o.note })),
      submittedAt: new Date(),
    }

    return this.repo.submit(payload)
  }
}
