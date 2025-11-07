import React from 'react';
import { PatientFormProps } from '../../types/patient';
import { DonViHanhChinh } from '../../types/administrative';
import { TiepNhanResponse } from '../../types/tiepNhan';
import { PatientSearch } from './PatientSearch';
import { PatientInfo } from './PatientInfo';
import { AddressSection } from './AddressSection';
import { SuccessResult } from './SuccessResult';
import { AdministrativeService } from '../../services/administrativeService';
import { PatientService } from '../../services/patientService';
import { TiepNhanService } from '../../services/tiepNhanService';
import './PatientForm.css';

/**
 * Component chính quản lý form thông tin bệnh nhân và đăng ký tiếp nhận
 * Kết hợp các component con để tạo thành form hoàn chỉnh
 */
export const PatientForm: React.FC<PatientFormProps> = ({
                                                            value,
                                                            onChange,
                                                            errors,
                                                            onSubmit,
                                                            loading = false
                                                        }) => {
    // State cho tìm kiếm bệnh nhân
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchType, setSearchType] = React.useState<'maYTe' | 'tenBenhNhan' | 'soDienThoai' | 'cmnd'>('maYTe');
    const [searchResults, setSearchResults] = React.useState<any[]>([]);
    const [isSearching, setIsSearching] = React.useState(false);

    // State cho bảo hiểm
    const [insuranceSearch, setInsuranceSearch] = React.useState('');
    const [showInsuranceResults, setShowInsuranceResults] = React.useState(false);

    // State cho danh mục
    const [countries, setCountries] = React.useState<DonViHanhChinh[]>([]);
    const [provinces, setProvinces] = React.useState<DonViHanhChinh[]>([]);
    const [districts, setDistricts] = React.useState<DonViHanhChinh[]>([]);
    const [wards, setWards] = React.useState<DonViHanhChinh[]>([]);
    const [ethnicities, setEthnicities] = React.useState<any[]>([]);

    // State cho kết quả submit
    const [submitResult, setSubmitResult] = React.useState<TiepNhanResponse | null>(null);

    // Mock data cho bảo hiểm
    const MOCK_INSURANCES = [
        'Bảo hiểm Bảo Việt',
        'Bảo hiểm BIDV',
        'Bảo hiểm Prudential',
        'Bảo hiểm Manulife',
        'Bảo hiểm AIA',
        'Bảo hiểm Sun Life',
        'Bảo hiểm Generali',
        'Bảo hiểm MIC'
    ];

    // Filter bảo hiểm dựa trên search
    const filteredInsurances = MOCK_INSURANCES.filter(insurance =>
        insurance.toLowerCase().includes(insuranceSearch.toLowerCase())
    );

    // Xác định xem có phải bệnh nhân mới không
    const isNewPatient = !value.patientId;

    /**
     * Load danh mục dữ liệu khi component mount
     * Bao gồm quốc gia, tỉnh thành, dân tộc
     */
    React.useEffect(() => {
        loadMasterData();
    }, []);

    /**
     * Load quận/huyện khi tỉnh/thành phố thay đổi
     */
    React.useEffect(() => {
        if (value.province) {
            loadDistricts(value.province);
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [value.province]);

    /**
     * Load xã/phường khi quận/huyện thay đổi
     */
    React.useEffect(() => {
        if (value.district) {
            loadWards(value.district);
        } else {
            setWards([]);
        }
    }, [value.district]);

    /**
     * Debounce search - Tự động tìm kiếm sau 500ms khi searchTerm thay đổi
     */
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm) {
                handleSearchPatients(searchTerm, searchType);
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, searchType]);

    /**
     * Load danh mục dữ liệu chính
     */
    const loadMasterData = async () => {
        try {
            // Load quốc gia (cap = 1)
            const countriesData = await AdministrativeService.fetchDonViHanhChinh(1);
            setCountries(countriesData);

            // Load tỉnh/thành phố (cap = 2)
            const provincesData = await AdministrativeService.fetchDonViHanhChinh(2);
            setProvinces(provincesData);

            // Load dân tộc
            const ethnicitiesData = await AdministrativeService.loadEthnicities();
            setEthnicities(ethnicitiesData);
        } catch (error) {
            console.error('Error loading master data:', error);
        }
    };

    /**
     * Load danh sách quận/huyện theo tỉnh/thành phố
     */
    const loadDistricts = async (provinceCode: string) => {
        try {
            const districtsData = await AdministrativeService.loadDistricts(provinceCode);
            setDistricts(districtsData);
        } catch (error) {
            console.error('Error loading districts:', error);
            setDistricts([]);
        }
    };

    /**
     * Load danh sách xã/phường theo quận/huyện
     */
    const loadWards = async (districtCode: string) => {
        try {
            const wardsData = await AdministrativeService.loadWards(districtCode);
            setWards(wardsData);
        } catch (error) {
            console.error('Error loading wards:', error);
            setWards([]);
        }
    };

    /**
     * Xử lý tìm kiếm bệnh nhân
     */
    const handleSearchPatients = async (searchValue: string, searchType: string) => {
        setIsSearching(true);
        try {
            const results = await PatientService.searchPatients(searchValue, searchType);
            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    /**
     * Xử lý chọn bệnh nhân từ kết quả tìm kiếm
     */
    const handleSelectPatient = (patient: any) => {
        // Map giới tính từ API (G = Nữ, M = Nam, other = Khác)
        const mapGender = (gioiTinh?: string) => {
            if (gioiTinh === 'M') return 'male';
            if (gioiTinh === 'G') return 'female';
            return 'other';
        };

        onChange({
            fullName: patient.tenBenhNhan,
            nationalId: patient.cmnd || '',
            medicalCode: patient.maYTe.toString(),
            insurance: '',
            phone: patient.soDienThoai || '',
            dob: patient.ngaySinh ? patient.ngaySinh.split('T')[0] : '',
            gender: mapGender(patient.gioiTinh),
            address: patient.diaChi || '',
            country: '',
            ethnicity: '',
            province: '',
            district: '',
            ward: '',
            street: '',
            patientId: patient.benhNhan_Id,
            isNewPatient: false
        });
        setSearchTerm('');
        setSearchResults([]);
    };

    /**
     * Xử lý chọn bảo hiểm
     */
    const handleSelectInsurance = (insurance: string) => {
        onChange({ insurance });
        setShowInsuranceResults(false);
        setInsuranceSearch('');
    };

    /**
     * Xử lý submit form - Gọi API tiếp nhận
     */
    const handleSubmit = async () => {
        if (loading) return;

        try {
            // Validate form trước khi gửi
            if (!validateForm()) return;

            // Gọi API tiếp nhận
            const result = await TiepNhanService.createTiepNhan(value);
            setSubmitResult(result);

            // Gọi callback từ parent component nếu có
            if (onSubmit) {
                await onSubmit(value);
            }

            // Hiển thị thông báo thành công
            alert(`Đăng ký tiếp nhận thành công! Mã tiếp nhận: ${result.tiepNhan_Id}`);

        } catch (error: any) {
            console.error('Submit error:', error);
            alert('Lỗi khi đăng ký tiếp nhận: ' + (error.message || 'Vui lòng thử lại'));
        }
    };

    /**
     * Validate form trước khi submit
     */
    const validateForm = (): boolean => {
        if (!value.patient?.fullName || !value.patient?.dob || !value.patient?.gender || !value.patient?.phone) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Ngày sinh, Giới tính, Số điện thoại)');
            return false;
        }

        if (!value.appointment?.department) {
            alert('Vui lòng chọn khoa/phòng tiếp nhận');
            return false;
        }

        if (!value.orders || value.orders.length === 0) {
            alert('Vui lòng chọn ít nhất một dịch vụ');
            return false;
        }

        return true;
    };

    /**
     * Xóa toàn bộ dữ liệu form
     */
    const clearPatientData = () => {
        onChange({
            fullName: '',
            nationalId: '',
            medicalCode: '',
            insurance: '',
            phone: '',
            dob: '',
            gender: '',
            address: '',
            country: '',
            ethnicity: '',
            province: '',
            district: '',
            ward: '',
            street: '',
            patientId: null,
            isNewPatient: true
        });
        setSearchResults([]);
        setSearchTerm('');
        setSubmitResult(null);
    };

    /**
     * Tạo bệnh nhân mới
     */
    const handleNewPatient = () => {
        clearPatientData();
    };

    /**
     * In phiếu tiếp nhận
     */
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="patient-form">
            {/* Header với thông tin trạng thái */}
            <div className="form-header">
                <h2>1) Thông tin người bệnh</h2>
                <div className="patient-status">
                    {value.patientId && (
                        <span className="status-badge status-existing">
                            ✅ Bệnh nhân cũ
                        </span>
                    )}
                    {isNewPatient && !value.patientId && (
                        <span className="status-badge status-new">
                            🆕 Bệnh nhân mới
                        </span>
                    )}
                </div>
            </div>

            {/* Mô tả form */}
            <p className="form-description">
                {isNewPatient ?
                    "Bệnh nhân mới - Vui lòng nhập đầy đủ thông tin (* bắt buộc)" :
                    "Thông tin bệnh nhân cũ - Có thể cập nhật nếu có thay đổi"
                }
            </p>

            {/* Component tìm kiếm bệnh nhân */}
            <PatientSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchType={searchType}
                setSearchType={setSearchType}
                searchResults={searchResults}
                isSearching={isSearching}
                onSelectPatient={handleSelectPatient}
                onNewPatient={handleNewPatient}
                selectedPatientId={value.patientId}
            />

            {/* Các nút action */}
            <div className="action-buttons">
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={clearPatientData}
                >
                    🗑️ Xóa form
                </button>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? '🔄 Đang xử lý...' : '✅ Đăng ký tiếp nhận'}
                </button>
            </div>

            {/* Hiển thị kết quả thành công */}
            {submitResult && (
                <SuccessResult
                    submitResult={submitResult}
                    onPrint={handlePrint}
                    onNewRegistration={clearPatientData}
                />
            )}

            {/* Form thông tin bệnh nhân */}
            <PatientInfo
                value={value}
                onChange={onChange}
                errors={errors}
                countries={countries}
                ethnicities={ethnicities}
                insuranceSearch={insuranceSearch}
                setInsuranceSearch={setInsuranceSearch}
                showInsuranceResults={showInsuranceResults}
                setShowInsuranceResults={setShowInsuranceResults}
                onSelectInsurance={handleSelectInsurance}
                filteredInsurances={filteredInsurances}
            />

            {/* Phần thông tin địa chỉ */}
            <AddressSection
                value={value}
                onChange={onChange}
                countries={countries}
                provinces={provinces}
                districts={districts}
                wards={wards}
                ethnicities={ethnicities}
            />
        </div>
    );
};

export default PatientForm;