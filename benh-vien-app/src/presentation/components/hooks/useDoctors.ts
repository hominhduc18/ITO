import { useState, useEffect } from 'react';
import { DoctorService } from '../../services/doctorService';
import { Doctor } from '@presentation/models/doctor';

export const useDoctors = (chiNhanhId: string) => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            if (!chiNhanhId) {
                setDoctors([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {

                const doctorsData = await DoctorService.getDoctorsByBranch(chiNhanhId);
                setDoctors(doctorsData);
            } catch (err) {
                console.error('Error fetching doctors:', err);
                setError('Đã có lỗi xảy ra khi tải danh sách bác sĩ');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [chiNhanhId]);

    return { doctors, loading, error };
};