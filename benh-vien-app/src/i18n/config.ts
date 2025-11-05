// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: { // Dùng namespace mặc định "translation"
            // Common
            "hospitalName": "Saigon ITO Hospital",
            "hospitalSubtitle": "Enhancing healthcare quality",
            "welcome": "Welcome",
            "save": "Save",
            "cancel": "Cancel",
            "submit": "Submit",
            // ... tất cả common

            // Sidebar
            "dashboard": "Dashboard",
            "registration": "Registration & Services",
            "payment": "Payment",
            "doctorExamination": "Doctor Examination",
            "doctorSchedule": "Doctor Schedule",
            "services": "Services Catalog",
            "reports": "Reports",
            "settings": "Settings",
            "copyright": "© 2025 Saigon ITO Hospital",
            "version": "Version 1.0",

            // Dashboard
            "dashboardTitle": "System Overview",
            "dashboardSubtitle": "Statistics and overview reports",
            "totalPatients": "Total Patients",
            // ... tất cả dashboard

            // Registration
            "registrationTitle": "Patient Registration & Service Booking",
            "registrationSubtitle": "Manage registration information and ancillary services",
            // ... tất cả registration
        }
    },
    vi: {
        translation: {

            "hospitalName": "Bệnh Viện Sài Gòn ITO",
            "hospitalSubtitle": "Nâng cao chất lượng chăm sóc sức khỏe",
            "welcome": "Chào mừng",
            "save": "Lưu",
            "cancel": "Hủy",
            "submit": "Gửi",
            // ... tất cả common

            // Sidebar
            "dashboard": "Tổng quan",
            "registration": "Tiếp nhận & CLS",
            "payment": "Thanh Toán",
            "doctorExamination": "Bác Sĩ Khám",
            "doctorSchedule": "Lịch Bác Sĩ",
            "services": "Danh mục dịch vụ",
            "reports": "Báo cáo",
            "settings": "Cấu hình",
            "copyright": "© 2025 Bệnh viện Saigon ITO",
            "version": "Phiên bản 1.0",

            // Dashboard
            "dashboardTitle": "Tổng quan Hệ thống",
            "dashboardSubtitle": "Thống kê và báo cáo tổng quan",
            "totalPatients": "Tổng bệnh nhân",


            "registrationTitle": "Tiếp nhận bệnh nhân & Đăng ký dịch vụ",
            "registrationSubtitle": "Quản lý thông tin tiếp nhận và dịch vụ cận lâm sàng",

        }
    }
};
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'vi',
        debug: process.env.NODE_ENV === 'development',

        interpolation: {
            escapeValue: false,
        },

        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
        },
    });

export default i18n;