// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            // Common
            "hospitalName": "Saigon ITO Hospital",
            "hospitalSubtitle": "Enhancing healthcare quality",
            "welcome": "Welcome",
            "save": "Save",
            "cancel": "Cancel",
            "submit": "Submit",
            "delete": "Delete",
            "edit": "Edit",
            "loading": "Loading...",
            "error": "Error",
            "success": "Success",
            "confirm": "Confirm",
            "back": "Back",
            "next": "Next",
            "search": "Search",
            "filter": "Filter",
            "export": "Export",
            "print": "Print",
            "download": "Download",
            "themeToggle": "Toggle theme",
            "switchToDark": "Switch to dark mode",
            "switchToLight": "Switch to light mode",
            "expand": "Expand",
            "collapse": "Collapse",
            "selectFeatureFromMenu": "Please select a feature from the left menu",

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
            "todayPatients": "Today's Patients",
            "revenue": "Revenue",
            "appointments": "Appointments",
            "monthlyRevenue": "Monthly Revenue",
            "patientStatistics": "Patient Statistics",
            "departmentStats": "Department Statistics",
            "recentActivities": "Recent Activities",
            "quickActions": "Quick Actions",
            "viewAll": "View All",
            "todayAppointments": "Today's Appointments",
            "waitingPatients": "Waiting Patients",
            "availableDoctors": "Available Doctors",
            "occupiedBeds": "Occupied Beds",
            "serviceRate": "Service Rate",
            "appointmentsByWeek": "Appointments by Week",
            "patientDistribution": "Patient Distribution by Department",
            "todayActivities": "Today's Activities",
            "newAdmissions": "New Admissions",
            "testsProcessed": "Tests Processed",
            "discharged": "Discharged",
            "emergencyCases": "Emergency Cases",
            "alerts": "Alerts",
            "patientsWaiting": "patients waiting",
            "maintenanceRequired": "maintenance required",
            "allDepartments": "All departments operational",
            "accumulated": "Accumulated",
            "onDuty": "On duty",
            "today": "Today",
            "thisMonth": "This month",
            "bedsUsed": "beds used",
            "patients": "patients",
            "samples": "samples",
            "cases": "cases",

            // Days of week
            "monday": "Mon",
            "tuesday": "Tue",
            "wednesday": "Wed",
            "thursday": "Thu",
            "friday": "Fri",
            "saturday": "Sat",
            "sunday": "Sun",

            // Departments
            "emergency": "Emergency",
            "treatment": "Treatment",
            "orthopedics": "Orthopedics",

            // Registration
            "registrationTitle": "Patient Registration & Service Booking",
            "registrationSubtitle": "Manage registration information and ancillary services",
            "patientInfo": "Patient Information",
            "appointmentInfo": "Appointment Information",
            "ancillaryServices": "Ancillary Services",
            "submitRegistration": "Submit Registration",
            "resetAll": "Reset All",
            "processing": "Processing...",
            "registrationSuccess": "Registration successful! Reception ID",
            "reviewInfo": "Registered Information Review",
            "errors": {
                "fullNameRequired": "Please enter full name",
                "dobRequired": "Select date of birth",
                "genderRequired": "Select gender",
                "phoneInvalid": "Phone number 8-15 digits",
                "departmentRequired": "Select department",
                "dateRequired": "Select date",
                "timeRequired": "Select time",
                "servicesRequired": "Select at least 1 ancillary service"
            },

            // Patient Form
            "patientForm": {
                "title": "Patient Information",
                "existingPatient": "Existing Patient",
                "newPatient": "New Patient",
                "newPatientHint": "New patient - Please complete all required information (* required)",
                "existingPatientHint": "Existing patient information - Can be updated if there are changes",
                "searchExistingPatient": "Search existing patient",
                "createNewPatient": "Create new patient",
                "clearForm": "Clear form",
                "fields": {
                    "fullName": "Full Name",
                    "dob": "Date of Birth",
                    "gender": "Gender",
                    "selectGender": "Select gender",
                    "male": "Male",
                    "female": "Female",
                    "other": "Other",
                    "nationalId": "ID Card/Passport",
                    "phone": "Phone Number",
                    "insurance": "Private Insurance",
                    "address": "Address"
                },
                "placeholders": {
                    "fullName": "e.g., Nguyen Van A",
                    "nationalId": "12 digits",
                    "phone": "0912345678",
                    "insurance": "Select or enter insurance",
                    "address": "House number, street, ward/commune, district, city/province"
                },
                "searchModal": {
                    "title": "Search Patient",
                    "description": "Search for existing patients in the system by name, ID card or phone number",
                    "placeholder": "Search by name, ID card, phone number...",
                    "searching": "Searching...",
                    "noResults": "No matching patients found",
                    "enterKeyword": "Enter keyword to search",
                    "notAvailable": "Not available",
                    "selected": "Selected",
                    "resultsCount": "Found {{count}} patients • Select or create new"
                },
                "insuranceModal": {
                    "title": "Select Insurance",
                    "placeholder": "Search insurance...",
                    "hint": "Or enter directly in the insurance field"
                },
                "insurances": {
                    "baoViet": "Bao Viet Insurance",
                    "bidv": "BIDV Insurance",
                    "prudential": "Prudential Insurance",
                    "manulife": "Manulife Insurance",
                    "aia": "AIA Insurance",
                    "sunLife": "Sun Life Insurance",
                    "generali": "Generali Insurance",
                    "mic": "MIC Insurance"
                }
            }
        }
    },
    vi: {
        translation: {
            // Common
            "hospitalName": "Bệnh Viện Sài Gòn ITO",
            "hospitalSubtitle": "Nâng cao chất lượng chăm sóc sức khỏe",
            "welcome": "Chào mừng",
            "save": "Lưu",
            "cancel": "Hủy",
            "submit": "Gửi",
            "delete": "Xóa",
            "edit": "Sửa",
            "loading": "Đang tải...",
            "error": "Lỗi",
            "success": "Thành công",
            "confirm": "Xác nhận",
            "back": "Quay lại",
            "next": "Tiếp theo",
            "search": "Tìm kiếm",
            "filter": "Lọc",
            "export": "Xuất file",
            "print": "In",
            "download": "Tải xuống",
            "themeToggle": "Chuyển đổi giao diện",
            "switchToDark": "Chuyển sang chế độ tối",
            "switchToLight": "Chuyển sang chế độ sáng",
            "expand": "Mở rộng",
            "collapse": "Thu gọn",
            "selectFeatureFromMenu": "Vui lòng chọn chức năng từ menu bên trái",

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
            "todayPatients": "Bệnh nhân hôm nay",
            "revenue": "Doanh thu",
            "appointments": "Lịch hẹn",
            "monthlyRevenue": "Doanh thu tháng",
            "patientStatistics": "Thống kê bệnh nhân",
            "departmentStats": "Thống kê khoa phòng",
            "recentActivities": "Hoạt động gần đây",
            "quickActions": "Thao tác nhanh",
            "viewAll": "Xem tất cả",
            "todayAppointments": "Cuộc hẹn hôm nay",
            "waitingPatients": "Bệnh nhân chờ",
            "availableDoctors": "Bác sĩ có mặt",
            "occupiedBeds": "Giường bệnh",
            "serviceRate": "Tỷ lệ phục vụ",
            "appointmentsByWeek": "Lượt hẹn theo tuần",
            "patientDistribution": "Phân bố bệnh nhân theo khoa",
            "todayActivities": "Hoạt động hôm nay",
            "newAdmissions": "Tiếp nhận mới",
            "testsProcessed": "Xét nghiệm đã xử lý",
            "discharged": "Xuất viện",
            "emergencyCases": "Cấp cứu",
            "alerts": "Cảnh báo",
            "patientsWaiting": "bệnh nhân chờ cấp cứu",
            "maintenanceRequired": "Máy X-quang cần bảo trì",
            "allDepartments": "Tất cả khoa đang hoạt động",
            "accumulated": "Tích lũy",
            "onDuty": "Đang trực",
            "today": "Hôm nay",
            "thisMonth": "Tháng này",
            "bedsUsed": "sử dụng",
            "patients": "bệnh nhân",
            "samples": "mẫu",
            "cases": "ca",

            // Days of week
            "monday": "T2",
            "tuesday": "T3",
            "wednesday": "T4",
            "thursday": "T5",
            "friday": "T6",
            "saturday": "T7",
            "sunday": "CN",

            // Departments
            "emergency": "Cấp Cứu",
            "treatment": "Điều Trị",
            "orthopedics": "Chấn Thương Chỉnh Hình",

            // Registration
            "registrationTitle": "Tiếp nhận bệnh nhân & Đăng ký dịch vụ",
            "registrationSubtitle": "Quản lý thông tin tiếp nhận và dịch vụ cận lâm sàng",
            "patientInfo": "Thông tin bệnh nhân",
            "appointmentInfo": "Thông tin lịch hẹn",
            "ancillaryServices": "Dịch vụ cận lâm sàng",
            "submitRegistration": "Gửi đăng ký",
            "resetAll": "Xóa hết",
            "processing": "Đang xử lý...",
            "registrationSuccess": "Đăng ký thành công! Mã tiếp nhận",
            "reviewInfo": "Thông tin đã đăng ký",
            "errors": {
                "fullNameRequired": "Vui lòng nhập họ tên",
                "dobRequired": "Chọn ngày sinh",
                "genderRequired": "Chọn giới tính",
                "phoneInvalid": "SĐT 8-15 chữ số",
                "departmentRequired": "Chọn khoa khám",
                "dateRequired": "Chọn ngày",
                "timeRequired": "Chọn giờ",
                "servicesRequired": "Chọn ít nhất 1 dịch vụ cận lâm sàng"
            },

            // Patient Form
            "patientForm": {
                "title": "Thông tin người bệnh",
                "existingPatient": "Bệnh nhân cũ",
                "newPatient": "Bệnh nhân mới",
                "newPatientHint": "Bệnh nhân mới - Vui lòng nhập đầy đủ thông tin (* bắt buộc)",
                "existingPatientHint": "Thông tin bệnh nhân cũ - Có thể cập nhật nếu có thay đổi",
                "searchExistingPatient": "Tìm bệnh nhân cũ",
                "createNewPatient": "Tạo bệnh nhân mới",
                "clearForm": "Xóa form",
                "fields": {
                    "fullName": "Họ và tên",
                    "dob": "Ngày sinh",
                    "gender": "Giới tính",
                    "selectGender": "Chọn giới tính",
                    "male": "Nam",
                    "female": "Nữ",
                    "other": "Khác",
                    "nationalId": "Số CCCD/Hộ chiếu",
                    "phone": "Số điện thoại",
                    "insurance": "Bảo hiểm tư nhân",
                    "address": "Địa chỉ"
                },
                "placeholders": {
                    "fullName": "VD: Nguyễn Văn A",
                    "nationalId": "12 số",
                    "phone": "0912345678",
                    "insurance": "Chọn hoặc nhập bảo hiểm",
                    "address": "Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                },
                "searchModal": {
                    "title": "Tìm bệnh nhân",
                    "description": "Tìm bệnh nhân đã có trong hệ thống theo tên, CCCD hoặc số điện thoại",
                    "placeholder": "Tìm theo tên, số CCCD, số điện thoại...",
                    "searching": "Đang tìm kiếm...",
                    "noResults": "Không tìm thấy bệnh nhân phù hợp",
                    "enterKeyword": "Nhập từ khóa để tìm kiếm",
                    "notAvailable": "Chưa có",
                    "selected": "Đang chọn",
                    "resultsCount": "Tìm thấy {{count}} bệnh nhân • Chọn hoặc tạo mới"
                },
                "insuranceModal": {
                    "title": "Chọn bảo hiểm",
                    "placeholder": "Tìm bảo hiểm...",
                    "hint": "Hoặc nhập trực tiếp vào ô bảo hiểm"
                },
                "insurances": {
                    "baoViet": "Bảo hiểm Bảo Việt",
                    "bidv": "Bảo hiểm BIDV",
                    "prudential": "Bảo hiểm Prudential",
                    "manulife": "Bảo hiểm Manulife",
                    "aia": "Bảo hiểm AIA",
                    "sunLife": "Bảo hiểm Sun Life",
                    "generali": "Bảo hiểm Generali",
                    "mic": "Bảo hiểm MIC"
                }
            }
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