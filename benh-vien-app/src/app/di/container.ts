import type { Container } from './types'
import { RegistrationApi } from '@infra/http/RegistrationApi'

export const container: Container = {
  registrationRepo: new RegistrationApi(),
}
