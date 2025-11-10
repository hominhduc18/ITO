import { TiepNhanResponse } from '@presentation/models/tiepNhan';

/**
 * Service để gọi API tiếp nhận
 * Xử lý việc đăng ký tiếp nhận bệnh nhân và các dịch vụ
 */
export class TiepNhanService {
    /**
     * Gửi yêu cầu tiếp nhận bệnh nhân
     */
    static async createTiepNhan(formData: any): Promise<TiepNhanResponse> {
        try {
            const apiData = this.prepareTiepNhanData(formData);
            console.log('Gửi data đến API tiếp nhận:', apiData);

            const response = await fetch('/api/TiepNhan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Tạo tiếp nhận thất bại');
            }

            console.log('API tiếp nhận response:', result);
            return result.data;

        } catch (error) {
            console.error('Error calling tiep nhan API:', error);
            throw error;
        }
    }

    /**
     * Chuẩn bị dữ liệu để gửi API theo đúng cấu trúc
     */
    private static prepareTiepNhanData(formData: any): any {
        return {
            benhNhan: {
                maYTe: parseInt(formData.patient.medicalCode) || 0,
                tenBenhNhan: formData.patient.fullName,
                tenKhongDau: formData.patient.fullName?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || '',
                ngaySinh: formData.patient.dob ? new Date(formData.patient.dob).toISOString() : new Date().toISOString(),
                gioiTinh: formData.patient.gender === 'male' ? 'M' : formData.patient.gender === 'female' ? 'G' : 'O',
                soDienThoai: formData.patient.phone || '',
                cmnd: formData.patient.nationalId || '',
                ngayCap: new Date().toISOString(),
                quocTich_Id: formData.patient.country ? parseInt(formData.patient.country) : 0,
                tinhThanh_Id: formData.patient.province ? parseInt(formData.patient.province) : 0,
                quanHuyen_Id: formData.patient.district ? parseInt(formData.patient.district) : 0,
                xaPhuong_Id: formData.patient.ward ? parseInt(formData.patient.ward) : 0,
                soNha: formData.patient.street || '',
                diaChi: formData.patient.address || '',
                danToc_Id: formData.patient.ethnicity ? parseInt(formData.patient.ethnicity) : 0,
                email: formData.patient.email || '',
                nguoiLienHe: formData.patient.contactPerson || '',
                soDienThoaiLH: formData.patient.contactPhone || '',
                // Các field mặc định
                nhomMau_Id: 0, mauRh_Id: 0, tienSu: '', ngheNghiep_Id: 0,
                congTy_Id: 0, chiNhanh_Id: 0, tiepNhan_Id_Last: 0, benhAn_Id_Last: 0,
                cls: '', image1: '', image2: '', id_Old: 0, nguoiTao_Id: 0,
                loginTao_Id: 0, ngayTao: new Date().toISOString(), noiLamViec: ''
            },
            // Thông tin tiếp nhận
            ngayTiepNhan: new Date().toISOString(),
            thoiGianTiepNhan: new Date().toISOString(),
            noiTiepNhan_Id: formData.appointment.department ? parseInt(formData.appointment.department) : 1,
            doiTuong_Id: 1, hinhThucDen_Id: 1, uuTien: false, yeuCau: true,
            // Thông tin bảo hiểm
            soTheBHYT: formData.patient.insurance || '',
            bhyT_TuNgay: formData.patient.insuranceFrom || new Date().toISOString(),
            bhyT_DenNgay: formData.patient.insuranceTo || new Date().toISOString(),
            // Các field mặc định khác
            noiGioiThieu_Id: 0, uuDai_Id: 0, theThanhVien_Id: 0,
            the_TuNgay: new Date().toISOString(), the_DenNgay: new Date().toISOString(),
            bhyT_NoiDangKy_Id: 0, bhyT_TuyenKham_Id: 0, chiNhanh_Id: 0, congTy_Id: 0,
            id_Old: 0, nguoiTao_Id: 0, loginTao_Id: 0, ngayTao: new Date().toISOString(),
            ghiChu: formData.appointment.symptoms || '', chanDoan: formData.appointment.diagnosis || '',
            nguoiLienHe: formData.patient.contactPerson || '', soDienThoaiLH: formData.patient.contactPhone || '',
            // Danh sách dịch vụ
            lstClsYeuCau: this.prepareServicesData(formData)
        };
    }

    /**
     * Chuẩn bị dữ liệu dịch vụ
     */
    private static prepareServicesData(formData: any): any[] {
        return formData.orders.map((order: any, index: number) => ({
            dichVu_Id: parseInt(order.id) || 0,
            soLuong: order.quantity || 1,
            donGiaGoc: order.originalPrice || 0,
            donGia: order.price || 0,
            chanDoan: formData.appointment.symptoms || '',
            ghiChu: order.note || '',
            stt: index + 1,
            ngayYeuCau: new Date().toISOString(),
            thoiGianYeuCau: new Date().toISOString(),
            // Các field mặc định cho dịch vụ
            bsChiDinh_Id: 0, noiYeuCau_Id: 0, noiThucHien_Id: 0, benhNhan_Id: 0,
            maYTe: parseInt(formData.patient.medicalCode) || 0, tiepNhan_Id: 0, benhAn_Id: 0,
            nhomDichVu_Id: 0, yLenh_Id: 0, benhAnPhauThuat_Id: 0, thuThuat_Id: 0, loaiGia_Id: 0,
            mien: false, tronGoi: false, heSo: 1, soPhieu: 0, duocPhepThucHien: true,
            daThucHien: false, isGroup: false, soLanDangKy: 1, soLanThucHien: 0,
            daHoaDon: false, phieuThu_Id: 0, phieuChi_Id: 0, huy: false, nguoiHuy_Id: 0,
            loginHuy_Id: 0, ngayHuy: new Date().toISOString(), thucHienBenNgoai: false,
            noiDung: order.note || '', thoiGianGoi: new Date().toISOString(),
            thoiGianKetQua: new Date().toISOString(), chiNhanh_Id: 0, congTy_Id: 0,
            nguoiTao_Id: 0, loginTao_Id: 0, ngayTao: new Date().toISOString(),
            daLayMau: false, hoSoCapCuu: false, giamPhanTram: 0, giamDonGia: 0,
            giamLyDo_Id: 0, mucDoLoaiGia_Id: 0
        }));
    }
}