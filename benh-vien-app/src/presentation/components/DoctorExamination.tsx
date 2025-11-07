// components/DoctorExamination.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Định nghĩa types
const SmartTextArea = ({
                           value = '',
                           onChange,
                           placeholder = '',
                           rows = 3,
                           className = '',
                           onBlur, // Optional prop
                           ...props
                       }) => {
    const [cursorPosition, setCursorPosition] = useState(0);
    const [suggestion, setSuggestion] = useState('');
    const textareaRef = useRef(null);

    const getSuggestion = useCallback((currentText, cursorPos) => {
        if (!currentText || cursorPos === 0) {
            setSuggestion('');
            return;
        }

        const textBeforeCursor = currentText.substring(0, cursorPos);
        const words = textBeforeCursor.split(/\s+/);
        const lastWord = words[words.length - 1].toLowerCase();

        // Tìm gợi ý dựa trên từ cuối cùng
        const matchedAbbr = Object.entries(ABBREVIATIONS).find(([abbr]) =>
            abbr.startsWith(lastWord) && abbr !== lastWord && lastWord.length >= 2
        );

        if (matchedAbbr) {
            setSuggestion(`ENTER: ${matchedAbbr[1]} (${matchedAbbr[0]})`);
        } else {
            setSuggestion('');
        }
    }, []);

    const applySuggestion = useCallback((currentText, cursorPos) => {
        if (!suggestion) return currentText;

        const textBeforeCursor = currentText.substring(0, cursorPos);
        const textAfterCursor = currentText.substring(cursorPos);
        const words = textBeforeCursor.split(/\s+/);
        const baseText = words.slice(0, -1).join(' ') + (words.length > 1 ? ' ' : '');

        const abbrMatch = suggestion.match(/\(([^)]+)\)/);
        if (abbrMatch) {
            const fullText = suggestion.split(' (')[0].replace('ENTER: ', '');
            return baseText + fullText + ' ' + textAfterCursor;
        }

        return currentText;
    }, [suggestion]);

    const expandAbbreviation = useCallback((text) => {
        if (!text) return text;

        let expandedText = text;

        // Xử lý viết tắt đơn giản
        Object.entries(ABBREVIATIONS).forEach(([abbr, full]) => {
            const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
            expandedText = expandedText.replace(regex, full);
        });

        return expandedText;
    }, []);

    const handleChange = useCallback((e) => {
        onChange(e.target.value);
    }, [onChange]);

    const handleKeyDown = useCallback((e) => {
        // Sử dụng ENTER thay vì TAB
        if (e.key === 'Enter' && suggestion && !e.shiftKey) {
            e.preventDefault();
            const newValue = applySuggestion(value, cursorPosition);
            onChange(newValue);
            setSuggestion('');
        }
    }, [value, cursorPosition, suggestion, applySuggestion, onChange]);

    const handleSelectionChange = useCallback((e) => {
        setCursorPosition(e.target.selectionStart);
        getSuggestion(e.target.value, e.target.selectionStart);
    }, [getSuggestion]);

    const handleBlurInternal = useCallback((e) => {
        // Tự động expand abbreviation khi blur
        const expandedText = expandAbbreviation(e.target.value);
        if (expandedText !== e.target.value) {
            onChange(expandedText);
        }
        onBlur?.(e);
    }, [expandAbbreviation, onChange, onBlur]);

    return (
        <div className="smart-textarea-container">
      <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSelect={handleSelectionChange}
          onBlur={handleBlurInternal}
          placeholder={placeholder}
          rows={rows}
          className={`smart-textarea ${className}`}
          {...props}
      />
            {suggestion && (
                <div className="suggestion-hint">
                    <kbd>ENTER</kbd> {suggestion.replace('ENTER: ', '')}
                </div>
            )}
            <div className="shortcut-hints">
                <small>💡 Gõ viết tắt (vd: "cls") và nhấn ENTER để tự động hoàn thành</small>
            </div>
        </div>
    );
};

// Cấu hình viết tắt
const ABBREVIATIONS = {
    // Lý do vào viện
    'cls': 'Cận Lâm Sàng',
    'sot': 'Sốt cao',
    'ho': 'Ho khan',
    'kho tho': 'Khó thở',
    'dau bung': 'Đau bụng',
    'dau nguc': 'Đau ngực',
    'non': 'Buồn nôn, nôn',
    'tieu chay': 'Tiêu chảy',
    'dau dau': 'Đau đầu',
    'kham': 'Khám sức khỏe',
    'tai kham': 'Tái khám',

    // Tiền sử
    'ths': 'Tiền sử hút thuốc',
    'tsgd': 'Tiền sử gia đình',
    'tsbt': 'Tiền sử bản thân',
    'cao huyet ap': 'Tăng huyết áp',
    'tieu duong': 'Đái tháo đường',
    'tim mach': 'Bệnh tim mạch',
    'dung ruou': 'Sử dụng rượu bia',
    'di ung': 'Dị ứng thuốc',

    // Khám thực thể
    'bt': 'Bình thường',
    'kbt': 'Không bình thường',
    'kdd': 'Không di động',
    'dd': 'Di động',
    'ck': 'Co cứng',
    'ddk': 'Đau dữ dội',
    'n': 'Đau nhẹ',
    'v': 'Đau vừa',
    't': 'Đau nhiều',
    'ckp': 'Co kéo phản ứng',

    // Xử trí
    'ks': 'Kháng sinh',
    'gs': 'Giảm đau',
    'hs': 'Hạ sốt',
    'crs': 'Chống viêm',
    'td': 'Theo dõi',
    'tn': 'Truyền nước',
    'xk': 'Xét nghiệm',
    'cdha': 'Chẩn đoán hình ảnh',
    'ns': 'Nội soi',
    'pt': 'Phẫu thuật'
};

// Mock data
const MOCK_PATIENTS_WAITING = [
    {
        id: 1,
        registrationId: 'DK001',
        fullName: 'Nguyễn Văn A',
        dob: '1990-01-15',
        gender: 'Nam',
        phone: '0912345678',
        department: 'Khoa Nội',
        reason: 'Sốt cao, ho khan',
        priority: 'high',
        waitingTime: '15 phút',
        status: 'waiting'
    },
    {
        id: 2,
        registrationId: 'DK002',
        fullName: 'Trần Thị B',
        dob: '1985-05-20',
        gender: 'Nữ',
        phone: '0923456789',
        department: 'Khoa Nhi',
        reason: 'Khám tổng quát',
        priority: 'normal',
        waitingTime: '25 phút',
        status: 'waiting'
    },
    {
        id: 3,
        registrationId: 'DK003',
        fullName: 'Lê Văn C',
        dob: '1978-12-10',
        gender: 'Nam',
        phone: '0934567890',
        department: 'Khoa Tiêu hóa',
        reason: 'Đau bụng, buồn nôn',
        priority: 'high',
        waitingTime: '5 phút',
        status: 'waiting'
    },
    {
        id: 4,
        registrationId: 'DK004',
        fullName: 'Phạm Thị D',
        dob: '1995-08-22',
        gender: 'Nữ',
        phone: '0945678901',
        department: 'Khoa Da liễu',
        reason: 'Sốt phát ban',
        priority: 'normal',
        waitingTime: '30 phút',
        status: 'waiting'
    }
];

const MOCK_MEDICINES = [
    { id: 1, name: 'Paracetamol 500mg', dosage: 'Viên', unit: 'viên', morning: '1', noon: '1', afternoon: '1', evening: '1', note: 'Uống sau ăn' },
    { id: 2, name: 'Amoxicillin 250mg', dosage: 'Viên', unit: 'viên', morning: '2', noon: '2', afternoon: '2', evening: '2', note: 'Uống trước ăn' },
    { id: 3, name: 'Vitamin C 100mg', dosage: 'Viên', unit: 'viên', morning: '1', noon: '0', afternoon: '0', evening: '1', note: '' },
    { id: 4, name: 'Panadol Extra', dosage: 'Viên', unit: 'viên', morning: '1', noon: '0', afternoon: '1', evening: '0', note: 'Khi đau' },
    { id: 5, name: 'Gaviscon', dosage: 'Gói', unit: 'gói', morning: '1', noon: '1', afternoon: '1', evening: '1', note: 'Sau ăn' },
    { id: 6, name: 'Cefixime 200mg', dosage: 'Viên', unit: 'viên', morning: '1', noon: '0', afternoon: '1', evening: '0', note: 'Uống sau ăn' },
];

const ICD_CODES = [
    { code: 'J06.9', name: 'Nhiễm khuẩn hô hấp trên không xác định' },
    { code: 'J18.9', name: 'Viêm phổi không xác định' },
    { code: 'I10', name: 'Tăng huyết áp nguyên phát' },
    { code: 'E11.9', name: 'Đái tháo đường type 2 không biến chứng' },
    { code: 'K29.7', name: 'Viêm dạ dày không xác định' },
    { code: 'M54.5', name: 'Đau thắt lưng' },
    { code: 'J20.9', name: 'Viêm phế quản cấp không xác định' },
    { code: 'L30.9', name: 'Viêm da không xác định' },
];

const CLS_SERVICES = {
    xetNghiem: [
        { id: 1, name: 'Công thức máu', code: 'XN001', category: 'Huyết học' },
        { id: 2, name: 'Sinh hóa máu', code: 'XN002', category: 'Hóa sinh' },
        { id: 3, name: 'Đường huyết', code: 'XN003', category: 'Hóa sinh' },
        { id: 4, name: 'Chức năng gan', code: 'XN004', category: 'Hóa sinh' },
        { id: 5, name: 'Chức năng thận', code: 'XN005', category: 'Hóa sinh' },
        { id: 6, name: 'Tổng phân tích nước tiểu', code: 'XN006', category: 'Nước tiểu' },
    ],
    chanDoanHinhAnh: [
        { id: 7, name: 'X-Quang ngực thẳng', code: 'CD001', category: 'X-Quang' },
        { id: 8, name: 'X-Quang xương khớp', code: 'CD002', category: 'X-Quang' },
        { id: 9, name: 'Siêu âm ổ bụng', code: 'CD003', category: 'Siêu âm' },
        { id: 10, name: 'Siêu âm tuyến giáp', code: 'CD004', category: 'Siêu âm' },
        { id: 11, name: 'CT Scan sọ não', code: 'CD005', category: 'CT Scan' },
        { id: 12, name: 'MRI cột sống', code: 'CD006', category: 'MRI' },
    ],
    thamDoChucNang: [
        { id: 13, name: 'Điện tâm đồ', code: 'TD001', category: 'Tim mạch' },
        { id: 14, name: 'Siêu âm tim', code: 'TD002', category: 'Tim mạch' },
        { id: 15, name: 'Nội soi dạ dày', code: 'TD003', category: 'Tiêu hóa' },
        { id: 16, name: 'Đo loãng xương', code: 'TD004', category: 'Xương khớp' },
    ]
};

const DoctorExamination = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('examination');
    const [searchMedicine, setSearchMedicine] = useState('');
    const [prescription, setPrescription] = useState([]);
    const [icdSearch, setIcdSearch] = useState('');
    const [diagnosis, setDiagnosis] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [clsSearch, setClsSearch] = useState('');
    const [theme, setTheme] = useState('light');

    // Form states
    const [examinationForm, setExaminationForm] = useState({
        reason: '',
        history: '',
        personalHistory: '',
        familyHistory: '',
        physicalExam: '',
        initialTreatment: '',
        temperature: '',
        pulse: '',
        bloodPressure: '',
        respiration: '',
        spo2: '',
        weight: ''
    });

    const [summaryForm, setSummaryForm] = useState({
        clinicalProgress: '',
        testResults: '',
        mainDisease: '',
        secondaryDisease: '',
        treatmentMethod: '',
        dischargeStatus: 'Ổn định',
        additionalNotes: '',
        shortTermPrognosis: '',
        longTermPrognosis: ''
    });

    const [prescriptionForm, setPrescriptionForm] = useState({
        doctorNotes: '',
        appointmentDate: '',
        appointmentTime: '',
        appointmentNote: ''
    });


    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        setPrescriptionForm(prev => ({
            ...prev,
            appointmentDate: tomorrow.toISOString().split('T')[0],
            appointmentTime: '08:00'
        }));
    }, []);

    // Filter functions
    const filteredMedicines = MOCK_MEDICINES.filter(medicine =>
        medicine.name.toLowerCase().includes(searchMedicine.toLowerCase())
    );

    const filteredIcdCodes = ICD_CODES.filter(icd =>
        icd.code.toLowerCase().includes(icdSearch.toLowerCase()) ||
        icd.name.toLowerCase().includes(icdSearch.toLowerCase())
    );

    const filteredClsServices = Object.values(CLS_SERVICES).flat().filter(service =>
        service.name.toLowerCase().includes(clsSearch.toLowerCase()) ||
        service.code.toLowerCase().includes(clsSearch.toLowerCase())
    );

    // Handler functions
    const addToPrescription = (medicine) => {
        setPrescription(prev => [...prev, {
            ...medicine,
            id: Date.now(),
            morning: medicine.morning || '0',
            noon: medicine.noon || '0',
            afternoon: medicine.afternoon || '0',
            evening: medicine.evening || '0',
            note: medicine.note || ''
        }]);
        setSearchMedicine('');
    };

    const removeFromPrescription = (id) => {
        setPrescription(prev => prev.filter(item => item.id !== id));
    };

    const updatePrescriptionItem = (id, field, value) => {
        setPrescription(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const addDiagnosis = (icd) => {
        setDiagnosis(prev => [...prev, { ...icd, id: Date.now() }]);
        setIcdSearch('');
    };

    const removeDiagnosis = (id) => {
        setDiagnosis(prev => prev.filter(item => item.id !== id));
    };

    const toggleService = (service) => {
        setSelectedServices(prev =>
            prev.some(s => s.id === service.id)
                ? prev.filter(s => s.id !== service.id)
                : [...prev, service]
        );
        setClsSearch('');
    };

    const removeService = (id) => {
        setSelectedServices(prev => prev.filter(s => s.id !== id));
    };

    const handleExaminationChange = (field, value) => {
        setExaminationForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSummaryChange = (field, value) => {
        setSummaryForm(prev => ({ ...prev, [field]: value }));
    };

    const handlePrescriptionFormChange = (field, value) => {
        setPrescriptionForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveRecord = () => {
        const recordData = {
            patient: selectedPatient,
            examination: examinationForm,
            diagnosis: diagnosis,
            prescription: prescription,
            services: selectedServices,
            summary: summaryForm,
            appointment: prescriptionForm
        };

        console.log('Saving record:', recordData);
        alert('Hồ sơ đã được lưu thành công!');
    };

    const handlePrint = () => {
        window.print();
    };

    const handleFinishExamination = () => {
        if (window.confirm('Bạn có chắc chắn muốn kết thúc cuộc khám này?')) {
            const examinationData = {
                patientId: selectedPatient.id,
                timestamp: new Date().toISOString(),
                diagnosis: diagnosis.map(d => d.code),
                prescription: prescription,
                services: selectedServices
            };

            console.log('Examination completed:', examinationData);
            alert('Đã kết thúc cuộc khám! Bệnh nhân đã được chuyển sang danh sách hoàn thành.');

            // Reset forms
            setSelectedPatient(null);
            setPrescription([]);
            setDiagnosis([]);
            setSelectedServices([]);
            setExaminationForm({
                reason: '',
                history: '',
                personalHistory: '',
                familyHistory: '',
                physicalExam: '',
                initialTreatment: '',
                temperature: '',
                pulse: '',
                bloodPressure: '',
                respiration: '',
                spo2: '',
                weight: ''
            });
            setSummaryForm({

                    clinicalProgress: '',
                    testResults: '',
                    mainDisease: '',
                    secondaryDisease: '',
                    treatmentMethod: '',
                    dischargeStatus: 'Ổn định',
                    additionalNotes: '',
                    shortTermPrognosis: '',
                    longTermPrognosis: ''

            });
        }
    };

    const calculateAge = (dob) => {
        return new Date().getFullYear() - new Date(dob).getFullYear();
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const startExamination = () => {
        if (selectedPatient) {
            alert(`Bắt đầu khám cho bệnh nhân ${selectedPatient.fullName}`);
        }
    };

    const pauseExamination = () => {
        alert('Tạm dừng cuộc khám hiện tại');
    };

    return (
        <div className="doctor-examination" data-theme={theme}>

            <button className="theme-toggle" onClick={toggleTheme} title={`Chuyển sang chế độ ${theme === 'light' ? 'tối' : 'sáng'}`}>
                {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <div className="examination-layout">

                <div className="waiting-list-panel">
                    <div className="panel-header">
                        <h3>📋 Danh sách chờ khám</h3>
                        <div className="priority-legend">
                            <div className="legend-item">
                                <span className="legend-icon">🔴</span>
                                <span>Ưu tiên cao</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-icon">🟡</span>
                                <span>Ưu tiên thường</span>
                            </div>
                        </div>
                    </div>

                    <div className="waiting-list">
                        {MOCK_PATIENTS_WAITING.map(patient => (
                            <div
                                key={patient.id}
                                className={`waiting-patient ${selectedPatient?.id === patient.id ? 'selected' : ''} ${patient.priority === 'high' ? 'priority-high' : ''}`}
                                onClick={() => setSelectedPatient(patient)}
                            >
                                <div className="patient-priority">
                                    {patient.priority === 'high' ? '🔴' : '🟡'}
                                </div>
                                <div className="patient-main-info">
                                    <div className="patient-name">{patient.fullName}</div>
                                    <div className="patient-reason">{patient.reason}</div>
                                    <div className="patient-department">{patient.department}</div>
                                </div>
                                <div className="patient-meta">
                                    <div className="waiting-time">{patient.waitingTime}</div>
                                    <div className="patient-age">{calculateAge(patient.dob)} tuổi</div>
                                    <div className="patient-gender">{patient.gender}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    {!selectedPatient ? (
                        <div className="empty-state">
                            <div className="empty-icon">👨‍⚕️</div>
                            <h3>Chọn bệnh nhân để khám</h3>
                            <p>Nhấp vào bệnh nhân từ danh sách bên trái để bắt đầu khám bệnh</p>
                            <div className="empty-tips">
                                <div className="tip">💡 Bệnh nhân ưu tiên cao được đánh dấu màu đỏ</div>
                                <div className="tip">💡 Thời gian chờ được cập nhật tự động</div>
                                <div className="tip">💡 Sử dụng viết tắt để nhập nhanh (vd: "cls", "sot", "ks")</div>
                            </div>
                        </div>
                    ) : (
                        <div className="examination-content">
                            {/* Patient Header */}
                            <div className="patient-header">
                                <div className="patient-info">
                                    <h2>{selectedPatient.fullName}</h2>
                                    <div className="patient-details">
                                        <span><strong>Mã:</strong> {selectedPatient.registrationId}</span>
                                        <span><strong>Tuổi:</strong> {calculateAge(selectedPatient.dob)}</span>
                                        <span><strong>Giới:</strong> {selectedPatient.gender}</span>
                                        <span><strong>ĐT:</strong> {selectedPatient.phone}</span>
                                        <span><strong>Khoa:</strong> {selectedPatient.department}</span>
                                    </div>
                                </div>
                                <div className="patient-actions">
                                    <button className="btn btn-primary" onClick={startExamination}>
                                        ▶️ Bắt đầu khám
                                    </button>
                                    <button className="btn btn-secondary" onClick={pauseExamination}>
                                        ⏸️ Tạm dừng
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="tabs-container">
                                <div className="tabs">
                                    {[
                                        { id: 'examination', label: '🩺 Khám bệnh', icon: '🩺' },
                                        { id: 'summary', label: '📄 Tổng kết', icon: '📄' },
                                        { id: 'prescription', label: '💊 Toa thuốc', icon: '💊' },
                                        { id: 'services', label: '🔬 CLS', icon: '🔬' }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                                            onClick={() => setActiveTab(tab.id)}
                                        >
                                            <span className="tab-icon">{tab.icon}</span>
                                            <span className="tab-label">{tab.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content */}
                                <div className="tab-content">
                                    {/* Tab 1: Khám bệnh - BỐ CỤC MỚI */}
                                    {activeTab === 'examination' && (
                                        <div className="examination-form-new">
                                            {/* Dấu hiệu sinh tồn - ĐƯA LÊN TRÊN */}
                                            <div className="vital-signs-section">
                                                <h3 className="section-title">📊 DẤU HIỆU SINH TỒN</h3>
                                                <div className="vital-grid">
                                                    {[
                                                        { label: 'Nhiệt độ (°C)', field: 'temperature', placeholder: '37.0' },
                                                        { label: 'Mạch (lần/phút)', field: 'pulse', placeholder: '75' },
                                                        { label: 'HA (mmHg)', field: 'bloodPressure', placeholder: '120/80' },
                                                        { label: 'Nhịp thở (lần/phút)', field: 'respiration', placeholder: '16' },
                                                        { label: 'SpO2 (%)', field: 'spo2', placeholder: '98' },
                                                        { label: 'Cân nặng (kg)', field: 'weight', placeholder: '65' }
                                                    ].map(vital => (
                                                        <div key={vital.field} className="vital-item">
                                                            <label>{vital.label}</label>
                                                            <input
                                                                type="text"
                                                                placeholder={vital.placeholder}
                                                                value={examinationForm[vital.field]}
                                                                onChange={(e) => handleExaminationChange(vital.field, e.target.value)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Lý do vào viện và Quá trình bệnh - 2 Ô VUÔNG NẰM NGANG */}
                                            <div className="main-info-grid">
                                                <div className="info-card">
                                                    <label className="card-title">🏥 LÝ DO VÀO VIỆN *</label>
                                                    <SmartTextArea
                                                        value={examinationForm.reason}
                                                        onChange={(value) => handleExaminationChange('reason', value)}
                                                        placeholder="Mô tả lý do bệnh nhân đến khám, triệu chứng chính... (Gõ 'cls' cho Cận Lâm Sàng, 'sot' cho Sốt cao)"
                                                        onBlur={''}
                                                        rows={6}
                                                    />
                                                </div>

                                                <div className="info-card">
                                                    <label className="card-title">📈 QUÁ TRÌNH BỆNH LÝ</label>
                                                    <SmartTextArea
                                                        value={examinationForm.history}
                                                        onChange={(value) => handleExaminationChange('history', value)}
                                                        placeholder="Diễn biến bệnh, triệu chứng, thời gian khởi phát... (Gõ 'ths' cho Tiền sử hút thuốc)"
                                                        onBlur={''}
                                                        rows={6}
                                                    />
                                                </div>
                                            </div>

                                            {/* Tiền sử - 2 Ô VUÔNG NẰM NGANG */}
                                            <div className="history-grid">
                                                <div className="info-card">
                                                    <label className="card-title">👤 TIỀN SỬ BẢN THÂN</label>
                                                    <SmartTextArea
                                                        value={examinationForm.personalHistory}
                                                        onChange={(value) => handleExaminationChange('personalHistory', value)}
                                                        placeholder="Bệnh mãn tính, dị ứng... (Gõ 'cao huyet ap' cho Tăng huyết áp)"
                                                        onBlur={''}
                                                        rows={4}
                                                    />
                                                </div>

                                                <div className="info-card">
                                                    <label className="card-title">👨‍👩‍👧‍👦 TIỀN SỬ GIA ĐÌNH</label>
                                                    <SmartTextArea
                                                        value={examinationForm.familyHistory}
                                                        onChange={(value) => handleExaminationChange('familyHistory', value)}
                                                        placeholder="Bệnh di truyền, bệnh trong gia đình..."
                                                        onBlur={''}
                                                        rows={4}
                                                    />
                                                </div>
                                            </div>

                                            {/* Khám thực thể */}
                                            <div className="info-card full-width">
                                                <label className="card-title">🔍 KHÁM THỰC THỂ</label>
                                                <SmartTextArea
                                                    value={examinationForm.physicalExam}
                                                    onChange={(value) => handleExaminationChange('physicalExam', value)}
                                                    placeholder="Tình trạng toàn thân, da, niêm mạc, các cơ quan... (Gõ 'bt' cho Bình thường, 'kbt' cho Không bình thường)"
                                                    onBlur={''}
                                                    rows={4}
                                                />
                                            </div>

                                            {/* Chẩn đoán ICD */}
                                            <div className="info-card full-width">
                                                <label className="card-title">🏥 CHẨN ĐOÁN ICD-10</label>
                                                <div className="search-box">
                                                    <input
                                                        type="text"
                                                        placeholder="Tìm ICD..."
                                                        value={icdSearch}
                                                        onChange={(e) => setIcdSearch(e.target.value)}
                                                    />
                                                    {icdSearch && filteredIcdCodes.length > 0 && (
                                                        <div className="search-results">
                                                            {filteredIcdCodes.map(icd => (
                                                                <div
                                                                    key={icd.code}
                                                                    className="search-item"
                                                                    onClick={() => addDiagnosis(icd)}
                                                                >
                                                                    <strong>{icd.code}</strong> - {icd.name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="selected-items">
                                                    {diagnosis.map(diag => (
                                                        <div key={diag.id} className="selected-tag">
                                                            <span className="diagnosis-code">{diag.code}</span>
                                                            <span className="diagnosis-name">{diag.name}</span>
                                                            <button
                                                                onClick={() => removeDiagnosis(diag.id)}
                                                                className="btn-remove-small"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Xử trí ban đầu */}
                                            <div className="info-card full-width">
                                                <label className="card-title">💊 XỬ TRÍ BAN ĐẦU</label>
                                                <SmartTextArea
                                                    value={examinationForm.initialTreatment}
                                                    onChange={(value) => handleExaminationChange('initialTreatment', value)}
                                                    placeholder="Xử trí, hướng dẫn ban đầu... (Gõ 'ks' cho Kháng sinh, 'gs' cho Giảm đau)"
                                                    onBlur={''}
                                                    rows={3}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Tab 2: Tổng kết */}
                                    {/* Tab 2: Tổng kết */}
                                    {activeTab === 'summary' && (
                                        <div className="examination-form-new">
                                            {/* Diễn biến lâm sàng và Kết quả XN & CLS - 2 Ô VUÔNG NẰM NGANG */}
                                            <div className="main-info-grid">
                                                <div className="info-card">
                                                    <label className="card-title">📈 DIỄN BIẾN LÂM SÀNG</label>
                                                    <SmartTextArea
                                                        value={summaryForm.clinicalProgress}
                                                        onChange={(value) => handleSummaryChange('clinicalProgress', value)}
                                                        placeholder="Diễn biến bệnh trong quá trình điều trị, đáp ứng với thuốc..."
                                                        onBlur={''}
                                                        rows={6}
                                                    />
                                                </div>

                                                <div className="info-card">
                                                    <label className="card-title">🔬 KẾT QUẢ XN & CLS</label>
                                                    <SmartTextArea
                                                        value={summaryForm.testResults}
                                                        onChange={(value) => handleSummaryChange('testResults', value)}
                                                        placeholder="Tóm tắt kết quả xét nghiệm, chẩn đoán hình ảnh, các chỉ số quan trọng..."
                                                        onBlur={''}
                                                        rows={6}
                                                    />
                                                </div>
                                            </div>

                                            {/* Bệnh chính và Bệnh kèm theo - 2 Ô VUÔNG NẰM NGANG */}
                                            <div className="history-grid">
                                                <div className="info-card">
                                                    <label className="card-title">🎯 BỆNH CHÍNH</label>
                                                    <div className="input-with-icon">
                                                        <input
                                                            type="text"
                                                            placeholder="Chẩn đoán chính"
                                                            value={summaryForm.mainDisease}
                                                            onChange={(e) => handleSummaryChange('mainDisease', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="info-card">
                                                    <label className="card-title">🩺 BỆNH KÈM THEO</label>
                                                    <div className="input-with-icon">
                                                        <input
                                                            type="text"
                                                            placeholder="Bệnh đi kèm (nếu có)"
                                                            value={summaryForm.secondaryDisease}
                                                            onChange={(e) => handleSummaryChange('secondaryDisease', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Phương pháp điều trị */}
                                            <div className="info-card full-width">
                                                <label className="card-title">💉 PHƯƠNG PHÁP ĐIỀU TRỊ</label>
                                                <SmartTextArea
                                                    value={summaryForm.treatmentMethod}
                                                    onChange={(value) => handleSummaryChange('treatmentMethod', value)}
                                                    placeholder="Phác đồ điều trị đã áp dụng, phẫu thuật, can thiệp..."
                                                    onBlur={''}
                                                    rows={4}
                                                />
                                            </div>

                                            {/* Tình trạng ra viện và Thông tin khác */}
                                            <div className="history-grid">
                                                <div className="info-card">
                                                    <label className="card-title">📋 TÌNH TRẠNG RA VIỆN</label>
                                                    <div className="select-with-icon">
                                                        <select
                                                            value={summaryForm.dischargeStatus}
                                                            onChange={(e) => handleSummaryChange('dischargeStatus', e.target.value)}
                                                        >
                                                            <option>Ổn định</option>
                                                            <option>Tiến triển tốt</option>
                                                            <option>Chuyển viện</option>
                                                            <option>Tử vong</option>
                                                            <option>Xin về</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="info-card">
                                                    <label className="card-title">📝 GHI CHÚ THÊM</label>
                                                    <div className="input-with-icon">
                                                        <input
                                                            type="text"
                                                            placeholder="Thông tin bổ sung (nếu có)"
                                                            value={summaryForm.additionalNotes || ''}
                                                            onChange={(e) => handleSummaryChange('additionalNotes', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Thông tin tiên lượng */}
                                            <div className="info-card full-width">
                                                <label className="card-title">🔮 TIÊN LƯỢNG</label>
                                                <div className="prognosis-grid">
                                                    <div className="prognosis-item">
                                                        <label>Tiên lượng ngắn hạn</label>
                                                        <select
                                                            value={summaryForm.shortTermPrognosis || ''}
                                                            onChange={(e) => handleSummaryChange('shortTermPrognosis', e.target.value)}
                                                        >
                                                            <option value="">Chọn tiên lượng</option>
                                                            <option>Tốt</option>
                                                            <option>Khá</option>
                                                            <option>Trung bình</option>
                                                            <option>Xấu</option>
                                                        </select>
                                                    </div>
                                                    <div className="prognosis-item">
                                                        <label>Tiên lượng dài hạn</label>
                                                        <select
                                                            value={summaryForm.longTermPrognosis || ''}
                                                            onChange={(e) => handleSummaryChange('longTermPrognosis', e.target.value)}
                                                        >
                                                            <option value="">Chọn tiên lượng</option>
                                                            <option>Tốt</option>
                                                            <option>Khá</option>
                                                            <option>Trung bình</option>
                                                            <option>Xấu</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'prescription' && (
                                        <div className="prescription-form">
                                            {/* ... giữ nguyên ... */}
                                        </div>
                                    )}

                                    {activeTab === 'services' && (
                                        <div className="services-form">
                                            {/* ... giữ nguyên ... */}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="action-buttons">
                                <button className="btn btn-primary" onClick={handleSaveRecord}>
                                    💾 Lưu hồ sơ
                                </button>
                                <button className="btn btn-secondary" onClick={handlePrint}>
                                    🖨️ In phiếu
                                </button>
                                <button className="btn btn-success" onClick={handleFinishExamination}>
                                    ✅ Kết thúc khám
                                </button>
                                <button className="btn btn-warning" onClick={() => setSelectedPatient(null)}>
                                    ↩️ Quay lại
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// CSS Styles
const doctorStyles = `
/* CSS styles giữ nguyên từ phần trước */
.doctor-examination {
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: #1e293b;
  transition: all 0.3s ease;
  position: relative;
}

[data-theme="dark"] .doctor-examination {
  background: #0f172a;
  color: #f1f5f9;
}

.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

[data-theme="dark"] .theme-toggle {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.theme-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.examination-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
  height: calc(100vh - 140px);
}

.waiting-list-panel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

[data-theme="dark"] .waiting-list-panel {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.panel-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 12px 12px 0 0;
}

[data-theme="dark"] .panel-header {
  background: #0f172a;
  border-color: #334155;
}

.panel-header h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

[data-theme="dark"] .panel-header h3 {
  color: #f1f5f9;
}

.priority-legend {
  display: flex;
  gap: 16px;
  font-size: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #64748b;
}

[data-theme="dark"] .legend-item {
  color: #94a3b8;
}

.waiting-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.waiting-patient {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
}

[data-theme="dark"] .waiting-patient {
  background: #1e293b;
  border-color: #334155;
}

.waiting-patient:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.waiting-patient.selected {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
}

.waiting-patient.priority-high {
  border-left: 4px solid #dc2626;
}

.patient-priority {
  font-size: 16px;
  margin-top: 2px;
}

.patient-main-info {
  flex: 1;
}

.patient-name {
  font-weight: 600;
  margin-bottom: 4px;
  color: #1e293b;
}

[data-theme="dark"] .patient-name {
  color: #f1f5f9;
}

.patient-reason {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
  margin-bottom: 4px;
}

[data-theme="dark"] .patient-reason {
  color: #94a3b8;
}

.patient-department {
  font-size: 11px;
  color: #3b82f6;
  font-weight: 500;
}

.patient-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

[data-theme="dark"] .patient-meta {
  color: #94a3b8;
}

.waiting-time {
  font-weight: 500;
  color: #dc2626;
}

.main-content {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

[data-theme="dark"] .main-content {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 40px;
  color: #64748b;
}

[data-theme="dark"] .empty-state {
  color: #94a3b8;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #1e293b;
}

[data-theme="dark"] .empty-state h3 {
  color: #f1f5f9;
}

.empty-state p {
  margin: 0 0 20px 0;
  font-size: 14px;
}

.empty-tips {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 300px;
}

.tip {
  font-size: 13px;
  color: #64748b;
  text-align: left;
  padding: 8px;
  background: #f8fafc;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

[data-theme="dark"] .tip {
  background: #0f172a;
  color: #94a3b8;
}

.patient-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 12px 12px 0 0;
}

[data-theme="dark"] .patient-header {
  background: #0f172a;
  border-color: #334155;
}

.patient-info h2 {
  margin: 0 0 12px 0;
  font-size: 24px;
  color: #1e293b;
}

[data-theme="dark"] .patient-info h2 {
  color: #f1f5f9;
}

.patient-details {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

[data-theme="dark"] .patient-details {
  color: #94a3b8;
}

.patient-details span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.patient-actions {
  display: flex;
  gap: 12px;
}

.tabs-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 24px;
}

[data-theme="dark"] .tabs {
  background: #0f172a;
  border-color: #334155;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border: none;
  background: none;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

[data-theme="dark"] .tab {
  color: #94a3b8;
}

.tab:hover {
  color: #1e293b;
  background: rgba(59, 130, 246, 0.05);
}

[data-theme="dark"] .tab:hover {
  color: #f1f5f9;
}

.tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background: #ffffff;
}

[data-theme="dark"] .tab.active {
  background: #1e293b;
}

.tab-icon {
  font-size: 16px;
}

.tab-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* CSS cho bố cục mới */
.examination-form-new {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

[data-theme="dark"] .section-title {
  color: #f1f5f9;
}

.vital-signs-section {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

[data-theme="dark"] .vital-signs-section {
  background: #1e293b;
  border-color: #334155;
}

.main-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.history-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

[data-theme="dark"] .info-card {
  background: #1e293b;
  border-color: #334155;
}

.info-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.info-card.full-width {
  grid-column: 1 / -1;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
  display: block;
  display: flex;
  align-items: center;
  gap: 8px;
}

[data-theme="dark"] .card-title {
  color: #f1f5f9;
}

/* CSS cho SmartTextArea */
.smart-textarea-container {
  position: relative;
  width: 100%;
}

.smart-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.2s ease;
  background: #ffffff;
  color: #1e293b;
}

[data-theme="dark"] .smart-textarea {
  background: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}

.smart-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

[data-theme="dark"] .smart-textarea:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.suggestion-hint {
  position: absolute;
  top: -35px;
  left: 0;
  right: 0;
  background: #3b82f6;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: slideDown 0.2s ease;
  z-index: 10;
}

.suggestion-hint kbd {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.shortcut-hints {
  margin-top: 8px;
  color: #64748b;
  font-size: 12px;
}

[data-theme="dark"] .shortcut-hints {
  color: #94a3b8;
}

.shortcut-hints small {
  display: flex;
  align-items: center;
  gap: 4px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Vital signs grid */
.vital-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.vital-item {
  display: flex;
  flex-direction: column;
}

.vital-item label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

[data-theme="dark"] .vital-item label {
  color: #94a3b8;
}

.vital-item input {
  padding: 10px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  font-size: 14px;
  color: #1e293b;
  text-align: center;
  font-weight: 600;
}

[data-theme="dark"] .vital-item input {
  background: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}

.vital-item input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

[data-theme="dark"] .vital-item input:focus {
  border-color: #60a5fa;
}

/* Responsive */
@media (max-width: 768px) {
  .main-info-grid,
  .history-grid {
    grid-template-columns: 1fr;
  }
  
  .examination-form-new {
    padding: 16px;
  }
  
  .info-card {
    padding: 16px;
  }
  
  .examination-layout {
    grid-template-columns: 1fr;
    height: auto;
  }
}

/* Thêm các styles còn thiếu */
.examination-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
  height: calc(100vh - 140px);
}

.waiting-list-panel {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 0;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
  transition: var(--transition);
  overflow: hidden;
}





[data-theme="dark"] {
  /* Dark Theme Variables */
  --bg-color: #0f172a;
  --card-bg: #1e293b;
  --text-color: #f1f5f9;
  --text-muted: #94a3b8;
  --border-color: #334155;
  --primary-color: #60a5fa;
  --primary-hover: #3b82f6;
  --success-color: #34d399;
  --success-hover: #10b981;
  --danger-color: #f87171;
  --danger-hover: #ef4444;
  --warning-color: #fbbf24;
  --warning-hover: #f59e0b;
  --accent-color: #a78bfa;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* Base Styles */
.doctor-examination {
  padding: 20px;
  background: var(--bg-color);
  min-height: 100vh;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: var(--text-color);
  transition: all 0.3s ease;
  position: relative;
}

/* Theme Toggle */
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  z-index: 1000;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-hover);
}

/* Header */
.examination-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 24px;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.header-left h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
}

.doctor-info {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: var(--text-muted);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.patient-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-color);
  padding: 12px 16px;
  border-radius: 8px;
  min-width: 100px;
  border: 1px solid var(--border-color);
}

.count {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}

.label {
  font-size: 12px;
  color: var(--text-muted);
}

.current-time {
  font-size: 14px;
  color: var(--text-muted);
  padding: 8px 12px;
  background: var(--bg-color);
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

/* Layout */
.examination-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
  height: calc(100vh - 140px);
}

/* Waiting List */
.waiting-list-panel {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.panel-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color);
  border-radius: 12px 12px 0 0;
}

.panel-header h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
}

.priority-legend {
  display: flex;
  gap: 16px;
  font-size: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
}

.legend-icon {
  font-size: 14px;
}

.waiting-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.waiting-patient {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--card-bg);
}

.waiting-patient:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-hover);
  transform: translateY(-1px);
}

.waiting-patient.selected {
  border-color: var(--primary-color);
  background: color-mix(in srgb, var(--primary-color) 8%, transparent);
}

.waiting-patient.priority-high {
  border-left: 4px solid var(--danger-color);
}

.patient-priority {
  font-size: 16px;
  margin-top: 2px;
}

.patient-main-info {
  flex: 1;
}

.patient-name {
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-color);
}

.patient-reason {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.4;
  margin-bottom: 4px;
}

.patient-department {
  font-size: 11px;
  color: var(--primary-color);
  font-weight: 500;
}

.patient-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
}

.waiting-time {
  font-weight: 500;
  color: var(--danger-color);
}

.patient-age, .patient-gender {
  font-size: 11px;
}

/* Main Content */
.main-content {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 40px;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: var(--text-color);
}

.empty-state p {
  margin: 0 0 20px 0;
  font-size: 14px;
}

.empty-tips {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 300px;
}

.tip {
  font-size: 13px;
  color: var(--text-muted);
  text-align: left;
  padding: 8px;
  background: var(--bg-color);
  border-radius: 6px;
  border-left: 3px solid var(--primary-color);
}

/* Patient Header */
.patient-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color);
  border-radius: 12px 12px 0 0;
}

.patient-info h2 {
  margin: 0 0 12px 0;
  font-size: 24px;
  color: var(--text-color);
}

.patient-details {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.patient-details span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.patient-reason-display {
  font-size: 14px;
  color: var(--text-color);
  background: var(--bg-color);
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid var(--warning-color);
}

.patient-actions {
  display: flex;
  gap: 12px;
}

/* Tabs */
.tabs-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  padding: 0 24px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border: none;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.tab:hover {
  color: var(--text-color);
  background: color-mix(in srgb, var(--primary-color) 5%, transparent);
}

.tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  background: var(--card-bg);
}

.tab-icon {
  font-size: 16px;
}

.tab-label {
  white-space: nowrap;
}

/* Tab Content */
.tab-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
}

.form-section.full-width {
  grid-column: 1 / -1;
}

.form-section label {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-color);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.form-section textarea,
.form-section input,
.form-section select {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-color);
  font-family: inherit;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-section textarea:focus,
.form-section input:focus,
.form-section select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 20%, transparent);
}

.form-section textarea {
  resize: vertical;
  min-height: 80px;
}

/* Vital Signs */
.vital-signs {
  grid-column: 1 / -1;
  margin: 16px 0;
  padding: 20px;
  background: var(--bg-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.vital-signs h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

.vital-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.vital-item {
  display: flex;
  flex-direction: column;
}

.vital-item label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.vital-item input {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--card-bg);
  font-size: 14px;
  color: var(--text-color);
}

/* Search Boxes */
.search-box {
  position: relative;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: var(--shadow-hover);
  margin-top: 4px;
}

.search-item {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
  color: var(--text-color);
}

.search-item:hover {
  background: var(--bg-color);
}

.search-item:last-child {
  border-bottom: none;
}

.medicine-name,
.service-name {
  font-weight: 600;
  margin-bottom: 2px;
}

.medicine-dosage,
.service-code,
.service-category {
  font-size: 12px;
  color: var(--text-muted);
}

.service-meta {
  display: flex;
  gap: 8px;
  margin-top: 2px;
}

/* Selected Items */
.selected-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: color-mix(in srgb, var(--primary-color) 10%, transparent);
  color: var(--primary-color);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid color-mix(in srgb, var(--primary-color) 20%, transparent);
}

.diagnosis-code {
  font-weight: 600;
}

.diagnosis-name {
  font-size: 12px;
}

.btn-remove-small {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.btn-remove-small:hover {
  background: color-mix(in srgb, var(--primary-color) 20%, transparent);
}

/* Prescription */
.prescription-form,
.services-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.medicine-search,
.service-search {
  position: relative;
  
}

.prescription-list,
.selected-services {
  min-height: 200px;
}

.empty-state-small {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  background: var(--bg-color);
  border-radius: 8px;
  border: 1px dashed var(--border-color);
}

.empty-icon-small {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state-small p {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.empty-state-small small {
  font-size: 12px;
  color: var(--text-muted);
}

/* Prescription Items */
.prescription-items,
.service-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prescription-item {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr auto;
  gap: 16px;
  align-items: start;
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.prescription-item:hover {
  border-color: var(--primary-color);
}

.med-info {
  min-width: 200px;
}

.med-name {
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-color);
}

.med-dosage {
  font-size: 12px;
  color: var(--text-muted);
}

.med-schedule {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.time-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.time-slot label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 4px;
}

.time-slot input {
  width: 50px;
  padding: 6px;
  text-align: center;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 13px;
}

.time-slot span {
  font-size: 11px;
  color: var(--text-muted);
}

.med-notes {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.med-notes label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}

.med-notes input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 13px;
}

/* Service Items */
.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.service-item:hover {
  border-color: var(--primary-color);
}

.service-info {
  flex: 1;
}

.service-name {
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-color);
}

/* Remove Buttons */
.btn-remove {
  background: var(--danger-color);
  color: white;
  border: none;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.btn-remove:hover {
  background: var(--danger-hover);
}

/* Appointment */
.appointment-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 12px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-group label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-color);
  border-radius: 0 0 12px 12px;
}

.btn {
  padding: 12px 24px;
  border: 1px solid;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--primary-color) 30%, transparent);
}

.btn-secondary {
  background: var(--card-bg);
  color: var(--text-color);
  border-color: var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-color);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-1px);
}

.btn-success {
  background: var(--success-color);
  color: white;
  border-color: var(--success-color);
}

.btn-success:hover {
  background: var(--success-hover);
  border-color: var(--success-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--success-color) 30%, transparent);
}

.btn-warning {
  background: var(--warning-color);
  color: white;
  border-color: var(--warning-color);
}

.btn-warning:hover {
  background: var(--warning-hover);
  border-color: var(--warning-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--warning-color) 30%, transparent);
}

/* Responsive */
@media (max-width: 1200px) {
  .examination-layout {
    grid-template-columns: 300px 1fr;
    gap: 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .prescription-item {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .med-schedule {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .appointment-inputs {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .doctor-examination {
    padding: 16px;
  }
  
  .examination-layout {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .waiting-list-panel {
    max-height: 400px;
    order: 2;
  }
  
  .main-content {
    order: 1;
  }
  
  .tabs {
    flex-wrap: wrap;
    padding: 0 16px;
  }
  
  .tab {
    flex: 1;
    min-width: 120px;
    justify-content: center;
    padding: 12px 16px;
  }
  
  .patient-header {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }
  
  .patient-details {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .patient-actions {
    width: 100%;
    justify-content: center;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .vital-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .tab-content {
    padding: 20px;
  }
  
  .theme-toggle {
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .examination-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .doctor-info {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  
  .header-right {
    flex-direction: column;
    width: 100%;
  }
  
  .tabs {
    flex-direction: column;
  }
  
  .tab {
    justify-content: flex-start;
  }
  
  .vital-grid {
    grid-template-columns: 1fr;
  }
  
  .prescription-item {
    padding: 12px;
  }
  
  .med-schedule {
    grid-template-columns: 1fr;
  }
  
  .patient-details {
    flex-direction: column;
    gap: 8px;
  }
}

/* Scrollbar Styling */
.waiting-list::-webkit-scrollbar,
.tab-content::-webkit-scrollbar,
.search-results::-webkit-scrollbar {
  width: 6px;
}

.waiting-list::-webkit-scrollbar-track,
.tab-content::-webkit-scrollbar-track,
.search-results::-webkit-scrollbar-track {
  background: var(--bg-color);
  border-radius: 3px;
}

.waiting-list::-webkit-scrollbar-thumb,
.tab-content::-webkit-scrollbar-thumb,
.search-results::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.waiting-list::-webkit-scrollbar-thumb:hover,
.tab-content::-webkit-scrollbar-thumb:hover,
.search-results::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Animation for better UX */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.waiting-patient,
.prescription-item,
.service-item,
.search-item {
  animation: fadeIn 0.3s ease;
}

/* Focus styles for accessibility */
.btn:focus,
.tab:focus,
.form-section input:focus,
.form-section textarea:focus,
.form-section select:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .doctor-examination {
    background: white;
    padding: 0;
  }
  
  .examination-header,
  .waiting-list-panel,
  .tabs,
  .action-buttons,
  .theme-toggle {
    display: none;
  }
  
  .main-content {
    box-shadow: none;
    border: none;
  }
  
  .tab-content {
    padding: 0;
  }
  
  .prescription-item {
    break-inside: avoid;
  }
}

/* High contrast support */
@media (prefers-contrast: high) {
  :root, [data-theme="dark"] {
    --border-color: #000000;
    --shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .doctor-examination,
  .examination-header,
  .waiting-list-panel,
  .main-content,
  .waiting-patient,
  .btn,
  .tab,
  .theme-toggle {
    transition: none;
  }
  
  .waiting-patient:hover,
  .btn:hover {
    transform: none;
  }
  
  .search-item,
  .prescription-item,
  .service-item {
    animation: none;
  }
}`

if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = doctorStyles;
    document.head.appendChild(styleElement);
}

export default DoctorExamination;