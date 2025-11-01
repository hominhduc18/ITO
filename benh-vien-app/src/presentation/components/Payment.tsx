import React, { useState } from 'react';

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

// Component VietQR
function VietQRPayment({ amount, patient, onSuccess }: { amount: number; patient: any; onSuccess: () => void }) {
    const [showQR, setShowQR] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

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
                    <div className="bank-info">
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

                            <div className="payment-steps">
                                <h4>Hướng dẫn thanh toán:</h4>
                                <ol>
                                    <li>Mở app ngân hàng trên điện thoại</li>
                                    <li>Chọn tính năng "Quét mã QR"</li>
                                    <li>Quét mã bên trên</li>
                                    <li>Xác nhận thanh toán</li>
                                </ol>
                            </div>

                            <div className="payment-status">
                                <div className="status-waiting">
                                    ⏳ Đang chờ thanh toán...
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="payment-success">
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
    const remaining = patient.total - patient.paid;
    const isFullPayment = paymentAmount >= remaining;

    return (
        <div className="payment-form">
            <h2>Thông tin thanh toán</h2>

            <div className="patient-summary">
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

            <div className="payment-summary">
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
                        className="amount-input"
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
                        className="method-select"
                    >
                        <option value="cash">💵 Tiền mặt</option>
                        <option value="vietqr">📱 VietQR</option>
                        <option value="transfer">🏦 Chuyển khoản</option>
                        <option value="card">💳 Thẻ tín dụng</option>
                        <option value="insurance">🛡️ Bảo hiểm</option>
                    </select>

                    {paymentMethod === 'vietqr' && (
                        <div className="method-info">
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
        <div className="invoice-preview">
            <div className="invoice-header">
                <h2>HÓA ĐƠN THANH TOÁN</h2>
                <p>BỆNH VIỆN SAIGON ITO</p>
            </div>

            <div className="invoice-info">
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

            <div className="payment-summary">
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
            case 'pending': return '#dc2626';
            case 'partial': return '#d97706';
            case 'paid': return '#059669';
            default: return '#6b7280';
        }
    };

    return (
        <div className="payment-system">
            <div className="payment-header">
                <h1>Hệ Thống Thanh Toán</h1>
                <p className="subtitle">Quản lý và xử lý thanh toán dịch vụ y tế</p>
            </div>

            <div className="payment-layout">
                {/* Left Panel - Danh sách bệnh nhân */}
                <div className="patients-panel">
                    <div className="panel-header">
                        <h3>Danh sách bệnh nhân</h3>
                        <div className="filters">
                            <input
                                type="text"
                                placeholder="Tìm kiếm bệnh nhân..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="status-filter"
                            >
                                <option value="all">Tất cả</option>
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
                                className={`patient-card ${
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
                        <div className="empty-selection">
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
    );
}


const paymentStyles = `
.payment-system {
    min-height: 100vh;
    background: #f8fafc;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.payment-header {
    background: white;
    padding: 20px;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.payment-header h1 {
    margin: 0;
    color: #1e293b;
    font-size: 24px;
}

.subtitle {
    margin: 4px 0 0 0;
    color: #64748b;
    font-size: 14px;
}

.payment-layout {
    display: flex;
    height: calc(100vh - 80px);
}

.patients-panel {
    width: 400px;
    background: white;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
}

.panel-header {
    padding: 20px;
    border-bottom: 1px solid #e2e8f0;
}

.panel-header h3 {
    margin: 0 0 16px 0;
    color: #1e293b;
    font-size: 18px;
}

.filters {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.search-input, .status-filter {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
}

.search-input:focus, .status-filter:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.patients-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
}

.patient-card {
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.patient-card:hover {
    border-color: #3b82f6;
    background: #f8fafc;
}

.patient-card.selected {
    border-color: #3b82f6;
    background: #eff6ff;
}

.patient-info h4 {
    margin: 0 0 4px 0;
    color: #1e293b;
    font-size: 16px;
}

.patient-info p {
    margin: 0 0 8px 0;
    color: #64748b;
    font-size: 12px;
}

.patient-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.total-amount {
    font-weight: 600;
    color: #1e293b;
    font-size: 14px;
}

.status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    color: white;
    font-size: 11px;
    font-weight: 500;
}

.payment-panel {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.empty-selection {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: #64748b;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.empty-selection h3 {
    margin: 0 0 8px 0;
    color: #374151;
}

.empty-selection p {
    margin: 0;
    font-size: 14px;
}

.payment-form {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
}

.payment-form h2 {
    margin: 0 0 20px 0;
    color: #1e293b;
    font-size: 20px;
}

.patient-summary {
    background: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.patient-summary h3 {
    margin: 0 0 4px 0;
    color: #1e293b;
}

.patient-summary p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
}

.services-list {
    margin-bottom: 20px;
}

.services-list h4 {
    margin: 0 0 12px 0;
    color: #374151;
    font-size: 16px;
}

.service-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
}

.service-item:last-child {
    border-bottom: none;
}

.service-name {
    color: #475569;
    font-size: 14px;
}

.service-price {
    font-weight: 600;
    color: #1e293b;
}

.payment-summary {
    background: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
}

.summary-row.total {
    border-top: 1px solid #e2e8f0;
    font-weight: 600;
    color: #1e293b;
    font-size: 16px;
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
    font-size: 14px;
}

.amount-input {
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
}

.amount-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.amount-buttons {
    display: flex;
    gap: 8px;
}

.method-select {
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    background: white;
}

.method-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn {
    padding: 12px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
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
    color: #475569;
    border: 1px solid #e2e8f0;
}

.btn.secondary:hover:not(:disabled) {
    background: #e2e8f0;
}

.payment-btn {
    margin-top: 8px;
}

.vietqr-btn {
    background: linear-gradient(135deg, #10b981, #059669) !important;
}

.vietqr-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669, #047857) !important;
}

.method-info {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 6px;
    padding: 12px;
    font-size: 13px;
    color: #0369a1;
}

/* VietQR Styles */
.vietqr-payment {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.vietqr-header {
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #e2e8f0;
}

.vietqr-header h3 {
    margin: 0 0 8px 0;
    font-size: 20px;
    color: #1e293b;
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
}

.bank-info h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    color: #1e293b;
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
}

.bank-details .detail-item:last-child {
    border-bottom: none;
}

.bank-details .amount {
    font-weight: 600;
    color: #059669;
    font-size: 16px;
}

.bank-details .content {
    font-family: monospace;
    background: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    border: 1px solid #e2e8f0;
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
}

.qr-code {
    width: 250px;
    height: 250px;
    display: block;
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
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
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
    max-width: 400px;
}

.payment-steps h4 {
    margin: 0 0 12px 0;
    font-size: 16px;
    color: #1e293b;
}

.payment-steps ol {
    margin: 0;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.payment-steps li {
    font-size: 14px;
    color: #475569;
}

.payment-status {
    text-align: center;
}

.status-waiting {
    padding: 12px 20px;
    background: #fef3c7;
    color: #92400e;
    border-radius: 8px;
    font-weight: 500;
}

.payment-success {
    text-align: center;
    padding: 40px 20px;
    background: #f0fdf4;
    border-radius: 12px;
    border: 1px solid #bbf7d0;
}

.success-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.payment-success h3 {
    margin: 0 0 12px 0;
    color: #059669;
}

.payment-success p {
    margin: 8px 0;
    font-size: 14px;
    color: #374151;
}

/* Invoice Styles */
.invoice-preview {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
}

.invoice-header {
    text-align: center;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 20px;
    margin-bottom: 20px;
}

.invoice-header h2 {
    margin: 0 0 8px 0;
    color: #1e293b;
    font-size: 24px;
}

.invoice-header p {
    margin: 0;
    color: #64748b;
    font-weight: 600;
}

.invoice-info {
    margin-bottom: 20px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    border-bottom: 1px solid #f1f5f9;
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
}

.service-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
}

.service-row:last-child {
    border-bottom: none;
}

.invoice-footer {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 2px solid #e2e8f0;
}

.footer-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
    .payment-layout {
        flex-direction: column;
        height: auto;
    }
    
    .patients-panel {
        width: 100%;
        height: 300px;
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
}
`;

// Inject styles
const style = document.createElement('style');
style.innerHTML = paymentStyles;
document.head.appendChild(style);

export default Payment;