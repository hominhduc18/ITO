import React from 'react'
import { TextInput, TextArea, Select } from './Field'

// Mock data for testing
const MOCK_PATIENTS = [
    {
        id: 1,
        fullName: 'Nguyễn Văn A',
        nationalId: '001100123456',
        insurance: 'Bảo hiểm Bảo Việt',
        phone: '0912345678',
        dob: '1990-01-15',
        gender: 'male',
        address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
        isNew: false
    },
    {
        id: 2,
        fullName: 'Trần Thị B',
        nationalId: '001100123457',
        insurance: 'Bảo hiểm BIDV',
        phone: '0923456789',
        dob: '1985-05-20',
        gender: 'female',
        address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
        isNew: false
    }
];

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

export function PatientForm({ value, onChange, errors }: any) {
    const [showPatientSearch, setShowPatientSearch] = React.useState(false);
    const [showInsuranceSearch, setShowInsuranceSearch] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [insuranceSearch, setInsuranceSearch] = React.useState('');
    const [isNewPatient, setIsNewPatient] = React.useState(true);

    // Filter patients based on search
    const filteredPatients = MOCK_PATIENTS.filter(patient =>
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.nationalId.includes(searchTerm) ||
        patient.phone.includes(searchTerm)
    );

    // Filter insurances based on search
    const filteredInsurances = MOCK_INSURANCES.filter(insurance =>
        insurance.toLowerCase().includes(insuranceSearch.toLowerCase())
    );

    const handleSelectPatient = (patient: any) => {
        onChange({
            fullName: patient.fullName,
            nationalId: patient.nationalId,
            insurance: patient.insurance,
            phone: patient.phone,
            dob: patient.dob,
            gender: patient.gender,
            address: patient.address,
            patientId: patient.id,
            isNewPatient: false
        });
        setIsNewPatient(false);
        setShowPatientSearch(false);
        setSearchTerm('');
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
            insurance: '',
            phone: '',
            dob: '',
            gender: '',
            address: '',
            patientId: null,
            isNewPatient: true
        });
        setIsNewPatient(true);
    };

    const handleNewPatient = () => {
        clearPatientData();
        setIsNewPatient(true);
        setShowPatientSearch(false);
    };

    const handleInputChange = (field: string, fieldValue: string) => {
        onChange({
            [field]: fieldValue,
            // Nếu đang chỉnh sửa thông tin, coi như bệnh nhân mới hoặc đang cập nhật thông tin
            isNewPatient: field === 'fullName' && !value.patientId ? true : value.isNewPatient
        });
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2>1) Thông tin người bệnh</h2>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {value.patientId && (
                        <span style={{
                            fontSize: '12px',
                            padding: '4px 8px',
                            background: '#d1fae5',
                            color: '#065f46',
                            borderRadius: '12px',
                            fontWeight: '500'
                        }}>
              ✅ Bệnh nhân cũ
            </span>
                    )}
                    {isNewPatient && !value.patientId && (
                        <span style={{
                            fontSize: '12px',
                            padding: '4px 8px',
                            background: '#fef3c7',
                            color: '#92400e',
                            borderRadius: '12px',
                            fontWeight: '500'
                        }}>
              🆕 Bệnh nhân mới
            </span>
                    )}
                </div>
            </div>

            <p style={{color:'#6b7280', fontSize:12}}>
                {isNewPatient ?
                    "Bệnh nhân mới - Vui lòng nhập đầy đủ thông tin (* bắt buộc)" :
                    "Thông tin bệnh nhân cũ - Có thể cập nhật nếu có thay đổi"
                }
            </p>

            {/* Search and Action buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <button
                    type="button"
                    className="btn secondary"
                    onClick={() => setShowPatientSearch(true)}
                    style={{ fontSize: '12px', padding: '8px 12px' }}
                >
                    🔍 Tìm bệnh nhân cũ
                </button>

                <button
                    type="button"
                    className="btn"
                    onClick={handleNewPatient}
                    style={{
                        fontSize: '12px',
                        padding: '8px 12px',
                        borderColor: '#3b82f6',
                        color: '#3b82f6'
                    }}
                >
                    🆕 Tạo bệnh nhân mới
                </button>

                <button
                    type="button"
                    className="btn"
                    onClick={clearPatientData}
                    style={{
                        fontSize: '12px',
                        padding: '8px 12px',
                        borderColor: '#fecaca',
                        color: '#dc2626'
                    }}
                >
                    🗑️ Xóa form
                </button>
            </div>

            <div className="row cols-2" style={{marginTop:12}}>
                {/* Họ và tên */}
                <TextInput
                    label="Họ và tên"
                    required
                    value={value.fullName}
                    onChange={(e:any) => handleInputChange('fullName', e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    hint={errors?.fullName}
                />

                <TextInput
                    type="date"
                    label="Ngày sinh"
                    required
                    value={value.dob}
                    onChange={(e:any) => handleInputChange('dob', e.target.value)}
                    hint={errors?.dob}
                />

                <Select
                    label="Giới tính"
                    required
                    value={value.gender}
                    onChange={(e:any) => handleInputChange('gender', e.target.value)}
                    options={[
                        {value:'',label:'Chọn giới tính'},
                        {value:'male',label:'Nam'},
                        {value:'female',label:'Nữ'},
                        {value:'other',label:'Khác'}
                    ]}
                    hint={errors?.gender}
                />

                {/* Số CCCD */}
                <TextInput
                    label="Số CCCD/Hộ chiếu"
                    value={value.nationalId}
                    onChange={(e:any) => handleInputChange('nationalId', e.target.value)}
                    placeholder="12 số"
                />

                <TextInput
                    label="Số điện thoại"
                    required
                    value={value.phone}
                    onChange={(e:any) => handleInputChange('phone', e.target.value)}
                    placeholder="0912345678"
                    hint={errors?.phone}
                />

                {/* Bảo hiểm tư nhân với search */}
                <div style={{ position: 'relative' }}>
                    <TextInput
                        label="Bảo hiểm tư nhân"
                        value={value.insurance}
                        onChange={(e:any) => handleInputChange('insurance', e.target.value)}
                        placeholder="Chọn hoặc nhập bảo hiểm"
                        onFocus={() => setShowInsuranceSearch(true)}
                    />
                </div>
            </div>

            <div style={{marginTop:12}}>
                <TextArea
                    label="Địa chỉ"
                    rows={2}
                    value={value.address}
                    onChange={(e:any) => handleInputChange('address', e.target.value)}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                />
            </div>

            {/* Patient Search Modal */}
            {showPatientSearch && (
                <div className="modal-overlay" onClick={() => setShowPatientSearch(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>🔍 Tìm bệnh nhân</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowPatientSearch(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                                Tìm bệnh nhân đã có trong hệ thống hoặc tạo mới
                            </p>
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Tìm theo tên, số CCCD, số điện thoại..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="search-results" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
                            {filteredPatients.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                                    {searchTerm ? 'Không tìm thấy bệnh nhân phù hợp' : 'Nhập từ khóa để tìm kiếm'}
                                </div>
                            ) : (
                                filteredPatients.map(patient => (
                                    <div
                                        key={patient.id}
                                        className="patient-item"
                                        onClick={() => handleSelectPatient(patient)}
                                        style={{
                                            padding: '12px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            marginBottom: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            background: value.patientId === patient.id ? '#f0f9ff' : 'white'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                                    {patient.fullName}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                    CCCD: {patient.nationalId} • ĐT: {patient.phone}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                    BH: {patient.insurance} • {patient.dob}
                                                </div>
                                            </div>
                                            {value.patientId === patient.id && (
                                                <span style={{
                                                    fontSize: '10px',
                                                    padding: '2px 6px',
                                                    background: '#3b82f6',
                                                    color: 'white',
                                                    borderRadius: '8px'
                                                }}>
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
                                className="btn primary"
                                onClick={handleNewPatient}
                                style={{ width: '100%', padding: '12px' }}
                            >
                                🆕 Tạo bệnh nhân mới
                            </button>
                        </div>

                        <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
                            Tìm thấy {filteredPatients.length} bệnh nhân • Chọn hoặc tạo mới
                        </div>
                    </div>
                </div>
            )}

            {/* Insurance Search Modal */}
            {showInsuranceSearch && (
                <div className="modal-overlay" onClick={() => setShowInsuranceSearch(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>🏥 Chọn bảo hiểm</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowInsuranceSearch(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="search-box" style={{ marginBottom: '16px' }}>
                            <input
                                type="text"
                                placeholder="Tìm bảo hiểm..."
                                value={insuranceSearch}
                                onChange={(e) => setInsuranceSearch(e.target.value)}
                                className="search-input"
                                autoFocus
                            />
                        </div>

                        <div className="search-results" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {filteredInsurances.map((insurance, index) => (
                                <div
                                    key={index}
                                    className="insurance-item"
                                    onClick={() => handleSelectInsurance(insurance)}
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        marginBottom: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {insurance}
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '16px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
                            Hoặc nhập trực tiếp vào ô bảo hiểm
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          padding: 4px;
        }

        .search-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
        }

        .patient-item:hover, .insurance-item:hover {
          background: #f3f4f6;
          border-color: #3b82f6;
        }

        .btn {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .btn.secondary {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .btn.primary {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }

        .btn:hover {
          transform: translateY(-1px);
        }
      `}</style>
        </div>
    )
}

export default PatientForm