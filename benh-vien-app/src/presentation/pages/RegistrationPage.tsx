import React from 'react'
import { PatientForm } from '@presentation/components/PatientForm'
import { AppointmentForm } from '@presentation/components/AppointmentForm'
import { AncillaryOrderPicker } from '@presentation/components/AncillaryOrderPicker'
import { useRegistrationController } from '@presentation/controllers/useRegistrationController'
import type { RegisterVisit } from '@application/usecases/RegisterVisit'
import { isPhone } from '@shared/utils/validation'
import { Dashboard } from "@presentation/components/DashboardForm"
import { ServiceCatalogForm} from "@presentation/components/ServiceCatalog";
import {Payment} from "@presentation/components/Payment";
import DoctorSchedule from "@presentation/components/DoctorSchedule";
import DoctorExamination from "@presentation/components/DoctorExamination";
import MedicalReports from "@presentation/components/MedicaReport";
import AccountSettings from "@presentation/components/AccountSetting";

// THÊM IMPORT MỚI
import { PatientManagementSimple } from "@presentation/components/PatientManagement";
import PatientList from "@presentation/components/PatientList";

import LanguageSwitcher from '@presentation/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import i18n from "i18next";

// Hook quản lý theme
const useTheme = () => {
  const [theme, setTheme] = React.useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return {theme, toggleTheme};
};

// Component chuyển đổi theme
function ThemeToggle() {
  const {theme, toggleTheme} = useTheme();
  const { t } = useTranslation();

  return (
      <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={t('themeToggle')}
          title={theme === 'light' ? t('switchToDark') : t('switchToLight')}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
  );
}

function Sidebar({ active, onNavigate, collapsed, onToggle }: any) {
  const { t } = useTranslation();

  const items = [
    { key: 'dashboard', label: t('dashboard'), icon: '📊' },
    { key: 'registration', label: t('registration'), icon: '📝' },
    { key: 'patientManagement', label: t('listRegistration'), icon: '👥' },
    { key: 'payment', label: t('payment'), icon: '💰' },
    { key: 'DoctorExamination', label: t('doctorExamination'), icon: '👨‍⚕️' },
    { key: 'DoctorSchedule', label: t('doctorSchedule'), icon: '📅' },
    { key: 'services', label: t('services'), icon: '🛠️' },
    { key: 'reports', label: t('reports'), icon: '📈' },
    { key: 'settings', label: t('settings'), icon: '⚙️' },
  ]

  return (
      <aside className={`sidebar-fixed ${collapsed ? 'is-collapsed' : ''}`}>
        <div className="sidebar__header">
          {!collapsed ? (
              <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="brand-logo" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="logo-icon">
                    <img
                        src="/image/otp.png"
                        alt="SAIGON-ITO"
                        className="logo-image"
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="logo-pulse"></div>
                </div>
                <div className="brand-content">
                  <div className="brand__name">SAIGON-ITO</div>
                </div>
              </div>
          ) : (
              <div className="brand-collapsed">
                <div className="logo-icon">
                  <img
                      src="/image/otp.png"
                      alt="SAIGON-ITO"
                      className="logo-image"
                      style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                  />
                </div>
                <div className="logo-pulse"></div>
              </div>
          )}
          <button className="toggle" onClick={onToggle} title={collapsed ? t('expand') : t('collapse')}>
            {collapsed ? '›' : '‹'}
          </button>
        </div>
        <nav className="sidebar__nav">
          {items.map((it) => (
              <button
                  key={it.key}
                  className={`nav__item ${active === it.key ? 'is-active' : ''}`}
                  onClick={() => onNavigate(it.key)}
                  type="button"
                  title={it.label}
              >
                <span className="nav-icon">{it.icon}</span>
                {!collapsed && <span className="nav-text">{it.label}</span>}
              </button>
          ))}
        </nav>
        <div className="sidebar__footer">
          {!collapsed ? ` ${t('copyright')}` : '©'}
          {!collapsed && <div className="version">{t('version')}</div>}
        </div>
      </aside>
  )
}

export function RegistrationPage({makeUseCase}: { makeUseCase: () => RegisterVisit }) {
  const { t } = useTranslation();
  const {submit, loading, error, registrationId} = useRegistrationController(makeUseCase)
  const [patient, setPatient] = React.useState<any>(() => ({
    fullName: '',
    dob: '',
    gender: '',
    nationalId: '',
    phone: '',
    insurance: '',
    address: ''
  }))
  const [appointment, setAppointment] = React.useState<any>(() => ({
    department: '',
    preferredDate: '',
    preferredTime: '',
    symptoms: ''
  }))
  const [orders, setOrders] = React.useState<any[]>([])
  const [errors, setErrors] = React.useState<any>({})
  const [activeMenu, setActiveMenu] = React.useState('dashboard')
  const [collapsed, setCollapsed] = React.useState(false)

  // THÊM STATE CHO PATIENT MANAGEMENT
  const [selectedPatientForRegistration, setSelectedPatientForRegistration] = React.useState<any>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('reg-form')
    if (saved) {
      const parsed = JSON.parse(saved)
      setPatient(parsed.patient || {})
      setAppointment(parsed.appointment || {})
      setOrders(parsed.orders || [])
    }
  }, [])

  React.useEffect(() => {
    localStorage.setItem('reg-form', JSON.stringify({patient, appointment, orders}))
  }, [patient, appointment, orders])

  // HÀM XỬ LÝ KHI CHỌN BỆNH NHÂN TỪ PATIENT MANAGEMENT
  const handlePatientSelectFromManagement = (patientData: any) => {
    setSelectedPatientForRegistration(patientData);
    setActiveMenu('registration'); // Chuyển sang tab đăng ký

    // Tự động điền thông tin bệnh nhân vào form đăng ký
    setPatient({
      fullName: patientData.fullName,
      dob: patientData.dob,
      gender: patientData.gender,
      nationalId: patientData.nationalId,
      phone: patientData.phone,
      insurance: patientData.insurance,
      address: patientData.address,
      medicalCode: patientData.medicalCode,
      patientId: patientData.patientId
    });
  };

  function validate() {
    const e: any = {}
    if (!patient.fullName?.trim()) e.fullName = t('registration.errors.fullNameRequired')
    if (!patient.dob) e.dob = t('registration.errors.dobRequired')
    if (!patient.gender) e.gender = t('registration.errors.genderRequired')
    if (!isPhone(patient.phone || '')) e.phone = t('registration.errors.phoneInvalid')
    if (!appointment.department) e.department = t('registration.errors.departmentRequired')
    if (!appointment.preferredDate) e.preferredDate = t('registration.errors.dateRequired')
    if (!appointment.preferredTime) e.preferredTime = t('registration.errors.timeRequired')
    if (!orders.length) e.orders = t('registration.errors.servicesRequired')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function onAdd(s: any) {
    setOrders(prev => prev.some(o => o.id === s.id) ? prev : [...prev, {
      id: s.id,
      name: s.name,
      category: s.category,
      priority: 'routine',
      note: ''
    }])
  }

  function onRemove(id: string) {
    setOrders(prev => prev.filter(o => o.id !== id))
  }

  function onUpdate(id: string, patch: any) {
    setOrders(prev => prev.map(o => o.id === id ? {...o, ...patch} : o))
  }

  function resetAll() {
    localStorage.removeItem('reg-form')
    setPatient({fullName: '', dob: '', gender: '', nationalId: '', phone: '', insurance: '', address: ''})
    setAppointment({department: '', preferredDate: '', preferredTime: '', symptoms: ''})
    setOrders([])
    setErrors({})
    setSelectedPatientForRegistration(null);
  }

  async function onSubmit() {
    if (!validate()) return
    const dto = {
      patient: {...patient},
      appointment: {...appointment},
      orders: orders.map(o => ({id: o.id, name: o.name, category: o.category, priority: o.priority, note: o.note})),
    }
    await submit(dto as any)
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard/>

      case 'registration':
        return (
            <>
              {/* HIỂN THỊ THÔNG BÁO NẾU CÓ BỆNH NHÂN ĐƯỢC CHỌN */}
              {selectedPatientForRegistration && (
                  <div className="card" style={{
                    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                    border: '1px solid #10b981',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>✅</span>
                      <div>
                        <strong>Đang sử dụng thông tin bệnh nhân:</strong> {selectedPatientForRegistration.fullName}
                        <div style={{ fontSize: '14px', color: '#065f46' }}>
                          Mã Y tế: {selectedPatientForRegistration.medicalCode} |
                          SĐT: {selectedPatientForRegistration.phone}
                        </div>
                      </div>
                      <button
                          className="btn"
                          onClick={() => setSelectedPatientForRegistration(null)}
                          style={{ marginLeft: 'auto', fontSize: '12px', padding: '6px 12px' }}
                      >
                        🆕 Chọn bệnh nhân khác
                      </button>
                    </div>
                  </div>
              )}

              <div style={{display: 'grid', gap: 16, gridTemplateColumns: '1fr'}}>
                <PatientForm
                    value={patient}
                    onChange={(p: any) => setPatient((prev: any) => ({...prev, ...p}))}
                    errors={errors}
                />
                <AppointmentForm
                    value={appointment}
                    onChange={(p: any) => setAppointment((prev: any) => ({...prev, ...p}))}
                    errors={errors}
                />
              </div>
              <div>
                <AncillaryOrderPicker
                    chosen={orders}
                    onAdd={onAdd}
                    onRemove={onRemove}
                    onUpdate={onUpdate}
                    errors={errors}
                />
                <div style={{display: 'flex', gap: 12, marginTop: 12}}>
                  <button className="btn primary" onClick={onSubmit} disabled={loading}>
                    {loading ? t('processing') : t('submitRegistration')}
                  </button>
                  <button className="btn" onClick={resetAll}>{t('resetAll')}</button>
                  <button
                      className="btn"
                      onClick={() => setActiveMenu('patientManagement')}
                      style={{ background: '#f0f9ff', color: '#0369a1', borderColor: '#bae6fd' }}
                  >
                    👥 Quản lý bệnh nhân
                  </button>
                </div>
                {error && <div className="error" style={{marginTop: 8}}>{error}</div>}
                {registrationId && (
                    <div className="ok" style={{marginTop: 8}}>
                      {t('registrationSuccess')}: {registrationId}
                    </div>
                )}
              </div>

              {registrationId && (
                  <div className="card">
                    <h3>{t('reviewInfo')}</h3>
                    <pre className="json">{JSON.stringify({
                      patient,
                      appointment,
                      orders,
                      submittedAt: new Date().toISOString()
                    }, null, 2)}</pre>
                  </div>
              )}
            </>
        )
      case 'patientManagement':
        return (
            <PatientManagementSimple />
        )
      case 'services':
        return <ServiceCatalogForm/>
      case 'payment':
        return <Payment/>
      case 'DoctorSchedule':
        return <DoctorSchedule/>
      case 'DoctorExamination':
        return <DoctorExamination/>
      case 'settings':
        return <AccountSettings/>
      default:
        return (
            <div className="card">
              <h3>{t('selectFeatureFromMenu')}</h3>
            </div>
        )
    }
  }

  return (
      <div className={`layout ${collapsed ? 'layout--collapsed' : ''}`}>
        <Sidebar
            active={activeMenu}
            onNavigate={setActiveMenu}
            collapsed={collapsed}
            onToggle={() => setCollapsed((v) => !v)}
        />

        <div className="content">
          <header className="sticky blue-header">
            <div className="header-content">
              <div className="header-left">
                <div className="hospital-info">
                  <div className="hospital-name">{t('hospitalName')}</div>
                  <div className="hospital-subtitle">{t('hospitalSubtitle')}</div>
                </div>
              </div>
              <div className="header-right">
                <LanguageSwitcher />
                <div style={{ width: '25px' }}></div>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="main-content">
            {renderContent()}
          </main>

          <footer className="footer">
            {t('copyright')}
          </footer>
        </div>
      </div>
  )
}

// Inject styles (giữ nguyên CSS hiện tại)
const style = document.createElement('style')
style.innerHTML = `
/* GIỮ NGUYÊN TOÀN BỘ CSS HIỆN TẠI */
:root { 
  --sidebar-w: 260px; 
  --bg-color: #f0f8ff;
  --text-color: #1e3a8a;
  --card-bg: #ffffff;
  --border-color: #bfdbfe;
  --header-bg: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  --header-text: #1e3a8a;
  --sidebar-bg: #1e3a8a;
  --sidebar-text: #dbeafe;
  --sidebar-border: #3730a3;
  --sidebar-hover: #3730a3;
  --sidebar-active: #3730a3;
  --muted-color: #4f46e5;
  --error-color: #dc2626;
  --success-color: #065f46;
  --json-bg: #0b1021;
  --json-text: #d1d5db;
  --btn-bg: #ffffff;
  --btn-border: #93c5fd;
  --btn-primary-bg: #2563eb;
  --btn-primary-text: #ffffff;
}

[data-theme="dark"] {
  --bg-color: #0f172a;
  --text-color: #f1f5f9;
  --card-bg: #1e293b;
  --border-color: #334155;
  --header-bg: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  --header-text: #ffffff;
  --sidebar-bg: #020617;
  --sidebar-text: #e2e8f0;
  --sidebar-border: #1e293b;
  --sidebar-hover: #1e293b;
  --sidebar-active: #334155;
  --muted-color: #94a3b8;
  --error-color: #f87171;
  --success-color: #4ade80;
  --json-bg: #1e293b;
  --json-text: #cbd5e1;
  --btn-bg: #334155;
  --btn-border: #475569;
  --btn-primary-bg: #3b82f6;
  --btn-primary-text: #ffffff;
}

/* THÊM STYLE CHO PATIENT MANAGEMENT */
.patient-management-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.patient-management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.patient-management-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
}



[data-theme="light"] .blue-header {
  background: linear-gradient(135deg, #84b7e3 0%, #0969e1 100%) !important
  color: #1e3a8a !important;
}

.blue-header {
  background: linear-gradient(135deg, #045cfd 0%, #1f9fe9 100%) !important;
  color: white !important;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--muted-color);
}
`
document.head.appendChild(style)