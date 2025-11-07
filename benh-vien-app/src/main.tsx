import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RegistrationPage } from '@presentation/pages/RegistrationPage'
import { makeRegisterVisitUC } from '@app/routes/makeRegisterUseCase'
import LoginApp from "@presentation/pages/LoginApp";
import '../src/i18n/config'
// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <RegistrationPage makeUseCase={makeRegisterVisitUC} />
//   </React.StrictMode>,
// )



ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LoginApp />
    </React.StrictMode>,
)



// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
//
// ReactDOM.createRoot(document.getElementById('root')!).render(
//     <React.StrictMode>
//         <Router>
//             <Routes>
//                 <Route path="/login" element={<LoginApp />} />
//                 <Route path="/register" element={<RegistrationPage makeUseCase={makeRegisterVisitUC} />} />
//                 <Route path="/" element={<Navigate to="/login" replace />} />
//             </Routes>
//         </Router>
//     </React.StrictMode>,
// )