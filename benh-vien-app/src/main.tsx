import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RegistrationPage } from '@presentation/pages/RegistrationPage'
import { makeRegisterVisitUC } from '@app/routes/makeRegisterUseCase'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RegistrationPage makeUseCase={makeRegisterVisitUC} />
  </React.StrictMode>,
)
