import React from 'react';
import { PatientSearchProps } from '@presentation/models/patient';

/**
 * Component tìm kiếm bệnh nhân
 * Cho phép tìm kiếm bệnh nhân theo mã y tế, họ tên, số điện thoại, CCCD
 */
export const PatientSearch: React.FC<PatientSearchProps> = ({
                                                                searchTerm,
                                                                setSearchTerm,
                                                                searchType,
                                                                setSearchType,
                                                                searchResults,
                                                                isSearching,
                                                                onSelectPatient,
                                                                onNewPatient,
                                                                selectedPatientId
                                                            }) => {
    /**
     * Lấy placeholder cho ô tìm kiếm dựa trên loại tìm kiếm
     */
    const getSearchPlaceholder = () => {
        switch (searchType) {
            case 'maYTe':
                return 'Nhập mã y tế...';
            case 'tenBenhNhan':
                return 'Nhập họ tên bệnh nhân...';
            case 'soDienThoai':
                return 'Nhập số điện thoại...';
            case 'cmnd':
                return 'Nhập số CCCD/Hộ chiếu...';
            default:
                return 'Nhập từ khóa tìm kiếm...';
        }
    };

    /**
     * Format ngày tháng để hiển thị
     */
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('vi-VN');
        } catch {
            return dateString;
        }
    };

    /**
     * Format giới tính để hiển thị
     */
    const formatGender = (gioiTinh?: string) => {
        if (gioiTinh === 'M') return 'Nam';
        if (gioiTinh === 'G') return 'Nữ';
        return 'Khác';
    };

    return (
        <div className="search-section">
            <div className="search-section-title">
                🔍 Tìm bệnh nhân cũ
            </div>

            <div className="search-controls">
                {/* Buttons chọn loại tìm kiếm */}
                <div className="search-type-buttons">
                    <button
                        type="button"
                        className={`search-type-btn ${searchType === 'maYTe' ? 'active' : ''}`}
                        onClick={() => setSearchType('maYTe')}
                    >
                        Mã Y Tế
                    </button>
                    <button
                        type="button"
                        className={`search-type-btn ${searchType === 'tenBenhNhan' ? 'active' : ''}`}
                        onClick={() => setSearchType('tenBenhNhan')}
                    >
                        Họ Tên
                    </button>
                    <button
                        type="button"
                        className={`search-type-btn ${searchType === 'soDienThoai' ? 'active' : ''}`}
                        onClick={() => setSearchType('soDienThoai')}
                    >
                        Số ĐT
                    </button>
                    <button
                        type="button"
                        className={`search-type-btn ${searchType === 'cmnd' ? 'active' : ''}`}
                        onClick={() => setSearchType('cmnd')}
                    >
                        CCCD
                    </button>
                </div>

                {/* Ô nhập tìm kiếm và nút tạo mới */}
                <div className="search-input-group">
                    <input
                        type="text"
                        placeholder={getSearchPlaceholder()}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onNewPatient}
                    >
                        🆕 Mới
                    </button>
                </div>
            </div>

            {/* Kết quả tìm kiếm */}
            {searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map(patient => (
                        <div
                            key={patient.benhNhan_Id}
                            className={`patient-item ${selectedPatientId === patient.benhNhan_Id ? 'selected' : ''}`}
                            onClick={() => onSelectPatient(patient)}
                        >
                            <div className="patient-name">
                                {patient.tenBenhNhan}
                            </div>
                            <div className="patient-details">
                                <strong>Mã Y tế:</strong> {patient.maYTe} •
                                <strong> Giới tính:</strong> {formatGender(patient.gioiTinh)} •
                                {patient.ngaySinh && <><strong> Ngày sinh:</strong> {formatDate(patient.ngaySinh)}</>}
                            </div>
                            <div className="patient-details">
                                {patient.cmnd && <><strong>CCCD:</strong> {patient.cmnd} • </>}
                                {patient.soDienThoai && <><strong>ĐT:</strong> {patient.soDienThoai}</>}
                            </div>
                            {selectedPatientId === patient.benhNhan_Id && (
                                <div className="patient-selected-badge">
                                    Đang chọn
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Hiển thị trạng thái loading */}
            {isSearching && (
                <div className="search-loading">
                    🔍 Đang tìm kiếm...
                </div>
            )}

            {/* Hiển thị khi không có kết quả */}
            {searchTerm && !isSearching && searchResults.length === 0 && (
                <div className="search-empty">
                    Không tìm thấy bệnh nhân nào
                </div>
            )}
        </div>
    );
};