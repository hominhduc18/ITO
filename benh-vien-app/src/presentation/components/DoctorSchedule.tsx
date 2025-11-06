import React, { useState, useEffect, createContext, useContext } from 'react';
import './DoctorSchedule.css';

const DOCTOR_SCHEDULES = [
    {
        id: 'BS001',
        name: 'BS. Nguyễn Văn A',
        specialization: 'Khám Bệnh',
        schedule: [
            { day: 'Thứ 2', time: '07:00 - 11:30', room: 'Phòng 101', type: 'Khám thường' },
            { day: 'Thứ 2', time: '13:00 - 17:00', room: 'Phòng 101', type: 'Khám thường' },
            { day: 'Thứ 3', time: '07:00 - 11:30', room: 'Phòng 102', type: 'Khám thường' },
            { day: 'Thứ 4', time: '07:00 - 11:30', room: 'Phòng 101', type: 'Khám theo yêu cầu' },
            { day: 'Thứ 5', time: '13:00 - 17:00', room: 'Phòng 103', type: 'Khám thường' },
            { day: 'Thứ 6', time: '07:00 - 11:30', room: 'Phòng 101', type: 'Khám thường' }
        ]
    },
    {
        id: 'BS002',
        name: 'BS. Trần Thị B',
        specialization: 'Nội khoa',
        schedule: [
            { day: 'Thứ 2', time: '13:00 - 17:00', room: 'Phòng 102', type: 'Khám thường' },
            { day: 'Thứ 3', time: '07:00 - 11:30', room: 'Phòng 101', type: 'Khám theo yêu cầu' },
            { day: 'Thứ 4', time: '07:00 - 11:30', room: 'Phòng 103', type: 'Khám thường' },
            { day: 'Thứ 5', time: '13:00 - 17:00', room: 'Phòng 102', type: 'Khám thường' },
            { day: 'Thứ 6', time: '07:00 - 11:30', room: 'Phòng 102', type: 'Khám thường' }
        ]
    },
    {
        id: 'BS003',
        name: 'BS. Lê Văn C',
        specialization: 'Khám Bệnh',
        schedule: [
            { day: 'Thứ 2', time: '07:00 - 11:30', room: 'Phòng 201', type: 'Khám thường' },
            { day: 'Thứ 3', time: '13:00 - 17:00', room: 'Phòng 201', type: 'Khám thường' },
            { day: 'Thứ 4', time: '07:00 - 11:30', room: 'Phòng 202', type: 'Khám theo yêu cầu' },
            { day: 'Thứ 5', time: '07:00 - 11:30', room: 'Phòng 201', type: 'Khám thường' }
        ]
    },
    {
        id: 'BS005',
        name: 'BS. Hoàng Văn E',
        specialization: 'Sản phụ khoa',
        schedule: [
            { day: 'Thứ 2', time: '07:00 - 11:30', room: 'Phòng 301', type: 'Khám thường' },
            { day: 'Thứ 3', time: '13:00 - 17:00', room: 'Phòng 301', type: 'Khám thai' },
            { day: 'Thứ 4', time: '07:00 - 11:30', room: 'Phòng 302', type: 'Khám phụ khoa' },
            { day: 'Thứ 5', time: '07:00 - 11:30', room: 'Phòng 301', type: 'Khám thai' },
            { day: 'Thứ 6', time: '13:00 - 17:00', room: 'Phòng 301', type: 'Khám thường' }
        ]
    }
];

const DAYS_OF_WEEK = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

// Types
interface ScheduleSession {
    day: string;
    time: string;
    room: string;
    type: string;
}

interface Doctor {
    id: string;
    name: string;
    specialization: string;
    schedule: ScheduleSession[];
}

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

// Theme Context
const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: false,
    toggleTheme: () => {}
});

// Theme Toggle Component
const ThemeToggle: React.FC = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
        >
            {isDarkMode ? '☀️' : '🌙'}
        </button>
    );
};

export const DoctorSchedule: React.FC = () => {
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(DOCTOR_SCHEDULES[0]);
    const [filterDay, setFilterDay] = useState<string>('');
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    // Load theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('doctor-schedule-theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        } else {
            setIsDarkMode(true);
        }
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('doctor-schedule-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Lọc lịch làm việc theo ngày
    const filteredSchedule = filterDay
        ? selectedDoctor.schedule.filter(item => item.day === filterDay)
        : selectedDoctor.schedule;

    // Nhóm lịch theo ngày
    const scheduleByDay = DAYS_OF_WEEK.map(day => ({
        day,
        sessions: selectedDoctor.schedule.filter(item => item.day === day)
    }));

    const getTypeColor = (type: string): string => {
        switch(type) {
            case 'Khám theo yêu cầu': return '#dc2626';
            case 'Khám thai': return '#7c3aed';
            case 'Khám phụ khoa': return '#db2777';
            case 'Khám thường': return '#059669';
            default: return '#6b7280';
        }
    };

    const getTypeColorLight = (type: string): string => {
        switch(type) {
            case 'Khám theo yêu cầu': return '#fef2f2';
            case 'Khám thai': return '#faf5ff';
            case 'Khám phụ khoa': return '#fdf2f8';
            case 'Khám thường': return '#f0fdf4';
            default: return '#f9fafb';
        }
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <div className={`doctor-schedule ${isDarkMode ? 'dark' : ''}`}>
                <div className="schedule-header">
                    <div className="header-content">
                        <h1>📅 Lịch Làm Việc Bác Sĩ</h1>

                    </div>
                    <ThemeToggle />
                </div>

                <div className="schedule-container">
                    <div className="control-panel">
                        <div className="control-group">
                            <label className="control-label">
                                Chọn bác sĩ:
                            </label>
                            <select
                                value={selectedDoctor.id}
                                onChange={(e) => {
                                    const doctor = DOCTOR_SCHEDULES.find(d => d.id === e.target.value);
                                    if (doctor) {
                                        setSelectedDoctor(doctor);
                                        setFilterDay('');
                                    }
                                }}
                                className="control-select"
                            >
                                {DOCTOR_SCHEDULES.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.name} - {doctor.specialization}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="control-group">
                            <label className="control-label">
                                Lọc theo ngày:
                            </label>
                            <select
                                value={filterDay}
                                onChange={(e) => setFilterDay(e.target.value)}
                                className="control-select"
                            >
                                <option value="">Tất cả các ngày</option>
                                {DAYS_OF_WEEK.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="doctor-info">
                        <div className="doctor-avatar">
                            <span className="avatar-icon">👨‍⚕️</span>
                        </div>
                        <div className="doctor-details">
                            <h3 className="doctor-name">{selectedDoctor.name}</h3>
                            <p className="doctor-specialization">{selectedDoctor.specialization}</p>
                            <div className="schedule-stats">
                                <span className="stat-item">
                                    <strong>{selectedDoctor.schedule.length}</strong> ca làm việc
                                </span>
                                <span className="stat-item">
                                    <strong>{new Set(selectedDoctor.schedule.map(s => s.day)).size}</strong> ngày làm việc
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="schedule-content">
                        <div className="content-header">
                            <h4 className="content-title">
                                {filterDay ? `📋 Lịch làm việc ${filterDay}` : '📅 Lịch làm việc trong tuần'}
                            </h4>
                            <div className="view-indicator">
                                {filterDay ? 'Chế độ xem theo ngày' : 'Chế độ xem theo tuần'}
                            </div>
                        </div>

                        {filterDay ? (
                            <div className="schedule-list">
                                {filteredSchedule.length > 0 ? (
                                    filteredSchedule.map((session, index) => (
                                        <div key={index} className="schedule-item">
                                            <div className="session-time">{session.time}</div>
                                            <div className="session-details">
                                                <div className="session-room">📍 {session.room}</div>
                                                <div
                                                    className="session-type"
                                                    style={{
                                                        backgroundColor: getTypeColorLight(session.type),
                                                        color: getTypeColor(session.type)
                                                    }}
                                                >
                                                    {session.type}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-icon">📭</div>
                                        <p>Không có lịch làm việc vào ngày này</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="weekly-schedule">
                                {scheduleByDay.map(({ day, sessions }) => (
                                    <div key={day} className="day-schedule">
                                        <div className="day-header">
                                            <h5 className="day-title">{day}</h5>
                                            <span className={`session-count ${sessions.length > 0 ? 'has-sessions' : 'no-sessions'}`}>
                                                {sessions.length} ca
                                            </span>
                                        </div>

                                        <div className="sessions-list">
                                            {sessions.length > 0 ? (
                                                sessions.map((session, index) => (
                                                    <div key={index} className="session-card">
                                                        <div className="session-time-small">{session.time}</div>
                                                        <div className="session-room-small">{session.room}</div>
                                                        <div
                                                            className="session-type-badge"
                                                            style={{
                                                                backgroundColor: getTypeColorLight(session.type),
                                                                color: getTypeColor(session.type),
                                                                border: `1px solid ${getTypeColor(session.type)}20`
                                                            }}
                                                        >
                                                            {session.type}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="no-session">
                                                    <span className="rest-icon">😴</span>
                                                    <span>Nghỉ</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ThemeContext.Provider>
    );
};

export default DoctorSchedule;