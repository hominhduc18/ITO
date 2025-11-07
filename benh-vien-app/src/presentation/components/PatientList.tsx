import React, { useState, useEffect } from 'react';
import './PatientList.css';
import './PatientView.css';

interface Patient {
    benhNhan_Id: number;
    maYTe: number;
    tenBenhNhan: string;
    soDienThoai: string | null;
    cmnd: string | null;
    ngaySinh?: string;
    gioiTinh?: string;
    diaChi?: string;
    ngayTao?: string;
    trangThai?: string;
}

interface PatientListProps {
    onEditPatient: (patient: Patient) => void;
    onViewPatient: (patient: Patient) => void;
    refreshTrigger?: number;
}

export function PatientList({ onEditPatient, onViewPatient, refreshTrigger }: PatientListProps) {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage] = useState(10);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);

    // Load danh sách bệnh nhân
    useEffect(() => {
        loadPatients();
    }, [refreshTrigger]);

    const loadPatients = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/BenhNhan/get-all');
            const result = await response.json();

            if (result.success && result.data) {
                setPatients(result.data);
            } else {
                console.error('Failed to load patients:', result.message);
            }
        } catch (error) {
            console.error('Error loading patients:', error);
        } finally {
            setLoading(false);
        }
    };

    // Xóa bệnh nhân
    const handleDeletePatient = async (patientId: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?')) {
            return;
        }

        try {
            const response = await fetch(`/api/BenhNhan/${patientId}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (result.success) {
                alert('Xóa bệnh nhân thành công!');
                loadPatients(); // Reload danh sách
            } else {
                alert('Xóa thất bại: ' + result.message);
            }
        } catch (error) {
            console.error('Error deleting patient:', error);
            alert('Có lỗi xảy ra khi xóa bệnh nhân');
        }
    };

    // Xem chi tiết bệnh nhân
    const handleViewPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setShowViewModal(true);
        onViewPatient(patient);
    };

    // Chỉnh sửa bệnh nhân
    const handleEditPatient = (patient: Patient) => {
        onEditPatient(patient);
    };

    // Lọc bệnh nhân
    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.tenBenhNhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.maYTe.toString().includes(searchTerm) ||
            (patient.cmnd && patient.cmnd.includes(searchTerm)) ||
            (patient.soDienThoai && patient.soDienThoai.includes(searchTerm));

        const matchesStatus = statusFilter === 'all' || patient.trangThai === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Phân trang
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

    // Format ngày tháng
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('vi-VN');
        } catch {
            return dateString;
        }
    };

    // Format giới tính
    const formatGender = (gioiTinh?: string) => {
        if (gioiTinh === 'M') return 'Nam';
        if (gioiTinh === 'G') return 'Nữ';
        return 'Khác';
    };

    return (
        <div className="patient-list-container">
            <div className="patient-list-header">
                <h2>📋 Danh sách bệnh nhân</h2>
                <div className="patient-list-controls">
                    <input
                        type="text"
                        placeholder="🔍 Tìm theo tên, mã y tế, CCCD, SĐT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="patient-search-box"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="patient-filter-select"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Ngừng hoạt động</option>
                    </select>
                    <button
                        className="btn btn-primary"
                        onClick={loadPatients}
                        style={{ fontSize: '14px', padding: '8px 16px' }}
                    >
                        🔄 Làm mới
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="patient-list-loading">
                    ⏳ Đang tải danh sách bệnh nhân...
                </div>
            ) : filteredPatients.length === 0 ? (
                <div className="patient-list-empty">
                    {searchTerm ? 'Không tìm thấy bệnh nhân nào phù hợp' : 'Chưa có dữ liệu bệnh nhân'}
                </div>
            ) : (
                <>
                    <div className="patient-table-wrapper">
                        <table className="patient-table">
                            <thead>
                            <tr>
                                <th>Mã Y Tế</th>
                                <th>Họ Tên</th>
                                <th>Giới Tính</th>
                                <th>Ngày Sinh</th>
                                <th>Số Điện Thoại</th>
                                <th>CCCD</th>
                                <th>Ngày Tạo</th>
                                <th>Trạng Thái</th>
                                <th>Thao Tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentPatients.map(patient => (
                                <tr key={patient.benhNhan_Id}>
                                    <td>
                                        <strong>{patient.maYTe}</strong>
                                    </td>
                                    <td>
                                        <div className="patient-name">
                                            {patient.tenBenhNhan}
                                        </div>
                                        {patient.diaChi && (
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                {patient.diaChi}
                                            </div>
                                        )}
                                    </td>
                                    <td>{formatGender(patient.gioiTinh)}</td>
                                    <td>{formatDate(patient.ngaySinh)}</td>
                                    <td>{patient.soDienThoai || 'N/A'}</td>
                                    <td>{patient.cmnd || 'N/A'}</td>
                                    <td>{formatDate(patient.ngayTao)}</td>
                                    <td>
                                            <span className={`patient-status-badge ${patient.trangThai === 'active' ? 'status-active' : 'status-inactive'}`}>
                                                {patient.trangThai === 'active' ? '✅ Hoạt động' : '⏸️ Tạm ngừng'}
                                            </span>
                                    </td>
                                    <td>
                                        <div className="patient-actions">
                                            <button
                                                className="action-btn btn-view"
                                                onClick={() => handleViewPatient(patient)}
                                                title="Xem chi tiết"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                className="action-btn btn-edit"
                                                onClick={() => handleEditPatient(patient)}
                                                title="Chỉnh sửa"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="action-btn btn-delete"
                                                onClick={() => handleDeletePatient(patient.benhNhan_Id)}
                                                title="Xóa"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="patient-pagination">
                            <div className="pagination-info">
                                Hiển thị {indexOfFirstPatient + 1}-{Math.min(indexOfLastPatient, filteredPatients.length)} của {filteredPatients.length} bệnh nhân
                            </div>
                            <div className="pagination-controls">
                                <button
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    ← Trước
                                </button>

                                <span className="pagination-page">
                                    Trang {currentPage} / {totalPages}
                                </span>

                                <button
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Sau →
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* View Patient Modal */}
            {showViewModal && selectedPatient && (
                <div className="patient-modal-overlay" onClick={() => setShowViewModal(false)}>
                    <div className="patient-view-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="patient-view-header">
                            <h2>👤 Thông tin chi tiết bệnh nhân</h2>
                            <button
                                className="patient-view-close"
                                onClick={() => setShowViewModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="patient-view-content">
                            <div className="patient-view-section">
                                <h3>Thông tin cá nhân</h3>
                                <div className="patient-info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Mã Y Tế</span>
                                        <span className="info-value">{selectedPatient.maYTe}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Họ và Tên</span>
                                        <span className="info-value">{selectedPatient.tenBenhNhan}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Giới Tính</span>
                                        <span className="info-value">{formatGender(selectedPatient.gioiTinh)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Ngày Sinh</span>
                                        <span className="info-value">{formatDate(selectedPatient.ngaySinh)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Số Điện Thoại</span>
                                        <span className="info-value">{selectedPatient.soDienThoai || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">CCCD/CMND</span>
                                        <span className="info-value">{selectedPatient.cmnd || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedPatient.diaChi && (
                                <div className="patient-view-section">
                                    <h3>Địa chỉ</h3>
                                    <div className="info-item">
                                        <span className="info-label">Địa chỉ đầy đủ</span>
                                        <span className="info-value">{selectedPatient.diaChi}</span>
                                    </div>
                                </div>
                            )}

                            <div className="patient-view-section">
                                <h3>Thông tin hệ thống</h3>
                                <div className="patient-info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Mã Bệnh Nhân</span>
                                        <span className="info-value">{selectedPatient.benhNhan_Id}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Ngày Tạo</span>
                                        <span className="info-value">{formatDate(selectedPatient.ngayTao)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Trạng Thái</span>
                                        <span className={`info-value ${selectedPatient.trangThai === 'active' ? 'status-active' : 'status-inactive'}`}>
                                            {selectedPatient.trangThai === 'active' ? '✅ Hoạt động' : '⏸️ Tạm ngừng'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="patient-view-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleEditPatient(selectedPatient)}
                            >
                                ✏️ Chỉnh sửa
                            </button>
                            <button
                                className="btn"
                                onClick={() => setShowViewModal(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientList;