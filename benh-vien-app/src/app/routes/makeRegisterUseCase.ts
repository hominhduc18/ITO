import { container } from '@app/di/container'
import { RegisterVisit } from '@application/usecases/RegisterVisit'

export function makeRegisterVisitUC() {
  return new RegisterVisit(container.registrationRepo)
}
