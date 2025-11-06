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

import LanguageSwitcher from '@presentation/components/LanguageSwitcher'; // Import component đã tạo
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
  const { t } = useTranslation(); // Thêm hook

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
    {key: 'dashboard', label: t('dashboard')},
    {key: 'registration', label: t('registration')},
    {key: 'payment', label: t('payment')},
    {key: 'DoctorExamination', label: t('doctorExamination')},
    {key: 'DoctorSchedule', label: t('doctorSchedule')},
    {key: 'services', label: t('services')},
    {key: 'reports', label: t('reports')},
    {key: 'settings', label: t('settings')},
  ]

  return (
      <aside className={`sidebar-fixed ${collapsed ? 'is-collapsed' : ''}`}>
        <div className="sidebar__header">
          {!collapsed && (
              <div className="brand">
                <div className="brand__name">{t('hospitalName')}</div>
                <div className="brand__sub">{t('hospitalSubtitle')}</div>
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
                {!collapsed ? it.label : it.label.charAt(0)}
              </button>
          ))}
        </nav>
        <div className="sidebar__footer">
          {!collapsed ? `@2025 ${t('copyright')}` : '©'}
          {!collapsed && <div className="version">{t('version')}</div>}
        </div>
      </aside>
  )
}

export function RegistrationPage({makeUseCase}: { makeUseCase: () => RegisterVisit }) {
  const { t } = useTranslation(); // Thêm translation hook
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
              <div style={{display: 'grid', gap: 16, gridTemplateColumns: '1fr'}}>
                <PatientForm value={patient} onChange={(p: any) => setPatient((prev: any) => ({...prev, ...p}))}
                             errors={errors}/>
                <AppointmentForm value={appointment}
                                 onChange={(p: any) => setAppointment((prev: any) => ({...prev, ...p}))}
                                 errors={errors}/>
              </div>
              <div>
                <AncillaryOrderPicker chosen={orders} onAdd={onAdd} onRemove={onRemove} onUpdate={onUpdate}
                                      errors={errors}/>
                <div style={{display: 'flex', gap: 12, marginTop: 12}}>
                  <button className="btn primary" onClick={onSubmit} disabled={loading}>
                    {loading ? t('registration.processing') : t('registration.submitRegistration')}
                  </button>
                  <button className="btn" onClick={resetAll}>{t('registration.resetAll')}</button>
                </div>
                {error && <div className="error" style={{marginTop: 8}}>{error}</div>}
                {registrationId && (
                    <div className="ok" style={{marginTop: 8}}>
                      {t('registration.registrationSuccess')}: {registrationId}
                    </div>
                )}
              </div>

              {registrationId && (
                  <div className="card">
                    <h3>{t('registration.reviewInfo')}</h3>
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
                <div className="logo-container">
                  {/* Logo có thể thêm sau */}
                </div>
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
// Inject styles (no Tailwind required)
const style = document.createElement('style')
style.innerHTML = `
/* Cập nhật lại phần :root cho theme sáng */
:root { 
  --sidebar-w: 260px; 
  
  /* Light theme variables - MÀU XANH NHẠT */
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

/* Cập nhật header cho theme sáng */
.blue-header {
  position: sticky;
  top: 0;
  background: var(--header-bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  z-index: 100;
  flex-shrink: 0;
  box-shadow: 0 2px 12px rgba(37, 99, 235, 0.15);
}

.header-content {
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 70px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-container {
  position: relative;
  display: flex;
  align-items: center;
}

.header-logo {
  height: 45px;
  width: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.8);
}

[data-theme="dark"] .header-logo {
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
}

.header-logo:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
}

.hospital-info {
  display: flex;
  flex-direction: column;
}

.hospital-name {
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2;
  color: var(--header-text);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.hospital-subtitle {
  font-size: 12px;
  color: var(--muted-color);
  margin-top: 2px;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Theme Toggle Button */
.theme-toggle {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(37, 99, 235, 0.3);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
  color: #2563eb;
  backdrop-filter: blur(10px);
}

[data-theme="dark"] .theme-toggle {
  background: rgba(30, 58, 138, 0.3);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #bfdbfe;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.theme-toggle:hover {
  transform: scale(1.1) rotate(15deg);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
}

[data-theme="dark"] .theme-toggle:hover {
  background: rgba(30, 58, 138, 0.5);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.5);
}

[data-theme="dark"] .theme-toggle:hover {
  background: rgba(13, 71, 161, 0.5);
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.5);
}
.content{
  flex: 1;
  min-width: 0;
  padding-left: var(--sidebar-w);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}


.blue-header {
  position: sticky;
  top: 0;
  background: var(--header-bg);
  backdrop-filter: blur(12px);
  border-bottom: none;
  z-index: 100;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.15);
}

.header-content {
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 70px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-container {
  position: relative;
  display: flex;
  align-items: center;
}

.header-logo {
  height: 45px;
  width: auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.header-logo:hover {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.4);
}

.logo-fallback {
  display: none;
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #ffffff, #dbeafe);
  border-radius: 8px;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.hospital-info {
  display: flex;
  color: blue;
  flex-direction: column;
}

.hospital-name {
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2;
  color: var(--header-text);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.hospital-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* DASHBOARD STYLES */
.dashboard {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.dashboard-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
}

.date-filter {
  color: var(--muted-color);
  font-size: 14px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
  margin-bottom: 4px;
}

.stat-title {
  font-size: 14px;
  color: var(--muted-color);
  margin-bottom: 2px;
}

.stat-subtitle {
  font-size: 12px;
  color: var(--muted-color);
  opacity: 0.8;
}

/* Dashboard Content */
.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.dashboard-left,
.dashboard-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Chart Cards */
.chart-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
}

.chart-card h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
}

/* Simple Chart */
.simple-chart {
  padding: 20px 0;
}

.chart-bars {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 200px;
  gap: 8px;
}

.chart-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 8px;
}

.chart-bar {
  background: linear-gradient(180deg, #3b82f6, #1d4ed8);
  border-radius: 6px 6px 0 0;
  min-height: 20px;
  width: 100%;
  position: relative;
  transition: height 0.3s ease;
}

.chart-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color);
}

.chart-label {
  font-size: 12px;
  color: var(--muted-color);
}

/* Department Stats */
.department-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.department-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.dept-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dept-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dept-name {
  font-size: 14px;
  color: var(--text-color);
}

.dept-patients {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
}

/* Activities */
.activities-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
}

.activities-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.activities-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.view-all {
  font-size: 12px;
  color: #3b82f6;
  cursor: pointer;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: var(--bg-color);
  transition: background-color 0.2s ease;
}

.activity-item:hover {
  background: rgba(59, 130, 246, 0.05);
}

.activity-icon {
  font-size: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 6px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 2px;
}

.activity-desc {
  font-size: 12px;
  color: var(--muted-color);
  text-transform: capitalize;
}

.activity-time {
  text-align: right;
  font-size: 12px;
  color: var(--muted-color);
}

.activity-status {
  font-weight: 500;
  margin-top: 2px;
}

/* Quick Actions */
.quick-actions-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-color);
}

.quick-action-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  transform: translateY(-1px);
}

.action-icon {
  font-size: 20px;
}

.quick-action-btn span:last-child {
  font-size: 12px;
  font-weight: 500;
}

/* Alert Card */
.alert-card {
  background: linear-gradient(135deg, #fef3c7, #fef3c7);
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 20px;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.alert-icon {
  font-size: 20px;
}

.alert-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #d97706;
}

.alert-content p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #92400e;
}

.alert-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.alert-btn:hover {
  background: #b91c1c;
}

/* Registration Form Styles */
.registration-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 0;
  height: 100%;
  min-height: 0;
}

.forms-section {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  height: fit-content;
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 20px;
  background: var(--card-bg);
}

.orders-section {
  grid-column: 2;
  grid-row: 1 / span 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: var(--card-bg);
  border-left: 1px solid var(--border-color);
  height: 100%;
  overflow-y: auto;
}

.preview-section {
  grid-column: 1;
  grid-row: 2;
  padding: 20px;
  background: var(--card-bg);
  border-right: 1px solid var(--border-color);
  border-top: 1px solid var(--border-color);
}

.other-menu-content {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
}

.card{
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  height: 100%;
}
.muted{ font-size: 14px; color: var(--muted-color); margin-top: 8px; }
.error{ color: var(--error-color); font-size: 14px; padding: 8px 0; }
.ok{ color: var(--success-color); font-size: 14px; padding: 8px 0; }
.json{
  background: var(--json-bg);
  color: var(--json-text);
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
  font-size: 13px;
  line-height: 1.4;
  margin-top: 12px;
  max-height: 400px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.btn{
  border-radius: 10px;
  padding: 12px 20px;
  border: 1px solid var(--btn-border);
  background: var(--btn-bg);
  color: var(--text-color);
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  min-width: 120px;
}
.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.btn.primary{
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border-color: var(--btn-primary-bg);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Theme Toggle Button */
.theme-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.theme-toggle:hover {
  transform: scale(1.1) rotate(15deg);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.footer {
  padding: 16px 24px;
  font-size: 12px;
  color: var(--muted-color);
  border-top: 1px solid var(--border-color);
  background: var(--card-bg);
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .registration-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }
  
  .forms-section {
    grid-column: 1;
    grid-row: 1;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
  
  .orders-section {
    grid-column: 1;
    grid-row: 2;
    border-left: none;
    border-bottom: 1px solid var(--border-color);
  }
  
  .preview-section {
    grid-column: 1;
    grid-row: 3;
    border-right: none;
    border-top: 1px solid var(--border-color);
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
}

/* THÊM VÀO CUỐI CSS */
.blue-header {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%) !important;
  color: white !important;
}

[data-theme="light"] .blue-header {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%) !important;
  color: #1e3a8a !important;
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