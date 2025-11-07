import React, { useState } from 'react';
import './PatientManagementSimple.css';

interface Patient {
    benhNhan_Id: number;
    maYTe: number;
    tenBenhNhan: string;
    soDienThoai: string | null;
    cmnd: string | null;
    ngaySinh?: string;
    gioiTinh?: string;
    diaChi?: string;
}

export function PatientManagementSimple() {
    const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);

    // Form state đơn giản
    const [formData, setFormData] = useState({
        tenBenhNhan: '',
        soDienThoai: '',
        cmnd: '',
        ngaySinh: '',
        gioiTinh: '',
        diaChi: ''
    });

    // Load danh sách bệnh nhân
    const loadPatients = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/BenhNhan/get-all');
            const result = await response.json();
            if (result.success) {
                setPatients(result.data || []);
            }
        } catch (error) {
            console.error('Lỗi tải danh sách:', error);
        } finally {
            setLoading(false);
        }
    };

    // Thêm bệnh nhân mới
    const handleAddPatient = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/BenhNhan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();

            if (result.success) {
                alert('Thêm bệnh nhân thành công!');
                setFormData({ tenBenhNhan: '', soDienThoai: '', cmnd: '', ngaySinh: '', gioiTinh: '', diaChi: '' });
                setActiveTab('list');
                loadPatients();
            }
        } catch (error) {
            alert('Lỗi khi thêm bệnh nhân');
        }
    };

    // Xóa bệnh nhân
    const handleDelete = async (id: number) => {
        if (!confirm('Xóa bệnh nhân này?')) return;

        try {
            const response = await fetch(`/api/BenhNhan/${id}`, { method: 'DELETE' });
            const result = await response.json();

            if (result.success) {
                loadPatients();
            }
        } catch (error) {
            alert('Lỗi khi xóa bệnh nhân');
        }
    };

    // Lọc bệnh nhân theo tìm kiếm
    const filteredPatients = patients.filter(patient =>
        patient.tenBenhNhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.maYTe.toString().includes(searchTerm) ||
        (patient.cmnd && patient.cmnd.includes(searchTerm))
    );

    // Format ngày tháng
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="patient-management-simple">
            {/* Header đơn giản */}
            <div className="pm-header">
                <h1>👥 Quản lý bệnh nhân</h1>
                <div className="pm-actions">
                    <button
                        className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                        onClick={() => setActiveTab('list')}
                    >
                        📋 Danh sách
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
                        onClick={() => setActiveTab('add')}
                    >
                        ➕ Thêm mới
                    </button>
                </div>
            </div>

            {/* Nội dung theo tab */}
            {activeTab === 'list' ? (
                <div className="list-section">
                    {/* Thanh tìm kiếm */}
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="🔍 Tìm theo tên, mã y tế, CCCD..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button onClick={loadPatients} className="refresh-btn">
                            🔄
                        </button>
                    </div>

                    {/* Danh sách bệnh nhân */}
                    <div className="patients-list">
                        {loading ? (
                            <div className="loading">Đang tải...</div>
                        ) : filteredPatients.length === 0 ? (
                            <div className="empty-state">
                                {searchTerm ? 'Không tìm thấy bệnh nhân' : 'Chưa có dữ liệu'}
                            </div>
                        ) : (
                            filteredPatients.map(patient => (
                                <div key={patient.benhNhan_Id} className="patient-card">
                                    <div className="patient-info">
                                        <div className="patient-name">{patient.tenBenhNhan}</div>
                                        <div className="patient-details">
                                            <span>Mã Y tế: <strong>{patient.maYTe}</strong></span>
                                            {patient.soDienThoai && <span>SĐT: {patient.soDienThoai}</span>}
                                            {patient.ngaySinh && <span>Ngày sinh: {formatDate(patient.ngaySinh)}</span>}
                                        </div>
                                        {patient.diaChi && (
                                            <div className="patient-address">{patient.diaChi}</div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(patient.benhNhan_Id)}
                                        className="delete-btn"
                                        title="Xóa"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className="add-section">
                    <form onSubmit={handleAddPatient} className="simple-form">
                        <div className="form-group">
                            <label>Họ và tên *</label>
                            <input
                                type="text"
                                value={formData.tenBenhNhan}
                                onChange={(e) => setFormData({...formData, tenBenhNhan: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input
                                    type="tel"
                                    value={formData.soDienThoai}
                                    onChange={(e) => setFormData({...formData, soDienThoai: e.target.value})}
                                />
                            </div>

                            <div className="form-group">
                                <label>CCCD</label>
                                <input
                                    type="text"
                                    value={formData.cmnd}
                                    onChange={(e) => setFormData({...formData, cmnd: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Ngày sinh</label>
                                <input
                                    type="date"
                                    value={formData.ngaySinh}
                                    onChange={(e) => setFormData({...formData, ngaySinh: e.target.value})}
                                />
                            </div>

                            <div className="form-group">
                                <label>Giới tính</label>
                                <select
                                    value={formData.gioiTinh}
                                    onChange={(e) => setFormData({...formData, gioiTinh: e.target.value})}
                                >
                                    <option value="">Chọn</option>
                                    <option value="M">Nam</option>
                                    <option value="G">Nữ</option>
                                    <option value="O">Khác</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Địa chỉ</label>
                            <textarea
                                value={formData.diaChi}
                                onChange={(e) => setFormData({...formData, diaChi: e.target.value})}
                                rows={3}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn">
                                💾 Lưu bệnh nhân
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('list')}
                                className="cancel-btn"
                            >
                                ↩️ Quay lại
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

