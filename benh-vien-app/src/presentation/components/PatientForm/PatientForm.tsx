import React, { useState, useEffect } from 'react';
import { PatientFormProps } from '@presentation/models/patient';
import { DonViHanhChinh } from '@presentation/models/administrative';
import { TiepNhanResponse } from '@presentation/models/tiepNhan';
import { PatientInfo } from './PatientInfo';
import { AddressSection } from './AddressSection';
import { SuccessResult } from './SuccessResult';
import { AdministrativeService } from '../../services/administrativeService';
import { PatientService } from '../../services/patientService';
import { TiepNhanService } from '../../services/tiepNhanService';
import './PatientForm.css';

// Định nghĩa giá trị mặc định cho form
const DEFAULT_PATIENT_VALUE = {
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
};

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
    // State cho bảo hiểm
    const [insuranceSearch, setInsuranceSearch] = useState('');
    const [showInsuranceResults, setShowInsuranceResults] = useState(false);

    // State cho danh mục
    const [countries, setCountries] = useState<DonViHanhChinh[]>([]);
    const [provinces, setProvinces] = useState<DonViHanhChinh[]>([]);
    const [districts, setDistricts] = useState<DonViHanhChinh[]>([]);
    const [wards, setWards] = useState<DonViHanhChinh[]>([]);
    const [ethnicities, setEthnicities] = useState<any[]>([]);

    // State cho tìm kiếm bệnh nhân
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // State cho kết quả submit
    const [submitResult, setSubmitResult] = useState<TiepNhanResponse | null>(null);

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

    // Đảm bảo value luôn có tất cả các trường cần thiết
    const formValue = {
        ...DEFAULT_PATIENT_VALUE,
        ...value
    };

    // Xác định xem có phải bệnh nhân mới không
    const isNewPatient = !formValue.patientId;

    /**
     * Load danh mục dữ liệu khi component mount
     * Bao gồm quốc gia, tỉnh thành, dân tộc
     */
    useEffect(() => {
        loadMasterData();
    }, []);

    /**
     * Load quận/huyện khi tỉnh/thành phố thay đổi
     */
    useEffect(() => {
        if (formValue.province) {
            loadDistricts(formValue.province);
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [formValue.province]);

    /**
     * Load xã/phường khi quận/huyện thay đổi
     */
    useEffect(() => {
        if (formValue.district) {
            loadWards(formValue.district);
        } else {
            setWards([]);
        }
    }, [formValue.district]);

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
    const handleSearchPatients = async (searchValue: string, searchField: string) => {
        if (!searchValue || searchValue.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            // Map field name to search type
            const searchTypeMap: { [key: string]: string } = {
                'medicalCode': 'maYTe',
                'fullName': 'tenBenhNhan',
                'phone': 'soDienThoai',
                'nationalId': 'cmnd'
            };

            const searchType = searchTypeMap[searchField] || 'maYTe';
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
     * Xử lý chọn bảo hiểm
     */
    const handleSelectInsurance = (insurance: string) => {
        onChange({
            ...formValue,
            insurance
        });
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
            const result = await TiepNhanService.createTiepNhan(formValue);
            setSubmitResult(result);

            // Gọi callback từ parent component nếu có
            if (onSubmit) {
                await onSubmit(formValue);
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
        if (!formValue.fullName || !formValue.dob || !formValue.gender || !formValue.phone) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Ngày sinh, Giới tính, Số điện thoại)');
            return false;
        }

        return true;
    };

    /**
     * Xóa toàn bộ dữ liệu form
     */
    const clearPatientData = () => {
        onChange(DEFAULT_PATIENT_VALUE);
        setSearchResults([]);
        setSubmitResult(null);
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
                    {formValue.patientId && (
                        <span className="status-badge status-existing">
                            ✅ Bệnh nhân cũ
                        </span>
                    )}
                    {isNewPatient && !formValue.patientId && (
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
                value={formValue}
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
                patients={searchResults}
                onSearchPatients={handleSearchPatients}
                isSearching={isSearching}
            />

            {/* Phần thông tin địa chỉ */}
            <AddressSection
                value={formValue}
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