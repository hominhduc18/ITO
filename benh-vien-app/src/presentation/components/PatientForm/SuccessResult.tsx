import React from 'react';
import { TiepNhanResponse } from '../../types/tiepNhan';

/**
 * Props cho component SuccessResult
 */
interface SuccessResultProps {
    submitResult: TiepNhanResponse;
    onPrint: () => void;
    onNewRegistration: () => void;
}

/**
 * Component hiển thị kết quả đăng ký tiếp nhận thành công
 * Hiển thị thông tin tiếp nhận, thông tin bệnh nhân và danh sách dịch vụ đã đăng ký
 */
export const SuccessResult: React.FC<SuccessResultProps> = ({
                                                                submitResult,
                                                                onPrint,
                                                                onNewRegistration
                                                            }) => {
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

    return (
        <div className="success-card">
            <div className="success-header">
                <h3>✅ Đăng ký tiếp nhận thành công!</h3>
            </div>
            <div className="success-content">
                {/* Thông tin tiếp nhận */}
                <div className="info-grid">
                    <div className="info-item">
                        <label>Mã tiếp nhận:</label>
                        <span className="highlight">{submitResult.tiepNhan_Id}</span>
                    </div>
                    <div className="info-item">
                        <label>Mã y tế:</label>
                        <span>{submitResult.maYTe}</span>
                    </div>
                    <div className="info-item">
                        <label>Bệnh nhân:</label>
                        <span className="patient-name">{submitResult.benhNhan.tenBenhNhan}</span>
                    </div>
                    <div className="info-item">
                        <label>Giới tính:</label>
                        <span>
                            {submitResult.benhNhan.gioiTinh === 'M' ? 'Nam' :
                                submitResult.benhNhan.gioiTinh === 'G' ? 'Nữ' : 'Khác'}
                        </span>
                    </div>
                    <div className="info-item">
                        <label>Ngày sinh:</label>
                        <span>{formatDate(submitResult.benhNhan.ngaySinh)}</span>
                    </div>
                    <div className="info-item">
                        <label>Số điện thoại:</label>
                        <span>{submitResult.benhNhan.soDienThoai}</span>
                    </div>
                    <div className="info-item">
                        <label>Ngày tiếp nhận:</label>
                        <span>{formatDate(submitResult.ngayTiepNhan)}</span>
                    </div>
                    <div className="info-item">
                        <label>Địa chỉ:</label>
                        <span>{submitResult.benhNhan.diaChi}</span>
                    </div>
                </div>

                {/* Danh sách dịch vụ đã đăng ký */}
                {submitResult.lstClsYeuCau && submitResult.lstClsYeuCau.length > 0 && (
                    <div className="services-section">
                        <h4>Dịch vụ đã đăng ký ({submitResult.lstClsYeuCau.length}):</h4>
                        <div className="services-list">
                            {submitResult.lstClsYeuCau.map((service, index) => (
                                <div key={service.clsYeuCau_Id} className="service-item">
                                    <span className="service-number">{index + 1}.</span>
                                    <span className="service-name">Mã DV: {service.dichVu_Id}</span>
                                    <span className="service-quantity">Số lượng: {service.soLuong}</span>
                                    <span className="service-price">
                                        {service.donGia ? service.donGia.toLocaleString() + ' VND' : 'Miễn phí'}
                                    </span>
                                    {service.ghiChu && (
                                        <span className="service-note">Ghi chú: {service.ghiChu}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Các action sau khi đăng ký thành công */}
                <div className="action-buttons" style={{ marginTop: '16px' }}>
                    <button
                        className="btn btn-primary"
                        onClick={onPrint}
                    >
                        🖨️ In phiếu tiếp nhận
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={onNewRegistration}
                    >
                        📝 Đăng ký mới
                    </button>
                </div>
            </div>
        </div>
    );
};