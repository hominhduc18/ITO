import type { RegistrationRepository } from '@domain/repositories/RegistrationRepository'

export interface Container {
  registrationRepo: RegistrationRepository
}
