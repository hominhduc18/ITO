import React, { useState, useEffect } from 'react';

// Mock data
const MOCK_PATIENTS = [
    {
        id: 'BN001',
        name: 'Nguyễn Văn A',
        phone: '0912345678',
        registrationId: 'DK001',
        services: [
            { id: '3132', name: 'Khám bệnh - cấp cứu (PN)', price: 300000, quantity: 1 },
            { id: 'XN001', name: 'Xét nghiệm máu', price: 150000, quantity: 1 },
            { id: 'CD001', name: 'Chụp X-Quang ngực', price: 250000, quantity: 1 }
        ],
        total: 700000,
        paid: 0,
        status: 'pending'
    },
    {
        id: 'BN002',
        name: 'Trần Thị B',
        phone: '0923456789',
        registrationId: 'DK002',
        services: [
            { id: '3132', name: 'Khám bệnh - cấp cứu (PN)', price: 300000, quantity: 1 },
            { id: 'XN002', name: 'Xét nghiệm nước tiểu', price: 120000, quantity: 1 }
        ],
        total: 420000,
        paid: 200000,
        status: 'partial'
    },
    {
        id: 'BN003',
        name: 'Lê Văn C',
        phone: '0934567890',
        registrationId: 'DK003',
        services: [
            { id: '3132', name: 'Khám bệnh - cấp cứu (PN)', price: 300000, quantity: 1 },
            { id: 'CD002', name: 'Siêu âm ổ bụng', price: 350000, quantity: 1 }
        ],
        total: 650000,
        paid: 650000,
        status: 'paid'
    }
];

// Theme Context
const ThemeContext = React.createContext({
    isDarkMode: false,
    toggleTheme: () => {}
});

// Theme Toggle Component
function ThemeToggle() {
    const { isDarkMode, toggleTheme } = React.useContext(ThemeContext);

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
        >
            {isDarkMode ? '🌙' : '☀️'}
        </button>
    );
}

// Component VietQR
function VietQRPayment({ amount, patient, onSuccess }: { amount: number; patient: any; onSuccess: () => void }) {
    const [showQR, setShowQR] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const { isDarkMode } = React.useContext(ThemeContext);

    const generateVietQRUrl = () => {
        const bankAccount = '1014980733'
        const bankBin = '970436';
        const accountName = 'BENH VIEN SAIGON ITO';
        const amountStr = amount.toString();

        return `https://img.vietqr.io/image/${bankBin}-${bankAccount}-compact2.jpg?amount=${amountStr}&accountName=${accountName}&addInfo=Thanh toan dich vu ${patient.name}`;
    };

    const handleShowQR = () => {
        setShowQR(true);
        setTimeout(() => {
            setIsPaid(true);
            onSuccess();
        }, 5000);
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=BILL_${patient.id}_${amount}_${Date.now()}`;
    };

    return (
        <div className="vietqr-payment">
            <div className="vietqr-header">
                <h3>💳 Thanh toán qua VietQR</h3>
                <p>Quét mã QR để thanh toán nhanh chóng</p>
            </div>

            {!showQR ? (
                <div className="vietqr-setup">
                    <div className={`bank-info ${isDarkMode ? 'dark' : ''}`}>
                        <h4>Thông tin ngân hàng</h4>
                        <div className="bank-details">
                            <div className="detail-item">
                                <label>Ngân hàng:</label>
                                <span>Vietcombank</span>
                            </div>
                            <div className="detail-item">
                                <label>Số tài khoản:</label>
                                <span>1234567890</span>
                            </div>
                            <div className="detail-item">
                                <label>Chủ tài khoản:</label>
                                <span>BENH VIEN SAIGON ITO</span>
                            </div>
                            <div className="detail-item">
                                <label>Số tiền:</label>
                                <span className="amount">{amount.toLocaleString()}đ</span>
                            </div>
                            <div className="detail-item">
                                <label>Nội dung:</label>
                                <span className="content">Thanh toán DV {patient.name}</span>
                            </div>
                        </div>
                    </div>

                    <button className="btn primary" onClick={handleShowQR}>
                        Hiển thị mã QR
                    </button>
                </div>
            ) : (
                <div className="vietqr-display">
                    {!isPaid ? (
                        <>
                            <div className="qr-container">
                                <img
                                    src={generateVietQRUrl()}
                                    alt="VietQR Code"
                                    className="qr-code"
                                    onError={handleImageError}
                                />
                                <div className="qr-overlay">
                                    <div className="loading-spinner"></div>
                                    <p>Đang chờ quét mã...</p>
                                </div>
                            </div>

                            <div className={`payment-steps ${isDarkMode ? 'dark' : ''}`}>
                                <h4>Hướng dẫn thanh toán:</h4>
                                <ol>
                                    <li>Mở app ngân hàng trên điện thoại</li>
                                    <li>Chọn tính năng "Quét mã QR"</li>
                                    <li>Quét mã bên trên</li>
                                    <li>Xác nhận thanh toán</li>
                                </ol>
                            </div>

                            <div className="payment-status">
                                <div className={`status-waiting ${isDarkMode ? 'dark' : ''}`}>
                                    ⏳ Đang chờ thanh toán...
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={`payment-success ${isDarkMode ? 'dark' : ''}`}>
                            <div className="success-icon">✅</div>
                            <h3>Thanh toán thành công!</h3>
                            <p>Số tiền: <strong>{amount.toLocaleString()}đ</strong></p>
                            <p>Phương thức: <strong>VietQR</strong></p>
                            <button className="btn primary" onClick={onSuccess}>
                                Tiếp tục
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Component form thanh toán
function PaymentForm({
                         patient,
                         paymentAmount,
                         setPaymentAmount,
                         paymentMethod,
                         setPaymentMethod,
                         onPayment
                     }: {
    patient: any;
    paymentAmount: number;
    setPaymentAmount: (amount: number) => void;
    paymentMethod: string;
    setPaymentMethod: (method: string) => void;
    onPayment: () => void;
}) {
    const { isDarkMode } = React.useContext(ThemeContext);
    const remaining = patient.total - patient.paid;
    const isFullPayment = paymentAmount >= remaining;

    return (
        <div className={`payment-form ${isDarkMode ? 'dark' : ''}`}>
            <h2>Thông tin thanh toán</h2>

            <div className={`patient-summary ${isDarkMode ? 'dark' : ''}`}>
                <h3>Bệnh nhân: {patient.name}</h3>
                <p>Mã BN: {patient.id} | SĐT: {patient.phone}</p>
            </div>

            <div className="services-list">
                <h4>Dịch vụ đã sử dụng:</h4>
                {patient.services.map((service: any) => (
                    <div key={service.id} className="service-item">
                        <span className="service-name">{service.name}</span>
                        <span className="service-price">{service.price.toLocaleString()}đ</span>
                    </div>
                ))}
            </div>

            <div className={`payment-summary ${isDarkMode ? 'dark' : ''}`}>
                <div className="summary-row">
                    <label>Tổng tiền:</label>
                    <span>{patient.total.toLocaleString()}đ</span>
                </div>
                <div className="summary-row">
                    <label>Đã thanh toán:</label>
                    <span>{patient.paid.toLocaleString()}đ</span>
                </div>
                <div className="summary-row total">
                    <label>Còn lại:</label>
                    <span>{remaining.toLocaleString()}đ</span>
                </div>
            </div>

            <div className="payment-controls">
                <div className="amount-section">
                    <label>Số tiền thanh toán:</label>
                    <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        min="0"
                        max={remaining}
                        className={`amount-input ${isDarkMode ? 'dark' : ''}`}
                    />
                    <div className="amount-buttons">
                        <button
                            type="button"
                            className="btn secondary"
                            onClick={() => setPaymentAmount(remaining)}
                        >
                            Thanh toán toàn bộ
                        </button>
                        <button
                            type="button"
                            className="btn secondary"
                            onClick={() => setPaymentAmount(Math.floor(remaining / 2))}
                        >
                            Thanh toán 50%
                        </button>
                    </div>
                </div>

                <div className="method-section">
                    <label>Phương thức thanh toán:</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className={`method-select ${isDarkMode ? 'dark' : ''}`}
                    >
                        <option value="cash">💵 Tiền mặt</option>
                        <option value="vietqr">📱 VietQR</option>
                        <option value="transfer">🏦 Chuyển khoản</option>
                        <option value="card">💳 Thẻ tín dụng</option>
                        <option value="insurance">🛡️ Bảo hiểm</option>
                    </select>

                    {paymentMethod === 'vietqr' && (
                        <div className={`method-info ${isDarkMode ? 'dark' : ''}`}>
                            <p>📱 Quét mã QR để thanh toán nhanh qua app ngân hàng</p>
                        </div>
                    )}
                </div>

                <button
                    className={`btn payment-btn ${
                        paymentMethod === 'vietqr' ? 'vietqr-btn' : 'primary'
                    }`}
                    onClick={onPayment}
                    disabled={paymentAmount <= 0 || paymentAmount > remaining}
                >
                    {paymentMethod === 'vietqr' ? (
                        <>📱 Thanh toán bằng VietQR</>
                    ) : isFullPayment ? (
                        'Xác nhận thanh toán'
                    ) : (
                        'Thanh toán một phần'
                    )}
                </button>
            </div>
        </div>
    );
}

// Component hóa đơn
function InvoicePreview({
                            patient,
                            paymentAmount,
                            paymentMethod,
                            onPrint,
                            onNewPayment
                        }: {
    patient: any;
    paymentAmount: number;
    paymentMethod: string;
    onPrint: () => void;
    onNewPayment: () => void;
}) {
    const { isDarkMode } = React.useContext(ThemeContext);
    const paymentDate = new Date().toLocaleString('vi-VN');
    const remaining = patient.total - patient.paid - paymentAmount;

    const getPaymentMethodText = () => {
        switch(paymentMethod) {
            case 'cash': return 'Tiền mặt';
            case 'vietqr': return 'VietQR';
            case 'transfer': return 'Chuyển khoản';
            case 'card': return 'Thẻ tín dụng';
            case 'insurance': return 'Bảo hiểm';
            default: return paymentMethod;
        }
    };

    return (
        <div className={`invoice-preview ${isDarkMode ? 'dark' : ''}`}>
            <div className="invoice-header">
                <h2>HÓA ĐƠN THANH TOÁN</h2>
                <p>BỆNH VIỆN SAIGON ITO</p>
            </div>

            <div className={`invoice-info ${isDarkMode ? 'dark' : ''}`}>
                <div className="info-row">
                    <label>Mã hóa đơn:</label>
                    <span>HD{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="info-row">
                    <label>Ngày thanh toán:</label>
                    <span>{paymentDate}</span>
                </div>
                <div className="info-row">
                    <label>Bệnh nhân:</label>
                    <span>{patient.name}</span>
                </div>
                <div className="info-row">
                    <label>Mã BN:</label>
                    <span>{patient.id}</span>
                </div>
            </div>

            <div className="invoice-services">
                <h4>Chi tiết dịch vụ:</h4>
                {patient.services.map((service: any) => (
                    <div key={service.id} className="service-row">
                        <span>{service.name}</span>
                        <span>{service.price.toLocaleString()}đ</span>
                    </div>
                ))}
            </div>

            <div className={`payment-summary ${isDarkMode ? 'dark' : ''}`}>
                <div className="summary-row">
                    <label>Tổng tiền:</label>
                    <span>{patient.total.toLocaleString()}đ</span>
                </div>
                <div className="summary-row">
                    <label>Đã thanh toán:</label>
                    <span>{patient.paid.toLocaleString()}đ</span>
                </div>
                <div className="summary-row">
                    <label>Thanh toán lần này:</label>
                    <span>{paymentAmount.toLocaleString()}đ</span>
                </div>
                <div className="summary-row">
                    <label>Phương thức:</label>
                    <span>{getPaymentMethodText()}</span>
                </div>
                {paymentMethod === 'vietqr' && (
                    <div className="summary-row">
                        <label>Mã giao dịch:</label>
                        <span>VQR{Date.now().toString().slice(-8)}</span>
                    </div>
                )}
                <div className="summary-row total">
                    <label>Còn lại:</label>
                    <span>{remaining.toLocaleString()}đ</span>
                </div>
            </div>

            <div className="invoice-footer">
                <div className="footer-actions">
                    <button className="btn primary" onClick={onPrint}>
                        🖨️ In hóa đơn
                    </button>
                    <button className="btn secondary" onClick={onNewPayment}>
                        Thanh toán mới
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main Component
export function Payment() {
    const [patients, setPatients] = useState(MOCK_PATIENTS);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showInvoice, setShowInvoice] = useState(false);
    const [showVietQR, setShowVietQR] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Load theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('payment-theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        } else {
            // Auto detect system preference
            // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            // setIsDarkMode(prefersDark);

            setIsDarkMode(true);
        }
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('payment-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Filter patients based on search and status
    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handlePatientSelect = (patient: any) => {
        setSelectedPatient(patient);
        setPaymentAmount(0);
        setShowInvoice(false);
        setShowVietQR(false);
    };

    const handlePayment = () => {
        if (!selectedPatient || paymentAmount <= 0) return;

        if (paymentMethod === 'vietqr') {
            setShowVietQR(true);
            return;
        }

        processPayment();
    };

    const processPayment = () => {
        const updatedPatients = patients.map(patient => {
            if (patient.id === selectedPatient.id) {
                const newPaid = patient.paid + paymentAmount;
                const newStatus = newPaid >= patient.total ? 'paid' :
                    newPaid > 0 ? 'partial' : 'pending';

                return {
                    ...patient,
                    paid: newPaid,
                    status: newStatus
                };
            }
            return patient;
        });

        setPatients(updatedPatients);
        setShowInvoice(true);
        setShowVietQR(false);
    };

    const handleVietQRSuccess = () => {
        processPayment();
    };

    const handlePrintInvoice = () => {
        window.print();
    };

    const handleNewPayment = () => {
        setSelectedPatient(null);
        setPaymentAmount(0);
        setPaymentMethod('cash');
        setShowInvoice(false);
        setShowVietQR(false);
    };

    const getStatusText = (status: string) => {
        switch(status) {
            case 'pending': return 'Chưa thanh toán';
            case 'partial': return 'Thanh toán một phần';
            case 'paid': return 'Đã thanh toán';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'pending': return isDarkMode ? '#ef4444' : '#dc2626';
            case 'partial': return isDarkMode ? '#f59e0b' : '#d97706';
            case 'paid': return isDarkMode ? '#10b981' : '#059669';
            default: return isDarkMode ? '#6b7280' : '#6b7280';
        }
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <div className={`payment-system ${isDarkMode ? 'dark' : ''}`}>
                <div className="payment-header">
                    <div className="header-content">
                        <h1>Hệ Thống Thanh Toán</h1>
                    </div>
                    <div className="header-actions">
                        <ThemeToggle />
                    </div>
                </div>

                <div className="payment-layout">
                    {/* Left Panel - Danh sách bệnh nhân */}
                    <div className={`patients-panel ${isDarkMode ? 'dark' : ''}`}>
                        <div className="panel-header">
                            <h3>Danh sách bệnh nhân</h3>
                            <div className="filters">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bệnh nhân..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`search-input ${isDarkMode ? 'dark' : ''}`}
                                />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className={`status-filter ${isDarkMode ? 'dark' : ''}`}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="pending">Chưa thanh toán</option>
                                    <option value="partial">Một phần</option>
                                    <option value="paid">Đã thanh toán</option>
                                </select>
                            </div>
                        </div>

                        <div className="patients-list">
                            {filteredPatients.map(patient => (
                                <div
                                    key={patient.id}
                                    className={`patient-card ${isDarkMode ? 'dark' : ''} ${
                                        selectedPatient?.id === patient.id ? 'selected' : ''
                                    }`}
                                    onClick={() => handlePatientSelect(patient)}
                                >
                                    <div className="patient-info">
                                        <h4>{patient.name}</h4>
                                        <p>Mã BN: {patient.id} | SĐT: {patient.phone}</p>
                                        <div className="patient-meta">
                                            <span className="total-amount">
                                                Tổng: {patient.total.toLocaleString()}đ
                                            </span>
                                            <span
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(patient.status) }}
                                            >
                                                {getStatusText(patient.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel - Thanh toán & Hóa đơn */}
                    <div className="payment-panel">
                        {!selectedPatient ? (
                            <div className={`empty-selection ${isDarkMode ? 'dark' : ''}`}>
                                <div className="empty-icon">💰</div>
                                <h3>Chọn bệnh nhân để thanh toán</h3>
                                <p>Nhấp vào bệnh nhân từ danh sách bên trái để bắt đầu quy trình thanh toán</p>
                            </div>
                        ) : showVietQR ? (
                            <VietQRPayment
                                amount={paymentAmount}
                                patient={selectedPatient}
                                onSuccess={handleVietQRSuccess}
                            />
                        ) : showInvoice ? (
                            <InvoicePreview
                                patient={selectedPatient}
                                paymentAmount={paymentAmount}
                                paymentMethod={paymentMethod}
                                onPrint={handlePrintInvoice}
                                onNewPayment={handleNewPayment}
                            />
                        ) : (
                            <PaymentForm
                                patient={selectedPatient}
                                paymentAmount={paymentAmount}
                                setPaymentAmount={setPaymentAmount}
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                                onPayment={handlePayment}
                            />
                        )}
                    </div>
                </div>
            </div>
        </ThemeContext.Provider>
    );
}

const paymentStyles = `
/* Light Theme (Default) */
.payment-system {
    min-height: 100vh;
    background: #f8fafc;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    transition: all 0.3s ease;
}

/* Dark Theme */
.payment-system.dark {
    background: #0f172a;
    color: #e2e8f0;
}

.payment-header {
    background: white;
    padding: 16px 24px;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
}

.payment-system.dark .payment-header {
    background: #1e293b;
    border-bottom-color: #334155;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.payment-header h1 {
    margin: 0;
    color: #1e293b;
    font-size: 20px;
    font-weight: 700;
}

.payment-system.dark .payment-header h1 {
    color: #f1f5f9;
}

.subtitle {
    margin: 4px 0 0 0;
    color: #64748b;
    font-size: 13px;
}

.payment-system.dark .subtitle {
    color: #94a3b8;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.theme-toggle {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}

.theme-toggle:hover {
    background: #e2e8f0;
    transform: scale(1.05);
}

.payment-system.dark .theme-toggle {
    background: #334155;
    border-color: #475569;
    color: #f1f5f9;
}

.payment-system.dark .theme-toggle:hover {
    background: #475569;
}

.payment-layout {
    display: flex;
    height: calc(100vh - 73px);
    gap: 0;
}

.patients-panel {
    width: 380px;
    min-width: 380px;
    background: white;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s ease;
}

.payment-system.dark .patients-panel {
    background: #1e293b;
    border-right-color: #334155;
}

.panel-header {
    padding: 20px;
    border-bottom: 1px solid #e2e8f0;
    background: #fafbfc;
    transition: all 0.3s ease;
}

.payment-system.dark .panel-header {
    background: #1e293b;
    border-bottom-color: #334155;
}

.panel-header h3 {
    margin: 0 0 16px 0;
    color: #1e293b;
    font-size: 16px;
    font-weight: 600;
}

.payment-system.dark .panel-header h3 {
    color: #f1f5f9;
}

.filters {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.search-input, .status-filter {
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    transition: all 0.3s ease;
}

.search-input:focus, .status-filter:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.payment-system.dark .search-input,
.payment-system.dark .status-filter {
    background: #334155;
    border-color: #475569;
    color: #f1f5f9;
}

.payment-system.dark .search-input:focus,
.payment-system.dark .status-filter:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.payment-system.dark .search-input::placeholder {
    color: #94a3b8;
}

.patients-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
}

.patient-card {
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: white;
}

.patient-card:hover {
    border-color: #3b82f6;
    background: #f8fafc;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.patient-card.selected {
    border-color: #3b82f6;
    background: #eff6ff;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

.payment-system.dark .patient-card {
    background: #1e293b;
    border-color: #334155;
    color: #e2e8f0;
}

.payment-system.dark .patient-card:hover {
    background: #334155;
    border-color: #3b82f6;
}

.payment-system.dark .patient-card.selected {
    background: #1e3a8a;
    border-color: #3b82f6;
}

.patient-info h4 {
    margin: 0 0 4px 0;
    color: #1e293b;
    font-size: 15px;
    font-weight: 600;
}

.payment-system.dark .patient-info h4 {
    color: #f1f5f9;
}

.patient-info p {
    margin: 0 0 8px 0;
    color: #64748b;
    font-size: 12px;
}

.payment-system.dark .patient-info p {
    color: #94a3b8;
}

.patient-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.total-amount {
    font-weight: 600;
    color: #1e293b;
    font-size: 13px;
}

.payment-system.dark .total-amount {
    color: #f1f5f9;
}

.status-badge {
    padding: 4px 10px;
    border-radius: 12px;
    color: white;
    font-size: 11px;
    font-weight: 500;
    min-width: 80px;
    text-align: center;
}

.payment-panel {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: #f8fafc;
    display: flex;
    justify-content: center;
    transition: all 0.3s ease;
}

.payment-system.dark .payment-panel {
    background: #0f172a;
}

.empty-selection {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: #64748b;
    max-width: 400px;
    width: 100%;
    transition: all 0.3s ease;
}

.payment-system.dark .empty-selection {
    color: #94a3b8;
}

.empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
    opacity: 0.7;
}

.empty-selection h3 {
    margin: 0 0 12px 0;
    color: #374151;
    font-size: 18px;
    font-weight: 600;
}

.payment-system.dark .empty-selection h3 {
    color: #e2e8f0;
}

.empty-selection p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
}

.payment-form {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    height: fit-content;
    transition: all 0.3s ease;
}

.payment-system.dark .payment-form {
    background: #1e293b;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    color: #e2e8f0;
}

.payment-form h2 {
    margin: 0 0 20px 0;
    color: #1e293b;
    font-size: 18px;
    font-weight: 700;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 12px;
}

.payment-system.dark .payment-form h2 {
    color: #f1f5f9;
    border-bottom-color: #334155;
}

.patient-summary {
    background: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid #3b82f6;
    transition: all 0.3s ease;
}

.payment-system.dark .patient-summary {
    background: #334155;
    border-left-color: #3b82f6;
}

.patient-summary h3 {
    margin: 0 0 4px 0;
    color: #1e293b;
    font-size: 15px;
    font-weight: 600;
}

.payment-system.dark .patient-summary h3 {
    color: #f1f5f9;
}

.patient-summary p {
    margin: 0;
    color: #64748b;
    font-size: 13px;
}

.payment-system.dark .patient-summary p {
    color: #94a3b8;
}

.services-list {
    margin-bottom: 20px;
}

.services-list h4 {
    margin: 0 0 12px 0;
    color: #374151;
    font-size: 14px;
    font-weight: 600;
}

.payment-system.dark .services-list h4 {
    color: #e2e8f0;
}

.service-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
}

.payment-system.dark .service-item {
    border-bottom-color: #334155;
}

.service-item:last-child {
    border-bottom: none;
}

.service-name {
    color: #475569;
    font-size: 13px;
    flex: 1;
}

.payment-system.dark .service-name {
    color: #cbd5e1;
}

.service-price {
    font-weight: 600;
    color: #1e293b;
    font-size: 13px;
    min-width: 80px;
    text-align: right;
}

.payment-system.dark .service-price {
    color: #f1f5f9;
}

.payment-summary {
    background: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
}

.payment-system.dark .payment-summary {
    background: #334155;
    border-color: #475569;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    font-size: 13px;
}

.summary-row.total {
    border-top: 1px solid #e2e8f0;
    font-weight: 700;
    color: #1e293b;
    font-size: 14px;
    margin-top: 4px;
    padding-top: 12px;
}

.payment-system.dark .summary-row.total {
    border-top-color: #475569;
    color: #f1f5f9;
}

.payment-controls {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.amount-section, .method-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.amount-section label, .method-section label {
    font-weight: 600;
    color: #374151;
    font-size: 13px;
}

.payment-system.dark .amount-section label,
.payment-system.dark .method-section label {
    color: #e2e8f0;
}

.amount-input {
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    text-align: right;
    transition: all 0.3s ease;
    background: white;
    color: #1e293b;
}

.amount-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.payment-system.dark .amount-input {
    background: #334155;
    border-color: #475569;
    color: #f1f5f9;
}

.payment-system.dark .amount-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.amount-buttons {
    display: flex;
    gap: 8px;
    margin-top: 8px;
}

.method-select {
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    color: #1e293b;
    transition: all 0.3s ease;
}

.method-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.payment-system.dark .method-select {
    background: #334155;
    border-color: #475569;
    color: #f1f5f9;
}

.payment-system.dark .method-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.btn {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    flex: 1;
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
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.btn.secondary {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
    padding: 10px 16px;
    font-size: 13px;
}

.btn.secondary:hover:not(:disabled) {
    background: #e2e8f0;
    transform: translateY(-1px);
}

.payment-system.dark .btn.secondary {
    background: #334155;
    color: #e2e8f0;
    border-color: #475569;
}

.payment-system.dark .btn.secondary:hover:not(:disabled) {
    background: #475569;
}

.payment-btn {
    margin-top: 8px;
    padding: 14px 20px;
    font-size: 15px;
}

.vietqr-btn {
    background: linear-gradient(135deg, #10b981, #059669) !important;
}

.vietqr-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669, #047857) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(5, 150, 105, 0.3);
}

.method-info {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 8px;
    padding: 12px;
    font-size: 13px;
    color: #0369a1;
    margin-top: 8px;
    transition: all 0.3s ease;
}

.payment-system.dark .method-info {
    background: #1e3a5f;
    border-color: #1e40af;
    color: #bfdbfe;
}

/* VietQR Styles */
.vietqr-payment {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 500px;
    width: 100%;
    margin: 0 auto;
}

.vietqr-header {
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #e2e8f0;
}

.payment-system.dark .vietqr-header {
    border-bottom-color: #334155;
}

.vietqr-header h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    color: #1e293b;
    font-weight: 700;
}

.payment-system.dark .vietqr-header h3 {
    color: #f1f5f9;
}

.vietqr-header p {
    margin: 0;
    color: #64748b;
}

.payment-system.dark .vietqr-header p {
    color: #94a3b8;
}

.vietqr-setup {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.bank-info {
    background: #f8fafc;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
}

.payment-system.dark .bank-info {
    background: #334155;
    border-color: #475569;
}

.bank-info h4 {
    margin: 0 0 16px 0;
    font-size: 15px;
    color: #1e293b;
    font-weight: 600;
}

.payment-system.dark .bank-info h4 {
    color: #f1f5f9;
}

.bank-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.bank-details .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e2e8f0;
    font-size: 13px;
}

.payment-system.dark .bank-details .detail-item {
    border-bottom-color: #475569;
    color: #e2e8f0;
}

.bank-details .detail-item:last-child {
    border-bottom: none;
}

.bank-details .amount {
    font-weight: 700;
    color: #059669;
    font-size: 14px;
}

.bank-details .content {
    font-family: monospace;
    background: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    border: 1px solid #e2e8f0;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #1e293b;
}

.payment-system.dark .bank-details .content {
    background: #1e293b;
    border-color: #475569;
    color: #e2e8f0;
}

.vietqr-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.qr-container {
    position: relative;
    padding: 20px;
    background: white;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.payment-system.dark .qr-container {
    background: #1e293b;
    border-color: #475569;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.qr-code {
    width: 220px;
    height: 220px;
    display: block;
    border-radius: 8px;
}

.qr-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border-radius: 8px;
}

.payment-system.dark .qr-overlay {
    background: rgba(30, 41, 59, 0.95);
    color: #e2e8f0;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.payment-system.dark .loading-spinner {
    border: 3px solid #475569;
    border-top: 3px solid #3b82f6;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.payment-steps {
    background: #f8fafc;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    width: 100%;
    max-width: 400px;
    transition: all 0.3s ease;
}

.payment-system.dark .payment-steps {
    background: #334155;
    border-color: #475569;
}

.payment-steps h4 {
    margin: 0 0 12px 0;
    font-size: 15px;
    color: #1e293b;
    font-weight: 600;
}

.payment-system.dark .payment-steps h4 {
    color: #f1f5f9;
}

.payment-steps ol {
    margin: 0;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.payment-steps li {
    font-size: 13px;
    color: #475569;
    line-height: 1.4;
}

.payment-system.dark .payment-steps li {
    color: #cbd5e1;
}

.payment-status {
    text-align: center;
    width: 100%;
}

.status-waiting {
    padding: 12px 20px;
    background: #fef3c7;
    color: #92400e;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    border: 1px solid #fcd34d;
    transition: all 0.3s ease;
}

.payment-system.dark .status-waiting {
    background: #451a03;
    color: #fdba74;
    border-color: #92400e;
}

.payment-success {
    text-align: center;
    padding: 40px 20px;
    background: #f0fdf4;
    border-radius: 12px;
    border: 1px solid #bbf7d0;
    width: 100%;
    transition: all 0.3s ease;
}

.payment-system.dark .payment-success {
    background: #052e16;
    border-color: #166534;
    color: #bbf7d0;
}

.success-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.payment-success h3 {
    margin: 0 0 12px 0;
    color: #059669;
    font-size: 18px;
    font-weight: 700;
}

.payment-system.dark .payment-success h3 {
    color: #34d399;
}

.payment-success p {
    margin: 8px 0;
    font-size: 14px;
    color: #374151;
}

.payment-system.dark .payment-success p {
    color: #d1fae5;
}

/* Invoice Styles */
.invoice-preview {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    height: fit-content;
    transition: all 0.3s ease;
}

.payment-system.dark .invoice-preview {
    background: #1e293b;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    color: #e2e8f0;
}

.invoice-header {
    text-align: center;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 20px;
    margin-bottom: 20px;
}

.payment-system.dark .invoice-header {
    border-bottom-color: #334155;
}

.invoice-header h2 {
    margin: 0 0 8px 0;
    color: #1e293b;
    font-size: 18px;
    font-weight: 700;
}

.payment-system.dark .invoice-header h2 {
    color: #f1f5f9;
}

.invoice-header p {
    margin: 0;
    color: #64748b;
    font-weight: 600;
    font-size: 13px;
}

.payment-system.dark .invoice-header p {
    color: #94a3b8;
}

.invoice-info {
    margin-bottom: 20px;
    background: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.payment-system.dark .invoice-info {
    background: #334155;
}

.info-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid #f1f5f9;
    font-size: 13px;
}

.payment-system.dark .info-row {
    border-bottom-color: #475569;
    color: #e2e8f0;
}

.info-row:last-child {
    border-bottom: none;
}

.invoice-services {
    margin-bottom: 20px;
}

.invoice-services h4 {
    margin: 0 0 12px 0;
    color: #374151;
    font-size: 14px;
    font-weight: 600;
}

.payment-system.dark .invoice-services h4 {
    color: #e2e8f0;
}

.service-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
    font-size: 13px;
}

.payment-system.dark .service-row {
    border-bottom-color: #475569;
    color: #e2e8f0;
}

.service-row:last-child {
    border-bottom: none;
}

.invoice-footer {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 2px solid #e2e8f0;
}

.payment-system.dark .invoice-footer {
    border-top-color: #334155;
}

.footer-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

/* Print Styles */
@media print {
    .payment-header,
    .patients-panel,
    .footer-actions .btn.secondary,
    .theme-toggle {
        display: none !important;
    }
    
    .payment-layout {
        display: block;
        height: auto;
    }
    
    .payment-panel {
        padding: 0;
        background: white;
    }
    
    .invoice-preview {
        box-shadow: none;
        max-width: none;
        margin: 0;
        padding: 20px;
        background: white !important;
        color: #000 !important;
    }
    
    .invoice-info {
        background: #f8f9fa !important;
    }
    
    .payment-summary {
        background: #f8f9fa !important;
        border: 1px solid #dee2e6 !important;
    }
}

/* Responsive Design */
@media (max-width: 1024px) {
    .payment-layout {
        height: auto;
        min-height: calc(100vh - 73px);
    }
    
    .patients-panel {
        width: 320px;
        min-width: 320px;
    }
}

@media (max-width: 768px) {
    .payment-layout {
        flex-direction: column;
        height: auto;
    }
    
    .patients-panel {
        width: 100%;
        min-width: 100%;
        height: 300px;
        border-right: none;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .payment-system.dark .patients-panel {
        border-bottom-color: #334155;
    }
    
    .payment-panel {
        padding: 16px;
        min-height: 400px;
    }
    
    .payment-form,
    .vietqr-payment,
    .invoice-preview {
        max-width: 100%;
        padding: 20px;
    }
    
    .vietqr-display {
        text-align: center;
    }
    
    .qr-code {
        width: 200px;
        height: 200px;
    }
    
    .payment-steps {
        max-width: 100%;
    }
    
    .footer-actions {
        flex-direction: column;
    }
    
    .amount-buttons {
        flex-direction: column;
    }
    
    .bank-details .detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }
    
    .bank-details .content {
        max-width: 100%;
    }
}

@media (max-width: 480px) {
    .payment-header {
        padding: 12px 16px;
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }
    
    .header-actions {
        align-self: flex-end;
    }
    
    .payment-header h1 {
        font-size: 18px;
    }
    
    .subtitle {
        font-size: 12px;
    }
    
    .panel-header {
        padding: 16px;
    }
    
    .patient-card {
        padding: 12px;
    }
    
    .payment-form,
    .invoice-preview {
        padding: 16px;
    }
    
    .qr-code {
        width: 180px;
        height: 180px;
    }
    
    .patient-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .status-badge {
        align-self: flex-start;
    }
}

/* Scrollbar Styling */
.patients-list::-webkit-scrollbar {
    width: 6px;
}

.patients-list::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.patients-list::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

.patients-list::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.payment-system.dark .patients-list::-webkit-scrollbar-track {
    background: #334155;
}

.payment-system.dark .patients-list::-webkit-scrollbar-thumb {
    background: #475569;
}

.payment-system.dark .patients-list::-webkit-scrollbar-thumb:hover {
    background: #64748b;
}

.payment-panel::-webkit-scrollbar {
    width: 6px;
}

.payment-panel::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.payment-panel::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

.payment-panel::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.payment-system.dark .payment-panel::-webkit-scrollbar-track {
    background: #1e293b;
}

.payment-system.dark .payment-panel::-webkit-scrollbar-thumb {
    background: #475569;
}

.payment-system.dark .payment-panel::-webkit-scrollbar-thumb:hover {
    background: #64748b;
}

/* Animation enhancements */
.patient-card {
    animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.payment-form,
.vietqr-payment,
.invoice-preview {
    animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Loading states */
.btn:disabled {
    position: relative;
}

.btn:disabled::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* Focus styles for accessibility */
.btn:focus,
.search-input:focus,
.status-filter:focus,
.amount-input:focus,
.method-select:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .payment-system {
        background: white;
    }
    
    .payment-system.dark {
        background: #000;
    }
    
    .patient-card {
        border: 2px solid #000;
    }
    
    .payment-system.dark .patient-card {
        border: 2px solid #fff;
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    .patient-card,
    .payment-form,
    .vietqr-payment,
    .invoice-preview,
    .btn {
        transition: none;
        animation: none;
    }
    
    .loading-spinner {
        animation-duration: 2s;
    }
}

/* Smooth theme transition */
* {
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
`;

// Inject styles
const style = document.createElement('style');
style.innerHTML = paymentStyles;
document.head.appendChild(style);

export default Payment;