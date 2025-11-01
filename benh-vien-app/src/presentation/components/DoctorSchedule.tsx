import React, { useState } from 'react'


const DOCTOR_SCHEDULES = [
    {
        id: 'BS001',
        name: 'BS. Nguyễn Văn A',
        specialization: 'Khám Bênh',
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
        specialization: 'Nội',
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
        specialization: 'Khám Bênh',
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
        specialization: 'Khám Bênh',
        schedule: [
            { day: 'Thứ 2', time: '07:00 - 11:30', room: 'Phòng 301', type: 'Khám thường' },
            { day: 'Thứ 3', time: '13:00 - 17:00', room: 'Phòng 301', type: 'Khám thai' },
            { day: 'Thứ 4', time: '07:00 - 11:30', room: 'Phòng 302', type: 'Khám phụ khoa' },
            { day: 'Thứ 5', time: '07:00 - 11:30', room: 'Phòng 301', type: 'Khám thai' },
            { day: 'Thứ 6', time: '13:00 - 17:00', room: 'Phòng 301', type: 'Khám thường' }
        ]
    }
]

const DAYS_OF_WEEK = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']

export function DoctorSchedule() {
    const [selectedDoctor, setSelectedDoctor] = useState(DOCTOR_SCHEDULES[0])
    const [filterDay, setFilterDay] = useState('')

    // Lọc lịch làm việc theo ngày
    const filteredSchedule = filterDay
        ? selectedDoctor.schedule.filter(item => item.day === filterDay)
        : selectedDoctor.schedule

    // Nhóm lịch theo ngày
    const scheduleByDay = DAYS_OF_WEEK.map(day => ({
        day,
        sessions: selectedDoctor.schedule.filter(item => item.day === day)
    }))

    return (
        <div className="doctor-schedule">
            <div className="card">
                <h2>📅 Theo dõi lịch làm việc Bác sĩ</h2>
                <p style={{color:'#6b7280', fontSize:12}}>Xem lịch khám và làm việc của các bác sĩ</p>

                {/* Chọn bác sĩ */}
                <div className="row" style={{marginTop:16}}>
                    <div className="col">
                        <label style={{display:'block', marginBottom:8, fontWeight:'500'}}>
                            Chọn bác sĩ:
                        </label>
                        <select
                            value={selectedDoctor.id}
                            onChange={(e) => {
                                const doctor = DOCTOR_SCHEDULES.find(d => d.id === e.target.value)
                                setSelectedDoctor(doctor || DOCTOR_SCHEDULES[0])
                                setFilterDay('')
                            }}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px'
                            }}
                        >
                            {DOCTOR_SCHEDULES.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.name} - {doctor.specialization}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filter theo ngày */}
                    <div className="col">
                        <label style={{display:'block', marginBottom:8, fontWeight:'500'}}>
                            Lọc theo ngày:
                        </label>
                        <select
                            value={filterDay}
                            onChange={(e) => setFilterDay(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px'
                            }}
                        >
                            <option value="">Tất cả các ngày</option>
                            {DAYS_OF_WEEK.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Thông tin bác sĩ */}
                <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px'
                }}>
                    <h3 style={{margin: '0 0 8px 0', color: '#0369a1'}}>
                        {selectedDoctor.name}
                    </h3>
                    <p style={{margin: '0', color: '#64748b', fontSize: '14px'}}>
                        Chuyên khoa: {selectedDoctor.specialization}
                    </p>
                </div>

                {/* Hiển thị lịch làm việc */}
                <div style={{marginTop: '20px'}}>
                    <h4 style={{margin: '0 0 16px 0'}}>
                        {filterDay ? `Lịch làm việc ${filterDay}` : 'Lịch làm việc trong tuần'}
                    </h4>

                    {filterDay ? (
                        // Hiển thị dạng list khi filter
                        <div className="schedule-list">
                            {filteredSchedule.length > 0 ? (
                                filteredSchedule.map((session, index) => (
                                    <div key={index} className="schedule-item">
                                        <div className="session-time">{session.time}</div>
                                        <div className="session-details">
                                            <div className="session-room">📍 {session.room}</div>
                                            <div className="session-type">{session.type}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    color: '#6b7280',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '8px'
                                }}>
                                    Không có lịch làm việc vào ngày này
                                </div>
                            )}
                        </div>
                    ) : (
                        // Hiển thị dạng weekly view
                        <div className="weekly-schedule">
                            {scheduleByDay.map(({ day, sessions }) => (
                                <div key={day} className="day-schedule">
                                    <div className="day-header">
                                        <h5 style={{margin: '0', color: sessions.length > 0 ? '#1f2937' : '#9ca3af'}}>
                                            {day}
                                        </h5>
                                        <span style={{
                                            fontSize: '12px',
                                            color: sessions.length > 0 ? '#059669' : '#9ca3af'
                                        }}>
                      {sessions.length} ca
                    </span>
                                    </div>

                                    <div className="sessions-list">
                                        {sessions.length > 0 ? (
                                            sessions.map((session, index) => (
                                                <div key={index} className="session-card">
                                                    <div style={{fontWeight: '500', fontSize: '14px'}}>
                                                        {session.time}
                                                    </div>
                                                    <div style={{fontSize: '12px', color: '#6b7280', marginTop: '4px'}}>
                                                        {session.room}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '11px',
                                                        color: session.type === 'Khám theo yêu cầu' ? '#dc2626' :
                                                            session.type === 'Khám thai' ? '#7c3aed' : '#059669',
                                                        marginTop: '2px',
                                                        fontWeight: '500'
                                                    }}>
                                                        {session.type}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#9ca3af',
                                                fontStyle: 'italic',
                                                padding: '8px'
                                            }}>
                                                Nghỉ
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style >{`
        .doctor-schedule {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .row {
          display: flex;
          gap: 16px;
        }
        
        .col {
          flex: 1;
        }
        
        .schedule-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .schedule-item {
          display: flex;
          align-items: center;
          padding: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          gap: 16px;
        }
        
        .session-time {
          font-weight: 600;
          color: #1f2937;
          min-width: 120px;
          font-size: 14px;
        }
        
        .session-details {
          flex: 1;
        }
        
        .session-room {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }
        
        .session-type {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }
        
        .weekly-schedule {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        
        .day-schedule {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .day-header {
          padding: 12px 16px;
          background: #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .sessions-list {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 120px;
        }
        
        .session-card {
          padding: 8px;
          background: white;
          border: 1px solid #f1f5f9;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .session-card:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        
        @media (max-width: 768px) {
          .row {
            flex-direction: column;
          }
          
          .weekly-schedule {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    )
}

export default DoctorSchedule