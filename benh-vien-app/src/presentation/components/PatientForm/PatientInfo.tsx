import React, { useState, useEffect } from 'react';
import { TextInput, Select } from '../Field';

/**
 * Props cho component PatientInfo
 */
interface PatientInfoProps {
    value: any;
    onChange: (data: any) => void;
    errors?: any;
    countries: any[];
    ethnicities: any[];
    insuranceSearch: string;
    setInsuranceSearch: (value: string) => void;
    showInsuranceResults: boolean;
    setShowInsuranceResults: (value: boolean) => void;
    onSelectInsurance: (insurance: string) => void;
    filteredInsurances: string[];
    patients?: any[]; // Danh sách bệnh nhân để tìm kiếm
    onSearchPatients?: (searchTerm: string, searchField: string) => void; // Callback tìm kiếm
    isSearching?: boolean; // Trạng thái loading tìm kiếm
}

/**
 * Component hiển thị form thông tin bệnh nhân
 * Bao gồm các thông tin cá nhân cơ bản và bảo hiểm
 */
export const PatientInfo: React.FC<PatientInfoProps> = ({
                                                            value,
                                                            onChange,
                                                            errors,
                                                            countries,
                                                            ethnicities,
                                                            insuranceSearch,
                                                            setInsuranceSearch,
                                                            showInsuranceResults,
                                                            setShowInsuranceResults,
                                                            onSelectInsurance,
                                                            filteredInsurances,
                                                            patients = [],
                                                            onSearchPatients,
                                                            isSearching = false
                                                        }) => {
    const [searchField, setSearchField] = useState<string>('');
    const [showPatientResults, setShowPatientResults] = useState<boolean>(false);
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    /**
     * Xử lý thay đổi thông tin bệnh nhân
     */
    const handleInputChange = (field: string, fieldValue: string) => {
        onChange({
            [field]: fieldValue,
            isNewPatient: field === 'fullName' && !value.patientId ? true : value.isNewPatient
        });

        // Kích hoạt tìm kiếm khi nhập vào các trường tìm kiếm
        if (['medicalCode', 'fullName', 'phone', 'nationalId'].includes(field) && fieldValue.length >= 2) {
            setSearchField(field);
            setShowPatientResults(true);

            // Debounce search
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }

            const timeout = setTimeout(() => {
                if (onSearchPatients) {
                    onSearchPatients(fieldValue, field);
                }
            }, 500);

            setSearchTimeout(timeout);
        } else if (fieldValue.length === 0) {
            setShowPatientResults(false);
        }
    };

    /**
     * Xử lý focus vào các trường tìm kiếm
     */
    const handleInputFocus = (field: string) => {
        setSearchField(field);
        if (value[field] && value[field].length >= 2) {
            setShowPatientResults(true);
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

        const updatedData = {
            fullName: patient.tenBenhNhan || '',
            nationalId: patient.cmnd || '',
            medicalCode: patient.maYTe?.toString() || '',
            phone: patient.soDienThoai || '',
            dob: patient.ngaySinh ? patient.ngaySinh.split('T')[0] : '',
            gender: mapGender(patient.gioiTinh),
            address: patient.diaChi || '',
            patientId: patient.benhNhan_Id,
            isNewPatient: false
        };

        onChange(updatedData);
        setShowPatientResults(false);
    };

    /**
     * Lọc danh sách bệnh nhân dựa trên từ khóa tìm kiếm
     */
    const filteredPatients = patients.filter(patient => {
        if (!searchField || !value[searchField]) return false;

        const searchTerm = value[searchField].toLowerCase();

        switch (searchField) {
            case 'medicalCode':
                return patient.maYTe?.toString().toLowerCase().includes(searchTerm);
            case 'fullName':
                return patient.tenBenhNhan?.toLowerCase().includes(searchTerm);
            case 'phone':
                return patient.soDienThoai?.toLowerCase().includes(searchTerm);
            case 'nationalId':
                return patient.cmnd?.toLowerCase().includes(searchTerm);
            default:
                return false;
        }
    }).slice(0, 5); // Giới hạn kết quả

    /**
     * Format giới tính để hiển thị
     */
    const formatGender = (gioiTinh?: string) => {
        if (gioiTinh === 'M') return 'Nam';
        if (gioiTinh === 'G') return 'Nữ';
        return 'Khác';
    };

    /**
     * Render kết quả tìm kiếm bệnh nhân
     */
    const renderPatientResults = () => {
        if (!showPatientResults || !searchField || !value[searchField]) return null;

        return (
            <div className="patient-search-results">
                {isSearching ? (
                    <div className="patient-search-loading">
                        🔍 Đang tìm kiếm...
                    </div>
                ) : filteredPatients.length > 0 ? (
                    filteredPatients.map((patient, index) => (
                        <div
                            key={index}
                            className="patient-result-item"
                            onClick={() => handleSelectPatient(patient)}
                        >
                            <div className="patient-name">{patient.tenBenhNhan}</div>
                            <div className="patient-details">
                                {patient.maYTe && <span>Mã YT: {patient.maYTe}</span>}
                                {patient.gioiTinh && <span>Giới tính: {formatGender(patient.gioiTinh)}</span>}
                                {patient.soDienThoai && <span>ĐT: {patient.soDienThoai}</span>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="patient-search-empty">
                        Không tìm thấy bệnh nhân nào
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="form-grid">
            {/* Mã y tế với tìm kiếm */}
            <div className="searchable-field">
                <TextInput
                    label="Mã Y Tế"
                    value={value.medicalCode}
                    onChange={(e: any) => handleInputChange('medicalCode', e.target.value)}
                    onFocus={() => handleInputFocus('medicalCode')}
                    placeholder="Nhập mã y tế để tìm kiếm"
                />
                {renderPatientResults()}
            </div>

            {/* Họ và tên với tìm kiếm */}
            <div className="searchable-field">
                <TextInput
                    label="Họ và tên"
                    required
                    value={value.fullName}
                    onChange={(e: any) => handleInputChange('fullName', e.target.value)}
                    onFocus={() => handleInputFocus('fullName')}
                    placeholder="Nhập họ tên để tìm kiếm"
                    hint={errors?.fullName}
                />
                {renderPatientResults()}
            </div>

            {/* Ngày sinh */}
            <TextInput
                type="date"
                label="Ngày sinh"
                required
                value={value.dob}
                onChange={(e: any) => handleInputChange('dob', e.target.value)}
                hint={errors?.dob}
            />

            {/* Giới tính */}
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
                        value: country.maDonVi,
                        label: country.tenDonVi
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

            {/* Số CCCD/Hộ chiếu với tìm kiếm */}
            <div className="searchable-field">
                <TextInput
                    label="Số CCCD/Hộ chiếu"
                    value={value.nationalId}
                    onChange={(e: any) => handleInputChange('nationalId', e.target.value)}
                    onFocus={() => handleInputFocus('nationalId')}
                    placeholder="Nhập CCCD để tìm kiếm"
                />
                {renderPatientResults()}
            </div>

            {/* Số điện thoại với tìm kiếm */}
            <div className="searchable-field">
                <TextInput
                    label="Số điện thoại"
                    required
                    value={value.phone}
                    onChange={(e: any) => handleInputChange('phone', e.target.value)}
                    onFocus={() => handleInputFocus('phone')}
                    placeholder="Nhập số điện thoại để tìm kiếm"
                    hint={errors?.phone}
                />
                {renderPatientResults()}
            </div>

            {/* Email */}
            <TextInput
                label="Email"
                value={value.email}
                onChange={(e: any) => handleInputChange('email', e.target.value)}
                placeholder="email@example.com"
            />

            {/* Bảo hiểm tư nhân với tính năng tìm kiếm */}
            <div className="insurance-search">
                <TextInput
                    label="Bảo hiểm tư nhân"
                    value={value.insurance}
                    onChange={(e: any) => {
                        handleInputChange('insurance', e.target.value);
                        setInsuranceSearch(e.target.value);
                        setShowInsuranceResults(true);
                    }}
                    onFocus={() => setShowInsuranceResults(true)}
                    placeholder="Chọn hoặc nhập bảo hiểm"
                />

                {/* Dropdown kết quả tìm kiếm bảo hiểm */}
                {showInsuranceResults && insuranceSearch && (
                    <div className="insurance-results">
                        {filteredInsurances.map((insurance, index) => (
                            <div
                                key={index}
                                className="insurance-item"
                                onClick={() => onSelectInsurance(insurance)}
                            >
                                {insurance}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};