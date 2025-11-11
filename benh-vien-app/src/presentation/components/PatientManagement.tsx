import React, { useState, useEffect } from 'react';
import './PatientManagementSimple.css';

interface Patient {
    benhNhan_Id: number;
    maYTe: string;
    tenBenhNhan: string;
    soDienThoai: string | null;
    cmnd: string | null;
    ngaySinh?: string;
    gioiTinh?: string;
    diaChi?: string;
    email?: string;
}

interface Appointment {
    tiepNhan_Id: number;
    ngayTiepNhan: string;
    thoiGianTiepNhan: string;
    noiTiepNhan: string;
    bacSi: string;
    chanDoan: string;
    ghiChu: string;
}

interface Service {
    dichVu_Id: number;
    tenDichVu: string;
    donGia: number;
    soLuong: number;
    thanhTien: number;
    trangThai: string;
}

interface RegistrationData {
    patient: Patient;
    appointment: Appointment;
    services: Service[];
    tongTien: number;
}

export function PatientManagementSimple() {
    const [searchTerm, setSearchTerm] = useState('');
    const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
    const [selectedRegistration, setSelectedRegistration] = useState<RegistrationData | null>(null);
    const [loading, setLoading] = useState(false);

    // Dữ liệu test
    const mockTestData: RegistrationData[] = [
        {
            patient: {
                benhNhan_Id: 1,
                maYTe: "12345678",
                tenBenhNhan: "Nguyễn Văn A",
                soDienThoai: "0987654321",
                cmnd: "12345566789098",
                ngaySinh: "2019-06-13",
                gioiTinh: "M",
                diaChi: "123, Đại Xuyên, Gia Lai",
                email: "nguyenvana@email.com"
            },
            appointment: {
                tiepNhan_Id: 1001,
                ngayTiepNhan: "2025-11-12",
                thoiGianTiepNhan: "08:09",
                noiTiepNhan: "Khoa Gây Mê Hồi Sức - Phòng 301",
                bacSi: "BS. Trần Văn B",
                chanDoan: "Khám tổng quát",
                ghiChu: "Bệnh nhân mới, cần theo dõi"
            },
            services: [
                {
                    dichVu_Id: 3132,
                    tenDichVu: "Khám bệnh - cấp cứu (PN)",
                    donGia: 200000,
                    soLuong: 1,
                    thanhTien: 200000,
                    trangThai: "Đã hoàn thành"
                },
                {
                    dichVu_Id: 4040,
                    tenDichVu: "Khám bệnh - CTCH (TB)",
                    donGia: 150000,
                    soLuong: 1,
                    thanhTien: 150000,
                    trangThai: "Đang chờ"
                }
            ],
            tongTien: 350000
        },
        {
            patient: {
                benhNhan_Id: 2,
                maYTe: "87654321",
                tenBenhNhan: "Trần Thị B",
                soDienThoai: "0912345678",
                cmnd: "098765432109",
                ngaySinh: "1995-08-20",
                gioiTinh: "F",
                diaChi: "456 Nguyễn Trãi, Hà Nội",
                email: "tranthib@email.com"
            },
            appointment: {
                tiepNhan_Id: 1002,
                ngayTiepNhan: "2025-11-13",
                thoiGianTiepNhan: "14:30",
                noiTiepNhan: "Khoa Kb - Phòng 205",
                bacSi: "BS. Lê Thị C",
                chanDoan: "Khám thai định kỳ",
                ghiChu: "Thai 12 tuần"
            },
            services: [
                {
                    dichVu_Id: 5050,
                    tenDichVu: "Siêu âm thai 4D",
                    donGia: 350000,
                    soLuong: 1,
                    thanhTien: 350000,
                    trangThai: "Đã hoàn thành"
                },
                {
                    dichVu_Id: 6060,
                    tenDichVu: "Xét nghiệm máu",
                    donGia: 180000,
                    soLuong: 1,
                    thanhTien: 180000,
                    trangThai: "Đã hoàn thành"
                },
                {
                    dichVu_Id: 7070,
                    tenDichVu: "Khám sản phụ khoa",
                    donGia: 120000,
                    soLuong: 1,
                    thanhTien: 120000,
                    trangThai: "Đang chờ"
                }
            ],
            tongTien: 650000
        },
        {
            patient: {
                benhNhan_Id: 3,
                maYTe: "11223344",
                tenBenhNhan: "Phạm Văn C",
                soDienThoai: "0905123456",
                cmnd: "036987452103",
                ngaySinh: "1988-03-15",
                gioiTinh: "M",
                diaChi: "789 Lê Lợi, Đà Nẵng",
                email: "phamvanc@email.com"
            },
            appointment: {
                tiepNhan_Id: 1003,
                ngayTiepNhan: "2025-11-14",
                thoiGianTiepNhan: "09:00",
                noiTiepNhan: "Khoa Nội - Phòng 102",
                bacSi: "BS. Nguyễn Văn D",
                chanDoan: "Viêm họng cấp",
                ghiChu: "Sốt nhẹ, đau họng"
            },
            services: [
                {
                    dichVu_Id: 8080,
                    tenDichVu: "Khám nội tổng quát",
                    donGia: 150000,
                    soLuong: 1,
                    thanhTien: 150000,
                    trangThai: "Đã hoàn thành"
                },
                {
                    dichVu_Id: 9090,
                    tenDichVu: "Xét nghiệm CRP",
                    donGia: 120000,
                    soLuong: 1,
                    thanhTien: 120000,
                    trangThai: "Đã hoàn thành"
                }
            ],
            tongTien: 270000
        },
        {
            patient: {
                benhNhan_Id: 4,
                maYTe: "55667788",
                tenBenhNhan: "Lê Thị D",
                soDienThoai: "0978123456",
                cmnd: "025874196325",
                ngaySinh: "1975-12-30",
                gioiTinh: "F",
                diaChi: "321 Trần Hưng Đạo, Cần Thơ",
                email: "lethid@email.com"
            },
            appointment: {
                tiepNhan_Id: 1004,
                ngayTiepNhan: "2025-11-15",
                thoiGianTiepNhan: "16:45",
                noiTiepNhan: "Khoa Ngoại - Phòng 304",
                bacSi: "BS. Võ Văn E",
                chanDoan: "Khám tổng quát trước phẫu thuật",
                ghiChu: "Chuẩn bị mổ ruột thừa"
            },
            services: [
                {
                    dichVu_Id: 1010,
                    tenDichVu: "Khám ngoại tổng quát",
                    donGia: 180000,
                    soLuong: 1,
                    thanhTien: 180000,
                    trangThai: "Đã hoàn thành"
                },
                {
                    dichVu_Id: 1111,
                    tenDichVu: "Chụp X-Quang ngực",
                    donGia: 200000,
                    soLuong: 1,
                    thanhTien: 200000,
                    trangThai: "Đã hoàn thành"
                },
                {
                    dichVu_Id: 1212,
                    tenDichVu: "Điện tâm đồ",
                    donGia: 100000,
                    soLuong: 1,
                    thanhTien: 100000,
                    trangThai: "Đã hoàn thành"
                },
                {
                    dichVu_Id: 1313,
                    tenDichVu: "Xét nghiệm tiểu đường",
                    donGia: 80000,
                    soLuong: 1,
                    thanhTien: 80000,
                    trangThai: "Đang chờ"
                }
            ],
            tongTien: 560000
        }
    ];

    // Load danh sách đăng ký
    const loadRegistrations = async () => {
        setLoading(true);
        try {
            // Giả lập API call
            setTimeout(() => {
                setRegistrations(mockTestData);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Lỗi tải danh sách:', error);
            setLoading(false);
        }
    };

    // Xem chi tiết đăng ký
    const handleViewDetail = (registration: RegistrationData) => {
        setSelectedRegistration(registration);
    };

    // In phiếu đăng ký
    const handlePrint = (registration: RegistrationData) => {
        const printContent = `
            <html>
                <head>
                    <title>Phiếu Đăng Ký Khám Bệnh</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .section { margin-bottom: 15px; }
                        .section-title { font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 5px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                        th { background-color: #f0f0f0; }
                        .total { font-weight: bold; text-align: right; }
                        @media print {
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>PHIẾU ĐĂNG KÝ KHÁM BỆNH</h2>
                        <p>Mã phiếu: ${registration.appointment.tiepNhan_Id}</p>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">THÔNG TIN BỆNH NHÂN</div>
                        <p>Họ tên: ${registration.patient.tenBenhNhan}</p>
                        <p>Mã Y tế: ${registration.patient.maYTe}</p>
                        <p>Ngày sinh: ${formatDate(registration.patient.ngaySinh)}</p>
                        <p>Giới tính: ${formatGender(registration.patient.gioiTinh)}</p>
                        <p>SĐT: ${registration.patient.soDienThoai}</p>
                        <p>CCCD: ${registration.patient.cmnd}</p>
                        <p>Địa chỉ: ${registration.patient.diaChi}</p>
                    </div>

                    <div class="section">
                        <div class="section-title">THÔNG TIN TIẾP NHẬN</div>
                        <p>Ngày tiếp nhận: ${formatDate(registration.appointment.ngayTiepNhan)} ${registration.appointment.thoiGianTiepNhan}</p>
                        <p>Nơi tiếp nhận: ${registration.appointment.noiTiepNhan}</p>
                        <p>Bác sĩ: ${registration.appointment.bacSi}</p>
                        <p>Chẩn đoán: ${registration.appointment.chanDoan}</p>
                        <p>Ghi chú: ${registration.appointment.ghiChu}</p>
                    </div>

                    <div class="section">
                        <div class="section-title">DỊCH VỤ ĐÃ ĐĂNG KÝ</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên dịch vụ</th>
                                    <th>Đơn giá</th>
                                    <th>Số lượng</th>
                                    <th>Thành tiền</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${registration.services.map((service, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${service.tenDichVu}</td>
                                        <td>${formatCurrency(service.donGia)}</td>
                                        <td>${service.soLuong}</td>
                                        <td>${formatCurrency(service.thanhTien)}</td>
                                        <td>${service.trangThai}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <div class="total">Tổng tiền: ${formatCurrency(registration.tongTien)}</div>
                    </div>

                    <div class="no-print" style="margin-top: 20px; text-align: center;">
                        <button onclick="window.print()">🖨️ In phiếu</button>
                        <button onclick="window.close()">Đóng</button>
                    </div>
                </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
        }
    };

    // Format ngày tháng
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    // Format giới tính
    const formatGender = (gender?: string) => {
        switch (gender) {
            case 'M': return 'Nam';
            case 'F': return 'Nữ';
            case 'O': return 'Khác';
            default: return '';
        }
    };

    // Format tiền tệ
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Tính tuổi từ ngày sinh
    const calculateAge = (birthDate?: string) => {
        if (!birthDate) return '';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return `${age} tuổi`;
    };

    // Lọc đăng ký theo tìm kiếm
    const filteredRegistrations = registrations.filter(reg =>
        reg.patient.tenBenhNhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.patient.maYTe.toString().includes(searchTerm) ||
        reg.appointment.tiepNhan_Id.toString().includes(searchTerm)
    );

    useEffect(() => {
        loadRegistrations();
    }, []);

    return (
        <div className="patient-management-simple">
            {/* Header */}
            <div className="pm-header">
                <h1>📋 Quản lý đăng ký khám bệnh</h1>
            </div>

            <div className="pm-layout">
                {/* Danh sách bên trái */}
                <div className="list-section">
                    {/* Thanh tìm kiếm */}
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="🔍 Tìm theo tên bệnh nhân, mã y tế, mã phiếu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button onClick={loadRegistrations} className="refresh-btn" title="Tải lại">
                            🔄
                        </button>
                    </div>

                    {/* Danh sách đăng ký */}
                    <div className="registrations-list">
                        {loading ? (
                            <div className="loading">Đang tải dữ liệu...</div>
                        ) : filteredRegistrations.length === 0 ? (
                            <div className="empty-state">
                                {searchTerm ? 'Không tìm thấy đăng ký nào' : 'Chưa có dữ liệu đăng ký'}
                            </div>
                        ) : (
                            filteredRegistrations.map(registration => (
                                <div
                                    key={registration.appointment.tiepNhan_Id}
                                    className={`registration-card ${selectedRegistration?.appointment.tiepNhan_Id === registration.appointment.tiepNhan_Id ? 'selected' : ''}`}
                                    onClick={() => handleViewDetail(registration)}
                                >
                                    {/* Thông tin chính - nhỏ gọn */}
                                    <div className="compact-info">
                                        <div className="patient-main">
                                            <span className="patient-name">{registration.patient.tenBenhNhan}</span>
                                            <span className="patient-age-gender">
                                                {calculateAge(registration.patient.ngaySinh)} • {formatGender(registration.patient.gioiTinh)}
                                            </span>
                                        </div>
                                        <div className="patient-contact">
                                            <span className="patient-phone">{registration.patient.soDienThoai}</span>
                                            <span className="patient-id">Mã: {registration.patient.maYTe}</span>
                                        </div>
                                    </div>

                                    {/* Thông tin khám */}
                                    <div className="appointment-compact">
                                        <div className="appointment-time">
                                            📅 {formatDate(registration.appointment.ngayTiepNhan)} {registration.appointment.thoiGianTiepNhan}
                                        </div>
                                        <div className="appointment-department">
                                            🏥 {registration.appointment.noiTiepNhan}
                                        </div>
                                        <div className="appointment-doctor">
                                            👨‍⚕️ {registration.appointment.bacSi}
                                        </div>
                                    </div>

                                    {/* Dịch vụ và tổng tiền */}
                                    <div className="services-compact">
                                        <div className="services-count">
                                            🛠️ {registration.services.length} dịch vụ
                                        </div>
                                        <div className="total-amount">
                                            {formatCurrency(registration.tongTien)}
                                        </div>
                                    </div>

                                    {/* Trạng thái và nút in */}
                                    <div className="card-footer">
                                        <span className={`status ${registration.services.some(s => s.trangThai === 'Đang chờ') ? 'pending' : 'completed'}`}>
                                            {registration.services.some(s => s.trangThai === 'Đang chờ') ? '🟡 Đang xử lý' : '🟢 Hoàn thành'}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePrint(registration);
                                            }}
                                            className="action-btn print-btn"
                                            title="In phiếu"
                                        >
                                            🖨️
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chi tiết bên phải */}
                <div className="detail-section">
                    {selectedRegistration ? (
                        <div className="detail-content">
                            <div className="detail-header">
                                <h2>Chi tiết đăng ký khám bệnh</h2>
                                <button
                                    onClick={() => handlePrint(selectedRegistration)}
                                    className="print-btn"
                                >
                                    🖨️ In phiếu
                                </button>
                            </div>

                            {/* Thông tin bệnh nhân */}
                            <div className="info-card">
                                <h3>👤 Thông tin bệnh nhân</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Họ và tên:</label>
                                        <span>{selectedRegistration.patient.tenBenhNhan}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Mã Y tế:</label>
                                        <span>{selectedRegistration.patient.maYTe}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Ngày sinh:</label>
                                        <span>{formatDate(selectedRegistration.patient.ngaySinh)} ({calculateAge(selectedRegistration.patient.ngaySinh)})</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Giới tính:</label>
                                        <span>{formatGender(selectedRegistration.patient.gioiTinh)}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Số điện thoại:</label>
                                        <span>{selectedRegistration.patient.soDienThoai}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>CCCD:</label>
                                        <span>{selectedRegistration.patient.cmnd}</span>
                                    </div>
                                    <div className="info-item full-width">
                                        <label>Địa chỉ:</label>
                                        <span>{selectedRegistration.patient.diaChi}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Email:</label>
                                        <span>{selectedRegistration.patient.email || 'Không có'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin tiếp nhận */}
                            <div className="info-card">
                                <h3>🏥 Thông tin tiếp nhận</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Mã phiếu:</label>
                                        <span>{selectedRegistration.appointment.tiepNhan_Id}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Ngày tiếp nhận:</label>
                                        <span>{formatDate(selectedRegistration.appointment.ngayTiepNhan)} {selectedRegistration.appointment.thoiGianTiepNhan}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Nơi tiếp nhận:</label>
                                        <span>{selectedRegistration.appointment.noiTiepNhan}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Bác sĩ:</label>
                                        <span>{selectedRegistration.appointment.bacSi}</span>
                                    </div>
                                    <div className="info-item full-width">
                                        <label>Chẩn đoán:</label>
                                        <span>{selectedRegistration.appointment.chanDoan}</span>
                                    </div>
                                    <div className="info-item full-width">
                                        <label>Ghi chú:</label>
                                        <span>{selectedRegistration.appointment.ghiChu}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Danh sách dịch vụ */}
                            <div className="info-card">
                                <h3>🛠️ Dịch vụ đã đăng ký</h3>
                                <div className="services-table">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên dịch vụ</th>
                                            <th>Đơn giá</th>
                                            <th>Số lượng</th>
                                            <th>Thành tiền</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedRegistration.services.map((service, index) => (
                                            <tr key={service.dichVu_Id}>
                                                <td>{index + 1}</td>
                                                <td>{service.tenDichVu}</td>
                                                <td>{formatCurrency(service.donGia)}</td>
                                                <td>{service.soLuong}</td>
                                                <td>{formatCurrency(service.thanhTien)}</td>
                                                <td>
                                                    <span className={`status status-${service.trangThai.toLowerCase().replace(' ', '-')}`}>
                                                        {service.trangThai}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                        <tfoot>
                                        <tr>
                                            <td colSpan={4}><strong>Tổng cộng</strong></td>
                                            <td colSpan={2}><strong>{formatCurrency(selectedRegistration.tongTien)}</strong></td>
                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-detail">
                            <div className="empty-icon">📋</div>
                            <h3>Chọn một đăng ký để xem chi tiết</h3>
                            <p>Nhấp vào bất kỳ đăng ký nào trong danh sách bên trái để hiển thị thông tin chi tiết tại đây</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}