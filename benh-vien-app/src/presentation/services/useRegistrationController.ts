import { useState } from 'react'
import type { RegistrationDTO } from '@application/dto/RegistrationDTO'
import type { RegisterVisit } from '@application/usecases/RegisterVisit'

export function useRegistrationController(makeUseCase: () => RegisterVisit) {
  const [loading, setLoading] = useState(false)
  const [registrationId, setRegistrationId] = useState<string|undefined>()
  const [error, setError] = useState<string|undefined>()
  async function submit(dto: RegistrationDTO) {
    setLoading(true); setError(undefined)
    try {
      const uc = makeUseCase()
      const res = await uc.execute(dto)
      setRegistrationId(res.registrationId)
    } catch (e:any) {
      setError(e?.message ?? 'UNKNOWN_ERROR')
    } finally {
      setLoading(false)
    }
  }
  return { submit, loading, error, registrationId }
}
