import React from 'react';
import { TextInput, TextArea, Select } from './Field';
import './PatientForm.css';

// Interface cho bệnh nhân từ API
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
}

interface PatientFormProps {
    value: any;
    onChange: (data: any) => void;
    errors?: any;
}

export function PatientForm({ value, onChange, errors }: PatientFormProps) {
    const [showPatientSearch, setShowPatientSearch] = React.useState(false);
    const [showInsuranceSearch, setShowInsuranceSearch] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchType, setSearchType] = React.useState<'maYTe' | 'tenBenhNhan' | 'soDienThoai' | 'cmnd'>('maYTe');
    const [insuranceSearch, setInsuranceSearch] = React.useState('');
    const [isNewPatient, setIsNewPatient] = React.useState(true);
    const [searchResults, setSearchResults] = React.useState<Patient[]>([]);
    const [isSearching, setIsSearching] = React.useState(false);

    // State cho danh mục
    const [countries, setCountries] = React.useState<any[]>([]);
    const [provinces, setProvinces] = React.useState<any[]>([]);
    const [districts, setDistricts] = React.useState<any[]>([]);
    const [wards, setWards] = React.useState<any[]>([]);
    const [ethnicities, setEthnicities] = React.useState<any[]>([]);

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

    // Load danh mục
    React.useEffect(() => {
        loadMasterData();
    }, []);

    const loadMasterData = async () => {
        try {
            // Load quốc tịch
            const countriesRes = await fetch('/api/DanhMuc/quoc-tich');
            if (countriesRes.ok) {
                const countriesData = await countriesRes.json();
                setCountries(countriesData.data || []);
            }

            // Load tỉnh/thành phố
            const provincesRes = await fetch('/api/DanhMuc/tinh-thanh');
            if (provincesRes.ok) {
                const provincesData = await provincesRes.json();
                setProvinces(provincesData.data || []);
            }

            // Load dân tộc
            const ethnicitiesRes = await fetch('/api/DanhMuc/dan-toc');
            if (ethnicitiesRes.ok) {
                const ethnicitiesData = await ethnicitiesRes.json();
                setEthnicities(ethnicitiesData.data || []);
            }
        } catch (error) {
            console.error('Error loading master data:', error);
        }
    };

    // Load quận/huyện khi tỉnh/thành phố thay đổi
    React.useEffect(() => {
        if (value.province) {
            loadDistricts(value.province);
        }
    }, [value.province]);

    // Load xã/phường khi quận/huyện thay đổi
    React.useEffect(() => {
        if (value.district) {
            loadWards(value.district);
        }
    }, [value.district]);

    const loadDistricts = async (provinceCode: string) => {
        try {
            const res = await fetch(`/api/DanhMuc/quan-huyen?tinhThanh=${provinceCode}`);
            if (res.ok) {
                const data = await res.json();
                setDistricts(data.data || []);
            }
        } catch (error) {
            console.error('Error loading districts:', error);
        }
    };

    const loadWards = async (districtCode: string) => {
        try {
            const res = await fetch(`/api/DanhMuc/xa-phuong?quanHuyen=${districtCode}`);
            if (res.ok) {
                const data = await res.json();
                setWards(data.data || []);
            }
        } catch (error) {
            console.error('Error loading wards:', error);
        }
    };

    // Hàm tìm kiếm bệnh nhân từ API
    const searchPatients = async (searchValue: string, searchType: string) => {
        if (!searchValue.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            let apiUrl = '';

            switch (searchType) {
                case 'maYTe':
                    apiUrl = `/api/BenhNhan/GetBenhNhanByMaYTe/${searchValue}`;
                    break;
                case 'tenBenhNhan':
                    apiUrl = `/api/BenhNhan/search?tenBenhNhan=${encodeURIComponent(searchValue)}`;
                    break;
                case 'soDienThoai':
                    apiUrl = `/api/BenhNhan/search?soDienThoai=${encodeURIComponent(searchValue)}`;
                    break;
                case 'cmnd':
                    apiUrl = `/api/BenhNhan/search?cmnd=${encodeURIComponent(searchValue)}`;
                    break;
                default:
                    apiUrl = `/api/BenhNhan/search?keyword=${encodeURIComponent(searchValue)}`;
            }

            const response = await fetch(apiUrl);
            const result = await response.json();

            if (result.success && result.data) {
                setSearchResults(Array.isArray(result.data) ? result.data : [result.data]);
            } else {
                setSearchResults([]);
                console.error('Search failed:', result.message);
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Debounce search
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (showPatientSearch && searchTerm) {
                searchPatients(searchTerm, searchType);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, searchType, showPatientSearch]);

    // Filter insurances based on search
    const filteredInsurances = MOCK_INSURANCES.filter(insurance =>
        insurance.toLowerCase().includes(insuranceSearch.toLowerCase())
    );

    const handleSelectPatient = (patient: Patient) => {
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
        setIsNewPatient(false);
        setShowPatientSearch(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleSelectInsurance = (insurance: string) => {
        onChange({ insurance });
        setShowInsuranceSearch(false);
        setInsuranceSearch('');
    };

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
        setIsNewPatient(true);
        setSearchResults([]);
    };

    const handleNewPatient = () => {
        clearPatientData();
        setIsNewPatient(true);
        setShowPatientSearch(false);
    };

    const handleInputChange = (field: string, fieldValue: string) => {
        onChange({
            [field]: fieldValue,
            isNewPatient: field === 'fullName' && !value.patientId ? true : value.isNewPatient
        });
    };

    // Format date for display
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
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

    // Get placeholder based on search type
    const getSearchPlaceholder = () => {
        switch (searchType) {
            case 'maYTe':
                return 'Nhập mã y tế (VD: 14002832)...';
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

    // Get search description
    const getSearchDescription = () => {
        switch (searchType) {
            case 'maYTe':
                return 'Tìm kiếm bệnh nhân theo mã y tế';
            case 'tenBenhNhan':
                return 'Tìm kiếm bệnh nhân theo họ tên';
            case 'soDienThoai':
                return 'Tìm kiếm bệnh nhân theo số điện thoại';
            case 'cmnd':
                return 'Tìm kiếm bệnh nhân theo số CCCD/Hộ chiếu';
            default:
                return 'Tìm kiếm bệnh nhân';
        }
    };

    return (
        <div className="patient-form">
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

            <p className="form-description">
                {isNewPatient ?
                    "Bệnh nhân mới - Vui lòng nhập đầy đủ thông tin (* bắt buộc)" :
                    "Thông tin bệnh nhân cũ - Có thể cập nhật nếu có thay đổi"
                }
            </p>

            <div className="action-buttons">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPatientSearch(true)}
                >
                    🔍 Tìm bệnh nhân cũ
                </button>

                <button
                    type="button"
                    className="btn"
                    onClick={handleNewPatient}
                >
                    🆕 Tạo bệnh nhân mới
                </button>

                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={clearPatientData}
                >
                    🗑️ Xóa form
                </button>
            </div>

            <div className="form-grid">
                {/* Mã y tế */}
                <TextInput
                    label="Mã Y Tế"
                    value={value.medicalCode}
                    onChange={(e: any) => handleInputChange('medicalCode', e.target.value)}
                    placeholder="Nhập mã y tế để tìm kiếm"
                />

                {/* Họ và tên */}
                <TextInput
                    label="Họ và tên"
                    required
                    value={value.fullName}
                    onChange={(e: any) => handleInputChange('fullName', e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    hint={errors?.fullName}
                />

                <TextInput
                    type="date"
                    label="Ngày sinh"
                    required
                    value={value.dob}
                    onChange={(e: any) => handleInputChange('dob', e.target.value)}
                    hint={errors?.dob}
                />

                <Select
                    label="Giới tính"
                    required
                    value={value.gender}
                    onChange={(e: any) => handleInputChange('gender', e.target.value)}
                    options={[
                        { value: '', label: 'Chọn giới tính' },
                        { value: 'male', label: 'Nam' },
                        { value: 'female', label: 'Nữ' },
                        { value: 'other', label: 'Khác' }
                    ]}
                    hint={errors?.gender}
                />

                {/* Quốc tịch */}
                <Select
                    label="Quốc tịch"
                    value={value.country}
                    onChange={(e: any) => handleInputChange('country', e.target.value)}
                    options={[
                        { value: '', label: 'Chọn quốc tịch' },
                        ...countries.map((country: any) => ({
                            value: country.maQuocGia,
                            label: country.tenQuocGia
                        }))
                    ]}
                />

                {/* Dân tộc */}
                <Select
                    label="Dân tộc"
                    value={value.ethnicity}
                    onChange={(e: any) => handleInputChange('ethnicity', e.target.value)}
                    options={[
                        { value: '', label: 'Chọn dân tộc' },
                        ...ethnicities.map((ethnicity: any) => ({
                            value: ethnicity.maDanToc,
                            label: ethnicity.tenDanToc
                        }))
                    ]}
                />

                {/* Số CCCD */}
                <TextInput
                    label="Số CCCD/Hộ chiếu"
                    value={value.nationalId}
                    onChange={(e: any) => handleInputChange('nationalId', e.target.value)}
                    placeholder="12 số"
                />

                <TextInput
                    label="Số điện thoại"
                    required
                    value={value.phone}
                    onChange={(e: any) => handleInputChange('phone', e.target.value)}
                    placeholder="0912345678"
                    hint={errors?.phone}
                />

                {/* Bảo hiểm tư nhân với search */}
                <div style={{ position: 'relative' }}>
                    <TextInput
                        label="Bảo hiểm tư nhân"
                        value={value.insurance}
                        onChange={(e: any) => handleInputChange('insurance', e.target.value)}
                        placeholder="Chọn hoặc nhập bảo hiểm"
                        onFocus={() => setShowInsuranceSearch(true)}
                    />
                </div>
            </div>

            {/* Address Section */}
            <div className="address-section">
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: 'var(--text-color)' }}>
                    Thông tin địa chỉ
                </h3>

                <div className="address-grid">
                    <Select
                        label="Tỉnh/Thành Phố"
                        value={value.province}
                        onChange={(e: any) => handleInputChange('province', e.target.value)}
                        options={[
                            { value: '', label: 'Chọn tỉnh/thành phố' },
                            ...provinces.map((province: any) => ({
                                value: province.maTinh,
                                label: province.tenTinh
                            }))
                        ]}
                    />

                    <Select
                        label="Quận/Huyện"
                        value={value.district}
                        onChange={(e: any) => handleInputChange('district', e.target.value)}
                        options={[
                            { value: '', label: 'Chọn quận/huyện' },
                            ...districts.map((district: any) => ({
                                value: district.maQuan,
                                label: district.tenQuan
                            }))
                        ]}
                        disabled={!value.province}
                    />

                    <Select
                        label="Xã/Phường"
                        value={value.ward}
                        onChange={(e: any) => handleInputChange('ward', e.target.value)}
                        options={[
                            { value: '', label: 'Chọn xã/phường' },
                            ...wards.map((ward: any) => ({
                                value: ward.maXa,
                                label: ward.tenXa
                            }))
                        ]}
                        disabled={!value.district}
                    />

                    <TextInput
                        label="Số nhà/Tên đường"
                        value={value.street}
                        onChange={(e: any) => handleInputChange('street', e.target.value)}
                        placeholder="Số nhà, tên đường"
                    />
                </div>

                <TextArea
                    label="Địa chỉ đầy đủ"
                    rows={2}
                    value={value.address}
                    onChange={(e: any) => handleInputChange('address', e.target.value)}
                    placeholder="Địa chỉ đầy đủ sẽ tự động điền từ các thông tin trên"
                />
            </div>

            {/* Patient Search Modal */}
            {showPatientSearch && (
                <div className="patient-modal-overlay" onClick={() => setShowPatientSearch(false)}>
                    <div className="patient-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="patient-modal-header">
                            <h3>🔍 Tìm bệnh nhân</h3>
                            <button
                                className="patient-modal-close"
                                onClick={() => setShowPatientSearch(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                                {getSearchDescription()}
                            </p>

                            {/* Search Type Selector */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    className={`btn ${searchType === 'maYTe' ? 'btn-secondary' : ''}`}
                                    onClick={() => setSearchType('maYTe')}
                                    style={{ fontSize: '12px', padding: '6px 12px' }}
                                >
                                    Mã Y Tế
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${searchType === 'tenBenhNhan' ? 'btn-secondary' : ''}`}
                                    onClick={() => setSearchType('tenBenhNhan')}
                                    style={{ fontSize: '12px', padding: '6px 12px' }}
                                >
                                    Họ Tên
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${searchType === 'soDienThoai' ? 'btn-secondary' : ''}`}
                                    onClick={() => setSearchType('soDienThoai')}
                                    style={{ fontSize: '12px', padding: '6px 12px' }}
                                >
                                    Số Điện Thoại
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${searchType === 'cmnd' ? 'btn-secondary' : ''}`}
                                    onClick={() => setSearchType('cmnd')}
                                    style={{ fontSize: '12px', padding: '6px 12px' }}
                                >
                                    CCCD
                                </button>
                            </div>

                            <input
                                type="text"
                                placeholder={getSearchPlaceholder()}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="patient-search-input"
                                autoFocus
                            />
                        </div>

                        <div className="patient-search-results">
                            {isSearching ? (
                                <div className="patient-loading">
                                    🔍 Đang tìm kiếm bệnh nhân...
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="patient-empty">
                                    {searchTerm ? `Không tìm thấy bệnh nhân với ${getSearchDescription().toLowerCase()}` : `Nhập thông tin để tìm kiếm theo ${getSearchDescription().toLowerCase()}`}
                                </div>
                            ) : (
                                searchResults.map(patient => (
                                    <div
                                        key={patient.benhNhan_Id}
                                        className={`patient-item ${value.patientId === patient.benhNhan_Id ? 'selected' : ''}`}
                                        onClick={() => handleSelectPatient(patient)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div className="patient-info">
                                                <div className="patient-name">
                                                    {patient.tenBenhNhan}
                                                </div>
                                                <div className="patient-details">
                                                    <strong>Mã Y tế:</strong> {patient.maYTe} •
                                                    <strong> Giới tính:</strong> {formatGender(patient.gioiTinh)}
                                                </div>
                                                <div className="patient-details">
                                                    {patient.cmnd && <><strong>CCCD:</strong> {patient.cmnd} • </>}
                                                    {patient.soDienThoai && <><strong>ĐT:</strong> {patient.soDienThoai} • </>}
                                                    {patient.ngaySinh && <><strong>Ngày sinh:</strong> {formatDate(patient.ngaySinh)}</>}
                                                </div>
                                                {patient.diaChi && (
                                                    <div className="patient-details">
                                                        <strong>Địa chỉ:</strong> {patient.diaChi}
                                                    </div>
                                                )}
                                            </div>
                                            {value.patientId === patient.benhNhan_Id && (
                                                <span className="patient-selected-badge">
                                                    Đang chọn
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                            <button
                                className="btn btn-primary"
                                onClick={handleNewPatient}
                                style={{ width: '100%', padding: '12px' }}
                            >
                                🆕 Tạo bệnh nhân mới
                            </button>
                        </div>

                        <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
                            {searchResults.length > 0
                                ? `Tìm thấy ${searchResults.length} bệnh nhân • Chọn hoặc tạo mới`
                                : `Nhập thông tin để tìm kiếm theo ${getSearchDescription().toLowerCase()}`
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* Insurance Search Modal */}
            {showInsuranceSearch && (
                <div className="patient-modal-overlay" onClick={() => setShowInsuranceSearch(false)}>
                    <div className="patient-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="patient-modal-header">
                            <h3>🏥 Chọn bảo hiểm</h3>
                            <button
                                className="patient-modal-close"
                                onClick={() => setShowInsuranceSearch(false)}
                            >
                                ×
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Tìm bảo hiểm..."
                            value={insuranceSearch}
                            onChange={(e) => setInsuranceSearch(e.target.value)}
                            className="patient-search-input"
                            autoFocus
                        />

                        <div className="insurance-search-results">
                            {filteredInsurances.map((insurance, index) => (
                                <div
                                    key={index}
                                    className="insurance-item"
                                    onClick={() => handleSelectInsurance(insurance)}
                                >
                                    {insurance}
                                </div>
                            ))}
                        </div>

                        <div className="insurance-hint">
                            Hoặc nhập trực tiếp vào ô bảo hiểm
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PatientForm;