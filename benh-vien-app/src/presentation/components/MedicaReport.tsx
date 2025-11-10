// src/components/MedicalReports.tsx
import React, { useState, useEffect, useRef } from 'react';

// Import đúng cách cho Stimulsoft Reports.JS
import 'stimulsoft-reports-js/Scripts/stimulsoft.reports';
import 'stimulsoft-reports-js/Scripts/stimulsoft.viewer';
import 'stimulsoft-reports-js/Scripts/stimulsoft.designer';

// Import styles
import 'stimulsoft-reports-js/Css/stimulsoft.viewer.office2013.whiteblue.css';
import 'stimulsoft-reports-js/Css/stimulsoft.designer.office2013.whiteblue.css';

// Khai báo global models
declare global {
    namespace Stimulsoft {
        namespace Report {
            class StiReport {
                load(json: any): void;
                loadDocument(json: any): void;
                regData(data: any): void;
                renderAsync(): Promise<void>;
                exportDocumentAsync(callback: (data: any) => void, format: any): void;
            }
        }

        namespace Viewer {
            class StiViewer {
                constructor(options: any, id: string, init?: boolean);
                renderHtml(element: HTMLElement): void;
                report: any;
                destroy(): void;
            }

            class StiViewerOptions {
                appearance: {
                    scrollbarsMode: boolean;
                };
                toolbar: {
                    displayMode: string;
                };
            }
        }

        namespace Designer {
            class StiDesigner {
                constructor(options: any, id: string, init?: boolean);
                renderHtml(element: HTMLElement): void;
                report: any;
                destroy(): void;
            }

            class StiDesignerOptions {
                appearance: {
                    fullScreenMode: boolean;
                };
            }
        }

        namespace Report {
            namespace Export {
                namespace Settings {
                    class StiPdfExportSettings {}
                }
            }
        }

        // Export formats
        const StiExportFormat: {
            Pdf: any;
            Excel: any;
            Word: any;
            ExcelXml: any;
        };
    }
}

// Mock data for medical reports
const MOCK_MEDICAL_DATA = {
    patients: [
        {
            id: 'BN001',
            name: 'Nguyễn Văn A',
            age: 35,
            gender: 'Nam',
            address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
            phone: '0912345678',
            diagnosis: 'Viêm phế quản cấp',
            admissionDate: '2024-01-15',
            dischargeDate: '2024-01-20',
            doctor: 'BS. Trần Văn B',
            department: 'Khoa Hô hấp',
            totalCost: 7500000,
            services: [
                { name: 'Khám bệnh', cost: 300000 },
                { name: 'Xét nghiệm máu', cost: 450000 },
                { name: 'Chụp X-Quang ngực', cost: 350000 },
                { name: 'Thuốc điều trị', cost: 6400000 }
            ]
        },
        {
            id: 'BN002',
            name: 'Trần Thị B',
            age: 28,
            gender: 'Nữ',
            address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
            phone: '0923456789',
            diagnosis: 'Viêm dạ dày cấp',
            admissionDate: '2024-01-18',
            dischargeDate: '2024-01-22',
            doctor: 'BS. Lê Thị C',
            department: 'Khoa Tiêu hóa',
            totalCost: 5200000,
            services: [
                { name: 'Khám bệnh', cost: 300000 },
                { name: 'Nội soi dạ dày', cost: 1200000 },
                { name: 'Xét nghiệm', cost: 700000 },
                { name: 'Thuốc điều trị', cost: 3000000 }
            ]
        },
        {
            id: 'BN003',
            name: 'Lê Văn C',
            age: 45,
            gender: 'Nam',
            address: '789 Đường Pasteur, Quận 3, TP.HCM',
            phone: '0934567890',
            diagnosis: 'Tăng huyết áp',
            admissionDate: '2024-01-20',
            dischargeDate: '2024-01-25',
            doctor: 'BS. Phạm Văn D',
            department: 'Khoa Tim mạch',
            totalCost: 6800000,
            services: [
                { name: 'Khám bệnh', cost: 300000 },
                { name: 'Đo điện tim', cost: 250000 },
                { name: 'Xét nghiệm máu', cost: 450000 },
                { name: 'Siêu âm tim', cost: 800000 },
                { name: 'Thuốc điều trị', cost: 5000000 }
            ]
        },
        {
            id: 'BN004',
            name: 'Phạm Thị D',
            age: 52,
            gender: 'Nữ',
            address: '321 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM',
            phone: '0945678901',
            diagnosis: 'Tiểu đường type 2',
            admissionDate: '2024-01-22',
            dischargeDate: '2024-01-28',
            doctor: 'BS. Nguyễn Văn E',
            department: 'Khoa Nội tiết',
            totalCost: 4300000,
            services: [
                { name: 'Khám bệnh', cost: 300000 },
                { name: 'Xét nghiệm đường huyết', cost: 350000 },
                { name: 'Theo dõi 24h', cost: 1200000 },
                { name: 'Thuốc điều trị', cost: 2450000 }
            ]
        }
    ],
    departments: [
        { id: 'KH001', name: 'Khoa Hô hấp', patientCount: 45, revenue: 125000000 },
        { id: 'KH002', name: 'Khoa Tiêu hóa', patientCount: 38, revenue: 98000000 },
        { id: 'KH003', name: 'Khoa Tim mạch', patientCount: 52, revenue: 156000000 },
        { id: 'KH004', name: 'Khoa Nội tổng quát', patientCount: 67, revenue: 89000000 },
        { id: 'KH005', name: 'Khoa Ngoại', patientCount: 42, revenue: 210000000 },
        { id: 'KH006', name: 'Khoa Nội tiết', patientCount: 28, revenue: 76000000 }
    ],
    revenueByMonth: [
        { month: 'Tháng 1', revenue: 450000000, patients: 245 },
        { month: 'Tháng 2', revenue: 520000000, patients: 278 },
        { month: 'Tháng 3', revenue: 480000000, patients: 256 },
        { month: 'Tháng 4', revenue: 610000000, patients: 312 },
        { month: 'Tháng 5', revenue: 580000000, patients: 298 },
        { month: 'Tháng 6', revenue: 670000000, patients: 345 }
    ]
};

const MedicalReports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'viewer' | 'designer'>('viewer');
    const [selectedReport, setSelectedReport] = useState<string>('PATIENT_LIST');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [reportGenerated, setReportGenerated] = useState<boolean>(false);

    const viewerRef = useRef<HTMLDivElement>(null);
    const designerRef = useRef<HTMLDivElement>(null);

    const viewer = useRef<Stimulsoft.Viewer.StiViewer>();
    const designer = useRef<Stimulsoft.Designer.StiDesigner>();
    const report = useRef<Stimulsoft.Report.StiReport>();

    // Initialize Stimulsoft components
    useEffect(() => {
        initializeComponents();

        return () => {
            cleanupComponents();
        };
    }, []);

    const initializeComponents = () => {
        // Initialize viewer
        if (viewerRef.current) {
            const viewerOptions = {
                appearance: {
                    scrollbarsMode: true
                },
                toolbar: {
                    displayMode: 'Simple'
                }
            };

            viewer.current = new Stimulsoft.Viewer.StiViewer(viewerOptions, 'StiViewer', false);
            viewer.current.renderHtml(viewerRef.current);
        }

        // Initialize designer
        if (designerRef.current) {
            const designerOptions = {
                appearance: {
                    fullScreenMode: false
                }
            };

            designer.current = new Stimulsoft.Designer.StiDesigner(designerOptions, 'StiDesigner', false);
            designer.current.renderHtml(designerRef.current);
        }
    };

    const cleanupComponents = () => {
        if (viewer.current) {
            try {
                viewer.current.destroy();
            } catch (e) {
                console.warn('Error destroying viewer:', e);
            }
        }
        if (designer.current) {
            try {
                designer.current.destroy();
            } catch (e) {
                console.warn('Error destroying designer:', e);
            }
        }
    };

    const loadReportData = (reportType: string) => {
        switch (reportType) {
            case 'PATIENT_LIST':
                return {
                    Patients: MOCK_MEDICAL_DATA.patients.map(p => ({
                        Id: p.id,
                        Name: p.name,
                        Age: p.age,
                        Gender: p.gender,
                        Diagnosis: p.diagnosis,
                        Doctor: p.doctor,
                        Department: p.department,
                        AdmissionDate: p.admissionDate,
                        DischargeDate: p.dischargeDate,
                        TotalCost: p.totalCost.toLocaleString('vi-VN') + ' VNĐ'
                    }))
                };

            case 'REVENUE_REPORT':
                return {
                    Revenue: MOCK_MEDICAL_DATA.revenueByMonth.map(r => ({
                        Month: r.month,
                        Revenue: r.revenue.toLocaleString('vi-VN') + ' VNĐ',
                        Patients: r.patients,
                        RevenueNumber: r.revenue
                    }))
                };

            case 'DEPARTMENT_REPORT':
                return {
                    Departments: MOCK_MEDICAL_DATA.departments.map(d => ({
                        Name: d.name,
                        PatientCount: d.patientCount,
                        Revenue: d.revenue.toLocaleString('vi-VN') + ' VNĐ',
                        RevenueNumber: d.revenue
                    }))
                };

            default:
                return { Patients: MOCK_MEDICAL_DATA.patients };
        }
    };

    const createPatientListReport = () => {
        return {
            "Name": "PatientListReport",
            "Pages": [
                {
                    "Name": "Page1",
                    "Bands": {
                        "PageHeaderBand1": {
                            "Height": 2.0,
                            "Components": [
                                {
                                    "Type": "StiText",
                                    "Name": "ReportTitle",
                                    "ClientRectangle": "0,0,8,0.8",
                                    "Text": "BÁO CÁO DANH SÁCH BỆNH NHÂN",
                                    "Font": "Arial,16,Bold",
                                    "HorAlignment": "Center",
                                    "VertAlignment": "Center",
                                    "Brush": {
                                        "Type": "StiSolidBrush",
                                        "Color": "#f0f9ff"
                                    }
                                },
                                {
                                    "Type": "StiText",
                                    "Name": "HeaderId",
                                    "ClientRectangle": "0,1,1,0.5",
                                    "Text": "MÃ BN",
                                    "Font": "Arial,10,Bold",
                                    "HorAlignment": "Center",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                },
                                {
                                    "Type": "StiText",
                                    "Name": "HeaderName",
                                    "ClientRectangle": "1,1,2,0.5",
                                    "Text": "HỌ TÊN",
                                    "Font": "Arial,10,Bold",
                                    "HorAlignment": "Center",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                },
                                {
                                    "Type": "StiText",
                                    "Name": "HeaderDiagnosis",
                                    "ClientRectangle": "3,1,2,0.5",
                                    "Text": "CHẨN ĐOÁN",
                                    "Font": "Arial,10,Bold",
                                    "HorAlignment": "Center",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                },
                                {
                                    "Type": "StiText",
                                    "Name": "HeaderDepartment",
                                    "ClientRectangle": "5,1,1.5,0.5",
                                    "Text": "KHOA",
                                    "Font": "Arial,10,Bold",
                                    "HorAlignment": "Center",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                },
                                {
                                    "Type": "StiText",
                                    "Name": "HeaderCost",
                                    "ClientRectangle": "6.5,1,1.5,0.5",
                                    "Text": "TỔNG CHI PHÍ",
                                    "Font": "Arial,10,Bold",
                                    "HorAlignment": "Center",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                }
                            ]
                        },
                        "DataBand1": {
                            "DataSourceName": "Patients",
                            "Height": 0.5,
                            "Components": [
                                {
                                    "Type": "StiText",
                                    "Name": "TextId",
                                    "ClientRectangle": "0,0,1,0.5",
                                    "Text": "{Patients.Id}",
                                    "Font": "Arial,9",
                                    "HorAlignment": "Center",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                },
                                {
                                    "Type": "StiText",
                                    "Name": "TextName",
                                    "ClientRectangle": "1,0,2,0.5",
                                    "Text": "{Patients.Name}",
                                    "Font": "Arial,9",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                },
                                {
                                    "Type": "StiText",
                                    "Name": "TextDiagnosis",
                                    "ClientRectangle": "3,0,2,0.5",
                                    "Text": "{Patients.Diagnosis}",
                                    "Font": "Arial,9",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                },
                                {
                                    "Type": "StiText",
                                    "Name": "TextDepartment",
                                    "ClientRectangle": "5,0,1.5,0.5",
                                    "Text": "{Patients.Department}",
                                    "Font": "Arial,9",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                },
                                {
                                    "Type": "StiText",
                                    "Name": "TextCost",
                                    "ClientRectangle": "6.5,0,1.5,0.5",
                                    "Text": "{Patients.TotalCost}",
                                    "Font": "Arial,9",
                                    "HorAlignment": "Right",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                }
                            ]
                        },
                        "PageFooterBand1": {
                            "Height": 0.8,
                            "Components": [
                                {
                                    "Type": "StiText",
                                    "Name": "FooterText",
                                    "ClientRectangle": "0,0,8,0.5",
                                    "Text": "Bệnh viện Saigon ITO - Ngày xuất báo cáo: {Today}",
                                    "Font": "Arial,9,Italic",
                                    "HorAlignment": "Center",
                                    "VertAlignment": "Center"
                                }
                            ]
                        }
                    }
                }
            ],
            "DataSources": [
                {
                    "Name": "Patients",
                    "Columns": [
                        {"Name": "Id", "Type": "string"},
                        {"Name": "Name", "Type": "string"},
                        {"Name": "Diagnosis", "Type": "string"},
                        {"Name": "Department", "Type": "string"},
                        {"Name": "TotalCost", "Type": "string"}
                    ]
                }
            ]
        };
    };

    const createRevenueReport = () => {
        return {
            "Name": "RevenueReport",
            "Pages": [
                {
                    "Name": "Page1",
                    "Bands": {
                        "PageHeaderBand1": {
                            "Height": 2.0,
                            "Components": [
                                {
                                    "Type": "StiText",
                                    "Name": "ReportTitle",
                                    "ClientRectangle": "0,0,8,0.8",
                                    "Text": "BÁO CÁO DOANH THU THEO THÁNG",
                                    "Font": "Arial,16,Bold",
                                    "HorAlignment": "Center",
                                    "VertAlignment": "Center",
                                    "Brush": {
                                        "Type": "StiSolidBrush",
                                        "Color": "#f0f9ff"
                                    }
                                },
                                {
                                    "Type": "StiText",
                                    "Name": "HeaderMonth",
                                    "ClientRectangle": "0,1,2,0.5",
                                    "Text": "THÁNG",
                                    "Font": "Arial,10,Bold",
                                    "HorAlignment": "Center",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                },
                                {
                                    "Type": "StiText",
                                    "Name": "HeaderPatients",
                                    "ClientRectangle": "2,1,2,0.5",
                                    "Text": "SỐ BỆNH NHÂN",
                                    "Font": "Arial,10,Bold",
                                    "HorAlignment": "Center",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                },
                                {
                                    "Type": "StiText",
                                    "Name": "HeaderRevenue",
                                    "ClientRectangle": "4,1,4,0.5",
                                    "Text": "DOANH THU (VNĐ)",
                                    "Font": "Arial,10,Bold",
                                    "HorAlignment": "Center",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                }
                            ]
                        },
                        "DataBand1": {
                            "DataSourceName": "Revenue",
                            "Height": 0.5,
                            "Components": [
                                {
                                    "Type": "StiText",
                                    "Name": "TextMonth",
                                    "ClientRectangle": "0,0,2,0.5",
                                    "Text": "{Revenue.Month}",
                                    "Font": "Arial,9",
                                    "HorAlignment": "Center",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                },
                                {
                                    "Type": "StiText",
                                    "Name": "TextPatients",
                                    "ClientRectangle": "2,0,2,0.5",
                                    "Text": "{Revenue.Patients}",
                                    "Font": "Arial,9",
                                    "HorAlignment": "Center",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                },
                                {
                                    "Type": "StiText",
                                    "Name": "TextRevenue",
                                    "ClientRectangle": "4,0,4,0.5",
                                    "Text": "{Revenue.Revenue}",
                                    "Font": "Arial,9",
                                    "HorAlignment": "Right",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                }
                            ]
                        },
                        "ReportSummaryBand1": {
                            "Height": 0.6,
                            "Components": [
                                {
                                    "Type": "StiText",
                                    "Name": "TotalLabel",
                                    "ClientRectangle": "0,0,4,0.5",
                                    "Text": "TỔNG CỘNG:",
                                    "Font": "Arial,10,Bold",
                                    "HorAlignment": "Right",
                                    "VertAlignment": "Center"
                                },
                                {
                                    "Type": "StiText",
                                    "Name": "TotalRevenue",
                                    "ClientRectangle": "4,0,4,0.5",
                                    "Text": "{Sum(Revenue.RevenueNumber)} VNĐ",
                                    "Font": "Arial,10,Bold",
                                    "HorAlignment": "Right",
                                    "VertAlignment": "Center",
                                    "Border": "All"
                                }
                            ]
                        }
                    }
                }
            ],
            "DataSources": [
                {
                    "Name": "Revenue",
                    "Columns": [
                        {"Name": "Month", "Type": "string"},
                        {"Name": "Revenue", "Type": "string"},
                        {"Name": "Patients", "Type": "int"},
                        {"Name": "RevenueNumber", "Type": "decimal"}
                    ]
                }
            ]
        };
    };

    const generateReport = async () => {
        setIsLoading(true);

        try {
            // Create new report instance
            report.current = new Stimulsoft.Report.StiReport();

            let reportTemplate: any;

            // Select template based on report type
            switch (selectedReport) {
                case 'PATIENT_LIST':
                    reportTemplate = createPatientListReport();
                    break;
                case 'REVENUE_REPORT':
                    reportTemplate = createRevenueReport();
                    break;
                case 'DEPARTMENT_REPORT':
                    reportTemplate = createRevenueReport(); // Reuse for now
                    break;
                default:
                    reportTemplate = createPatientListReport();
            }

            // Load report template
            report.current.load(reportTemplate);

            // Load data
            const data = loadReportData(selectedReport);
            report.current.regData(data);

            // Render report
            await report.current.renderAsync();

            // Assign report to viewer/designer
            if (activeTab === 'viewer' && viewer.current) {
                viewer.current.report = report.current;
            } else if (activeTab === 'designer' && designer.current) {
                designer.current.report = report.current;
            }

            setReportGenerated(true);

        } catch (error) {
            console.error('Error generating report:', error);
            alert('Có lỗi xảy ra khi tạo báo cáo. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const exportReport = (format: 'Pdf' | 'Excel' | 'Word') => {
        if (!report.current) {
            alert('Vui lòng tạo báo cáo trước khi xuất file.');
            return;
        }

        try {
            let exportFormat: any;
            let fileExtension: string;
            let mimeType: string;

            switch (format) {
                case 'Pdf':
                    exportFormat = Stimulsoft.StiExportFormat.Pdf;
                    fileExtension = 'pdf';
                    mimeType = 'application/pdf';
                    break;
                case 'Excel':
                    exportFormat = Stimulsoft.StiExportFormat.Excel;
                    fileExtension = 'xlsx';
                    mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    break;
                case 'Word':
                    exportFormat = Stimulsoft.StiExportFormat.Word;
                    fileExtension = 'docx';
                    mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                    break;
                default:
                    return;
            }

            report.current.exportDocumentAsync((data: any) => {
                if (data) {
                    const blob = new Blob([data], { type: mimeType });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;

                    const reportName = selectedReport === 'PATIENT_LIST' ? 'danh-sach-benh-nhan' :
                        selectedReport === 'REVENUE_REPORT' ? 'bao-cao-doanh-thu' : 'thong-ke-khoa-phong';

                    link.download = `${reportName}.${fileExtension}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                }
            }, exportFormat);

        } catch (error) {
            console.error('Error exporting report:', error);
            alert('Có lỗi xảy ra khi xuất file. Vui lòng thử lại.');
        }
    };

    const handleTabChange = (tab: 'viewer' | 'designer') => {
        setActiveTab(tab);
        if (report.current && reportGenerated) {
            setTimeout(() => {
                if (tab === 'viewer' && viewer.current) {
                    viewer.current.report = report.current;
                } else if (tab === 'designer' && designer.current) {
                    designer.current.report = report.current;
                }
            }, 100);
        }
    };

    return (
        <div className="medical-reports">
            {/* Header */}
            <div className="reports-header">
                <h1>Hệ Thống Báo Cáo Y Tế</h1>
                <p>Quản lý và tạo báo cáo thống kê y tế</p>
            </div>

            {/* Controls Panel */}
            <div className="controls-panel">
                <div className="report-selection">
                    <label>Loại báo cáo:</label>
                    <select
                        value={selectedReport}
                        onChange={(e) => setSelectedReport(e.target.value)}
                        className="report-select"
                    >
                        <option value="PATIENT_LIST">Danh sách bệnh nhân</option>
                        <option value="REVENUE_REPORT">Báo cáo doanh thu</option>
                        <option value="DEPARTMENT_REPORT">Thống kê khoa phòng</option>
                    </select>

                    <button
                        onClick={generateReport}
                        disabled={isLoading}
                        className="btn primary generate-btn"
                    >
                        {isLoading ? (
                            <>
                                <div className="loading-spinner-small"></div>
                                Đang tạo...
                            </>
                        ) : (
                            '📊 Tạo báo cáo'
                        )}
                    </button>
                </div>

                <div className="export-buttons">
                    <button
                        onClick={() => exportReport('Pdf')}
                        disabled={!reportGenerated}
                        className="btn secondary"
                    >
                        📄 Export PDF
                    </button>
                    <button
                        onClick={() => exportReport('Excel')}
                        disabled={!reportGenerated}
                        className="btn secondary"
                    >
                        📊 Export Excel
                    </button>
                    <button
                        onClick={() => exportReport('Word')}
                        disabled={!reportGenerated}
                        className="btn secondary"
                    >
                        📝 Export Word
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="report-tabs">
                <button
                    className={`tab-btn ${activeTab === 'viewer' ? 'active' : ''}`}
                    onClick={() => handleTabChange('viewer')}
                >
                    👁️ Xem báo cáo
                </button>
                <button
                    className={`tab-btn ${activeTab === 'designer' ? 'active' : ''}`}
                    onClick={() => handleTabChange('designer')}
                >
                    🎨 Thiết kế báo cáo
                </button>
            </div>

            {/* Report Containers */}
            <div className="report-container">
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                        <div style={{ marginTop: '16px', color: '#64748b' }}>Đang tạo báo cáo...</div>
                    </div>
                )}

                {activeTab === 'viewer' && (
                    <div
                        ref={viewerRef}
                        className="report-viewer"
                        style={{
                            height: '600px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0 0 8px 8px',
                            position: 'relative'
                        }}
                    />
                )}

                {activeTab === 'designer' && (
                    <div
                        ref={designerRef}
                        className="report-designer"
                        style={{
                            height: '600px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0 0 8px 8px',
                            position: 'relative'
                        }}
                    />
                )}
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <h3>Thống kê nhanh</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <div className="stat-value">{MOCK_MEDICAL_DATA.patients.length}</div>
                            <div className="stat-label">Bệnh nhân</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-info">
                            <div className="stat-value">
                                {Math.round(MOCK_MEDICAL_DATA.revenueByMonth.reduce((sum, r) => sum + r.revenue, 0) / 1000000)} tr
                            </div>
                            <div className="stat-label">Tổng doanh thu</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🏥</div>
                        <div className="stat-info">
                            <div className="stat-value">{MOCK_MEDICAL_DATA.departments.length}</div>
                            <div className="stat-label">Khoa phòng</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📈</div>
                        <div className="stat-info">
                            <div className="stat-value">
                                {Math.round(MOCK_MEDICAL_DATA.revenueByMonth[MOCK_MEDICAL_DATA.revenueByMonth.length - 1].revenue / 1000000)} tr
                            </div>
                            <div className="stat-label">Doanh thu tháng này</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Styles
const reportsStyles = `
.medical-reports {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
}

.reports-header {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;
}

.reports-header h1 {
  margin: 0;
  color: #1e293b;
  font-size: 28px;
}

.reports-header p {
  margin: 8px 0 0 0;
  color: #64748b;
  font-size: 16px;
}

.controls-panel {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.report-selection {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.report-selection label {
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.report-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-width: 200px;
  background: white;
}

.export-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background: #3b82f6;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn.secondary {
  background: #f1f5f9;
  color: #374151;
  border: 1px solid #e2e8f0;
}

.btn.secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

.generate-btn {
  padding: 10px 20px;
}

.report-tabs {
  display: flex;
  background: white;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-btn {
  flex: 1;
  padding: 16px 24px;
  border: none;
  background: #f8fafc;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-btn.active {
  background: white;
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
}

.tab-btn:hover:not(.active) {
  background: #f1f5f9;
}

.report-container {
  background: white;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
  position: relative;
}

.quick-stats {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.quick-stats h3 {
  margin: 0 0 20px 0;
  color: #1e293b;
  font-size: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  gap: 16px;
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

/* Loading states */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .medical-reports {
    padding: 12px;
  }
  
  .controls-panel {
    flex-direction: column;
    align-items: stretch;
  }
  
  .report-selection {
    flex-direction: column;
    align-items: stretch;
  }
  
  .report-select {
    min-width: auto;
  }
  
  .export-buttons {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .report-tabs {
    flex-direction: column;
  }
  
  .tab-btn {
    padding: 12px 16px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .controls-panel {
    padding: 16px;
  }
  
  .reports-header {
    padding: 20px;
  }
  
  .reports-header h1 {
    font-size: 24px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .medical-reports {
    background: #1e293b;
    color: #f1f5f9;
  }
  
  .reports-header,
  .controls-panel,
  .report-tabs,
  .report-container,
  .quick-stats {
    background: #334155;
    color: #f1f5f9;
  }
  
  .report-select {
    background: #475569;
    color: #f1f5f9;
    border-color: #64748b;
  }
  
  .stat-card {
    background: #475569;
    border-color: #64748b;
  }
  
  .stat-icon {
    background: #334155;
  }
  
  .tab-btn {
    background: #475569;
    color: #cbd5e1;
  }
  
  .tab-btn.active {
    background: #334155;
    color: #60a5fa;
  }
}

/* Print styles */
@media print {
  .controls-panel,
  .report-tabs,
  .quick-stats {
    display: none !important;
  }
  
  .medical-reports {
    background: white;
    padding: 0;
  }
  
  .reports-header {
    box-shadow: none;
    margin-bottom: 10px;
  }
}

/* Custom scrollbar for report containers */
.report-viewer ::-webkit-scrollbar,
.report-designer ::-webkit-scrollbar {
  width: 8px;
}

.report-viewer ::-webkit-scrollbar-track,
.report-designer ::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.report-viewer ::-webkit-scrollbar-thumb,
.report-designer ::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.report-viewer ::-webkit-scrollbar-thumb:hover,
.report-designer ::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus styles for accessibility */
.btn:focus-visible,
.report-select:focus-visible,
.tab-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Animation for smooth transitions */
.controls-panel,
.report-tabs,
.report-container,
.quick-stats {
  transition: all 0.3s ease;
}

/* Status indicators */
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-indicator.success {
  background: #dcfce7;
  color: #166534;
}

.status-indicator.warning {
  background: #fef3c7;
  color: #92400e;
}

.status-indicator.error {
  background: #fee2e2;
  color: #dc2626;
}

/* Tooltip styles */
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltip-text {
  visibility: hidden;
  width: 200px;
  background: #1e293b;
  color: white;
  text-align: center;
  border-radius: 6px;
  padding: 8px;
  position: absolute;
  z-index: 1000;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 12px;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

/* Additional utility classes */
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.mt-4 {
  margin-top: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}

.p-4 {
  padding: 16px;
}

.hidden {
  display: none;
}

/* Ensure Stimulsoft components are properly styled */
.stiJsViewerReportPanel {
  border: none !important;
}

.stiJsViewerPage {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

/* Custom report container adjustments */
.report-viewer > div,
.report-designer > div {
  border-radius: 0 0 8px 8px !important;
}

/* Button group styles */
.btn-group {
  display: flex;
  gap: 8px;
}

.btn-group .btn {
  border-radius: 6px;
}

/* Form controls */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-control {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Alert styles */
.alert {
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
}

.alert.info {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
}

.alert.warning {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

.alert.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}

/* Card styles */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 16px;
}

.card-header {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1e293b;
}

/* Grid system */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8px;
}

.col {
  flex: 1;
  padding: 0 8px;
}

.col-6 {
  flex: 0 0 50%;
  padding: 0 8px;
}

.col-4 {
  flex: 0 0 33.333%;
  padding: 0 8px;
}

/* Final responsive adjustments */
@media (max-width: 1024px) {
  .col-6,
  .col-4 {
    flex: 0 0 100%;
    margin-bottom: 16px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .btn {
    border: 2px solid;
  }
  
  .report-select {
    border: 2px solid;
  }
  
  .stat-card {
    border: 2px solid;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
  
  .loading-spinner,
  .loading-spinner-small {
    animation: none;
    border: 4px solid #e2e8f0;
    border-top-color: transparent;
  }
}
`;

// Inject styles
const style = document.createElement('style');
style.innerHTML = reportsStyles;
document.head.appendChild(style);

export default MedicalReports;