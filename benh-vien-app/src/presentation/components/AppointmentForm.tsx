import React, { useState, useEffect } from 'react';
import { TextInput, TextArea, Select } from './Field';
import { useDoctors } from '../../../src/presentation/components/hooks/useDoctors';

const DEPARTMENTS = [
    'Khoa Khám Bệnh',
    'Khoa Gây Mê Hồi Sức',
    'Khoa Điều Trị',
    'Khoa Chấn Thương Chỉnh Hình'
];

const ROOMS_BY_DEPARTMENT = {
    'Khoa Khám Bệnh': ['Phòng 101', 'Phòng 102', 'Phòng 103'],
    'Khoa Gây Mê Hồi Sức': ['Phòng 301', 'Phòng 302', 'Phòng 303'],
    'Khoa Điều Trị': ['Phòng 501', 'Phòng 502', 'Phòng 503'],
    'Khoa Chấn Thương Chỉnh Hình': ['Phòng 801', 'Phòng 802', 'Phòng 803'],
};

interface AppointmentFormProps {
    value: {
        department: string;
        room: string;
        doctorId: string;
        preferredDate: string;
        preferredTime: string;
        symptoms: string;
        chiNhanhId?: string;
    };
    onChange: (updates: any) => void;
    errors?: any;
    chiNhanhId?: string;
}

export function AppointmentForm({ value, onChange, errors, chiNhanhId }: AppointmentFormProps) {
    const { doctors, loading: doctorsLoading, error: doctorsError } = useDoctors(value.chiNhanhId || chiNhanhId || '');

    const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);


    useEffect(() => {
        if (!value.department || !doctors.length) {
            setFilteredDoctors([]);
            return;
        }

        // Map department names to match with API data
        const departmentMapping: { [key: string]: string } = {
            'Khoa Khám Bệnh': 'Khám Bệnh',
            'Khoa Gây Mê Hồi Sức': 'Gây Mê Hồi Sức',
            'Khoa Điều Trị': 'Điều Trị',
            'Khoa Chấn Thương Chỉnh Hình': 'Chấn Thương Chỉnh Hình'
        };

        const mappedDepartment = departmentMapping[value.department] || value.department;

        const filtered = doctors.filter(doctor =>
            doctor.tenPhongBan?.includes(mappedDepartment) ||
            doctor.user_Name?.includes(mappedDepartment)
        );

        setFilteredDoctors(filtered);
    }, [value.department, doctors]);

    const getRoomsByDepartment = () => {
        if (!value.department) return [];
        return ROOMS_BY_DEPARTMENT[value.department as keyof typeof ROOMS_BY_DEPARTMENT] || [];
    };

    const handleDepartmentChange = (department: string) => {
        onChange({
            department,
            room: '',
            doctorId: ''
        });
    };

    const handleRoomChange = (room: string) => {
        onChange({ room });
    };

    const handleDoctorChange = (doctorId: string) => {
        const selectedDoctor = filteredDoctors.find(doctor => doctor.user_Id.toString() === doctorId);
        onChange({
            doctorId,
            doctorInfo: selectedDoctor
        });
    };

    const getDoctorOptions = () => {
        if (doctorsLoading) {
            return [{ value: '', label: 'Đang tải danh sách bác sĩ...' }];
        }

        if (doctorsError) {
            return [{ value: '', label: 'Lỗi tải danh sách bác sĩ' }];
        }

        if (!value.department) {
            return [{ value: '', label: '-- Chọn bác sĩ --' }];
        }

        if (filteredDoctors.length === 0) {
            return [{ value: '', label: 'Không có bác sĩ nào cho khoa này' }];
        }

        return [
            { value: '', label: '-- Chọn bác sĩ --' },
            ...filteredDoctors.map(doctor => ({
                value: doctor.user_Id.toString(),
                label: `${doctor.user_Name} (${doctor.user_Code}) - ${doctor.tenPhongBan}`
            }))
        ];
    };

    const getSelectedDoctorInfo = () => {
        if (!value.doctorId) return null;
        return filteredDoctors.find(doctor => doctor.user_Id.toString() === value.doctorId);
    };

    const selectedDoctor = getSelectedDoctorInfo();

    return (
        <div className="card">
            <h2>2) Thông tin khám</h2>
            <p style={{ color: '#6b7280', fontSize: 12 }}>Chọn khoa, phòng và bác sĩ</p>

            <div className="row cols-3" style={{ marginTop: 12 }}>
                <Select
                    label="Khoa khám"
                    required
                    value={value.department}
                    onChange={(e: any) => handleDepartmentChange(e.target.value)}
                    options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
                    hint={errors?.department}
                />

                <Select
                    label="Phòng khám"
                    required
                    value={value.room}
                    onChange={(e: any) => handleRoomChange(e.target.value)}
                    options={[
                        { value: '', label: '-- Chọn phòng --' },
                        ...getRoomsByDepartment().map(room => ({ value: room, label: room }))
                    ]}
                    disabled={!value.department}
                    hint={errors?.room || (!value.department ? 'Vui lòng chọn khoa trước' : '')}
                />

                <Select
                    label="Bác sĩ"
                    required
                    value={value.doctorId}
                    onChange={(e: any) => handleDoctorChange(e.target.value)}
                    options={getDoctorOptions()}
                    disabled={!value.department || doctorsLoading || !!doctorsError}
                    hint={
                        errors?.doctorId ||
                        doctorsError ||
                        (!value.department ? 'Vui lòng chọn khoa trước' : '') ||
                        (doctorsLoading ? 'Đang tải danh sách bác sĩ...' : '')
                    }
                />
            </div>

            <div className="row cols-2" style={{ marginTop: 12 }}>
                <TextInput
                    type="date"
                    label="Ngày khám mong muốn"
                    required
                    value={value.preferredDate}
                    onChange={(e: any) => onChange({ preferredDate: e.target.value })}
                    hint={errors?.preferredDate}
                    min={new Date().toISOString().split('T')[0]} // Không cho chọn ngày trong quá khứ
                />
                <TextInput
                    type="time"
                    label="Giờ khám mong muốn"
                    required
                    value={value.preferredTime}
                    onChange={(e: any) => onChange({ preferredTime: e.target.value })}
                    hint={errors?.preferredTime}
                />
            </div>

            <div style={{ marginTop: 12 }}>
                <TextArea
                    label="Triệu chứng / Lý do khám"
                    rows={3}
                    value={value.symptoms}
                    onChange={(e: any) => onChange({ symptoms: e.target.value })}
                    placeholder="Mô tả chi tiết các triệu chứng và lý do khám bệnh..."
                />
            </div>

            {/* Hiển thị thông tin bác sĩ đã chọn */}
            {selectedDoctor && (
                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px'
                }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#0369a1' }}>Thông tin bác sĩ đã chọn:</h4>
                    <div>
                        <p style={{ margin: '4px 0', fontWeight: '500' }}>
                            {selectedDoctor.user_Name}
                        </p>
                        <p style={{ margin: '4px 0', color: '#64748b', fontSize: '14px' }}>
                            Mã bác sĩ: {selectedDoctor.user_Code}
                        </p>
                        <p style={{ margin: '4px 0', color: '#64748b', fontSize: '14px' }}>
                            Phòng ban: {selectedDoctor.tenPhongBan}
                        </p>
                        {selectedDoctor.english && (
                            <p style={{ margin: '4px 0', color: '#64748b', fontSize: '14px' }}>
                                Tên tiếng Anh: {selectedDoctor.english}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Hiển thị trạng thái loading hoặc error */}
            {doctorsLoading && (
                <div style={{
                    marginTop: '8px',
                    padding: '8px',
                    backgroundColor: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: '#92400e'
                }}>
                    ⏳ Đang tải danh sách bác sĩ...
                </div>
            )}

            {doctorsError && (
                <div style={{
                    marginTop: '8px',
                    padding: '8px',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #ef4444',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: '#dc2626'
                }}>
                    ❌ {doctorsError}
                </div>
            )}
        </div>
    );
}

export default AppointmentForm;