// components/Dashboard.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from "i18next";
import './Dashboard.css';

export function Dashboard() {
    const { t } = useTranslation();

    const [stats, setStats] = React.useState({
        totalPatients: 0,
        todayAppointments: 0,
        waitingPatients: 0,
        availableDoctors: 0,
        revenueToday: 0,
        occupiedBeds: 0
    });

    const [appointmentData, setAppointmentData] = React.useState([]);
    const [departmentData, setDepartmentData] = React.useState([]);
    const [selectedTimeRange, setSelectedTimeRange] = React.useState('week');
    const [isLoading, setIsLoading] = React.useState(true);

    // Mock data với delay giả lập API
    React.useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);

            // Giả lập delay call API
            await new Promise(resolve => setTimeout(resolve, 1000));

            setStats({
                totalPatients: 1245,
                todayAppointments: 67,
                waitingPatients: 12,
                availableDoctors: 23,
                revenueToday: 45280000,
                occupiedBeds: 89
            });

            // Sử dụng translation keys cho ngày trong tuần
            setAppointmentData([
                { day: t('monday'), appointments: 45 },
                { day: t('tuesday'), appointments: 52 },
                { day: t('wednesday'), appointments: 38 },
                { day: t('thursday'), appointments: 20 },
                { day: t('friday'), appointments: 55 },
                { day: t('saturday'), appointments: 48 },
                { day: t('sunday'), appointments: 35 }
            ]);

            // Sử dụng translation keys cho khoa
            setDepartmentData([
                { name: t('emergency'), patients: 23, color: '#ef4444' },
                { name: t('treatment'), patients: 45, color: '#3b82f6' },
                { name: t('orthopedics'), patients: 32, color: '#10b981' },
                // { name: t('pediatrics'), patients: 28, color: '#f59e0b' },
                // { name: t('surgery'), patients: 19, color: '#8b5cf6' }
            ]);

            setIsLoading(false);
        };

        loadDashboardData();
    }, [t, selectedTimeRange]);

    // Các sự kiện onclick
    const handleRefreshData = () => {
        setIsLoading(true);
        // Giả lập refresh data
        setTimeout(() => {
            setStats(prev => ({
                ...prev,
                todayAppointments: prev.todayAppointments + Math.floor(Math.random() * 5),
                waitingPatients: prev.waitingPatients + Math.floor(Math.random() * 3) - 1,
                revenueToday: prev.revenueToday + Math.floor(Math.random() * 1000000)
            }));
            setIsLoading(false);
        }, 800);
    };

    const handleViewAllPatients = () => {
        alert('Chuyển đến trang danh sách bệnh nhân');
        // navigate('/patients');
    };

    const handleViewAppointments = () => {
        alert('Chuyển đến trang lịch hẹn');
        // navigate('/appointments');
    };

    const handleViewDoctors = () => {
        alert('Chuyển đến trang quản lý bác sĩ');
        // navigate('/doctors');
    };

    const handleViewRevenue = () => {
        alert('Chuyển đến trang báo cáo doanh thu');
        // navigate('/reports');
    };

    const handleViewBeds = () => {
        alert('Chuyển đến trang quản lý giường bệnh');
        // navigate('/beds');
    };

    const handleTimeRangeChange = (range) => {
        setSelectedTimeRange(range);
        // Ở đây có thể gọi API với range mới
    };

    const handleEmergencyAlert = () => {
        alert('🚨 Kích hoạt cảnh báo khẩn cấp! Liên hệ đội ngũ y tế ngay lập tức.');
    };

    const handleQuickRegistration = () => {
        alert('📝 Mở form đăng ký bệnh nhân nhanh');
        // openQuickRegistrationModal();
    };

    const StatCard = ({ title, value, icon, color, subtitle, onClick }) => (
        <div
            className={`stat-card ${onClick ? 'clickable' : ''}`}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <div className="stat-icon" style={{ background: color }}>
                {icon}
            </div>
            <div className="stat-content">
                <div className="stat-value">
                    {isLoading ? '...' : value}
                </div>
                <div className="stat-title">{title}</div>
                {subtitle && <div className="stat-subtitle">{subtitle}</div>}
            </div>
            {onClick && <div className="stat-arrow">›</div>}
        </div>
    );

    // Biểu đồ đơn giản - cột
    const SimpleBarChart = ({ data, title }) => {
        const maxValue = Math.max(...data.map(item => item.appointments));
        const chartHeight = 200;

        if (isLoading) {
            return (
                <div className="chart-card loading">
                    <h3>{title}</h3>
                    <div className="chart-loading">Đang tải dữ liệu...</div>
                </div>
            );
        }

        return (
            <div className="chart-card">
                <div className="chart-header">
                    <h3>{title}</h3>
                    <div className="chart-controls">
                        <button
                            className={`time-btn ${selectedTimeRange === 'week' ? 'active' : ''}`}
                            onClick={() => handleTimeRangeChange('week')}
                        >
                            Tuần
                        </button>
                        <button
                            className={`time-btn ${selectedTimeRange === 'month' ? 'active' : ''}`}
                            onClick={() => handleTimeRangeChange('month')}
                        >
                            Tháng
                        </button>
                    </div>
                </div>
                <div className="chart-container">
                    {/* Trục Y */}
                    <div className="y-axis">
                        <div className="y-label">{maxValue}</div>
                        <div className="y-label">{Math.round(maxValue * 0.75)}</div>
                        <div className="y-label">{Math.round(maxValue * 0.5)}</div>
                        <div className="y-label">{Math.round(maxValue * 0.25)}</div>
                        <div className="y-label">0</div>
                    </div>

                    <div className="chart-bars">
                        {data.map((item, index) => {
                            const barHeight = maxValue > 0 ? (item.appointments / maxValue) * chartHeight : 0;
                            return (
                                <div key={index} className="bar-column">
                                    <div className="bar-wrapper">
                                        <div
                                            className="bar"
                                            style={{
                                                height: `${barHeight}px`,
                                                background: `linear-gradient(to top, #3b82f6, #60a5fa)`
                                            }}
                                            title={`${item.day}: ${item.appointments} ${t('appointments').toLowerCase()}`}
                                            onClick={() => alert(`Xem chi tiết lịch hẹn ${item.day}`)}
                                        >
                                            <span className="bar-value">{item.appointments}</span>
                                        </div>
                                    </div>
                                    <div className="bar-label">{item.day}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // Biểu đồ đơn giản - tròn
    const SimplePieChart = ({ data, title }) => {
        const total = data.reduce((sum, item) => sum + item.patients, 0);

        if (isLoading) {
            return (
                <div className="chart-card loading">
                    <h3>{title}</h3>
                    <div className="chart-loading">Đang tải dữ liệu...</div>
                </div>
            );
        }

        return (
            <div className="chart-card">
                <h3>{title}</h3>
                <div className="pie-chart">
                    <div
                        className="pie-chart-visual"
                        onClick={() => alert('Xem phân bổ chi tiết theo khoa')}
                    >
                        {data.map((item, index) => {
                            const percentage = total > 0 ? (item.patients / total) * 100 : 0;
                            const startAngle = index === 0 ? 0 :
                                data.slice(0, index).reduce((sum, dept) => sum + (dept.patients / total) * 360, 0);

                            return (
                                <div
                                    key={index}
                                    className="pie-segment"
                                    style={{
                                        backgroundColor: item.color,
                                        transform: `rotate(${startAngle}deg)`,
                                        clipPath: `conic-gradient(from 0deg at 50% 50%, ${item.color} 0% ${percentage}%, transparent ${percentage}% 100%)`
                                    }}
                                    title={`${item.name}: ${item.patients} bệnh nhân (${percentage.toFixed(1)}%)`}
                                />
                            );
                        })}
                        <div className="pie-center">
                            <span className="pie-total">{total}</span>
                            <span className="pie-label">{t('patients')}</span>
                        </div>
                    </div>
                    <div className="pie-legend">
                        {data.map((item, index) => (
                            <div
                                key={index}
                                className="legend-item"
                                onClick={() => alert(`Xem danh sách bệnh nhân khoa ${item.name}`)}
                            >
                                <div
                                    className="legend-color"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="legend-name">{item.name}</span>
                                <span className="legend-value">{item.patients}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading && appointmentData.length === 0) {
        return (
            <div className="dashboard">
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <p>Đang tải dữ liệu dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Header với controls */}
            <div className="dashboard-header">
                <div className="header-left">
                    <h1>{t('dashboardTitle')}</h1>
                    <div className="dashboard-date">
                        {new Date().toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
                <div className="header-controls">
                    <button
                        className="btn primary"
                        onClick={handleQuickRegistration}
                    >
                        📝 Đăng ký nhanh
                    </button>
                    <button
                        className="btn secondary"
                        onClick={handleRefreshData}
                        disabled={isLoading}
                    >
                        {isLoading ? '🔄 Đang tải...' : '🔄 Làm mới'}
                    </button>
                </div>
            </div>

            {/* Thống kê chính với click events */}
            <div className="stats-grid">
                <StatCard
                    title={t('totalPatients')}
                    value={stats.totalPatients.toLocaleString()}
                    icon="👥"
                    color="#3b82f6"
                    subtitle={t('accumulated')}
                    onClick={handleViewAllPatients}
                />
                <StatCard
                    title={t('todayAppointments')}
                    value={stats.todayAppointments}
                    icon="🕒"
                    color="#f59e0b"
                    subtitle={`${stats.waitingPatients} ${t('patientsWaiting')}`}
                    onClick={handleViewAppointments}
                />
                <StatCard
                    title={t('availableDoctors')}
                    value={stats.availableDoctors}
                    icon="👨‍⚕️"
                    color="#10b981"
                    subtitle={t('onDuty')}
                    onClick={handleViewDoctors}
                />
                <StatCard
                    title={t('revenue')}
                    value={`${(stats.revenueToday / 1000000).toFixed(1)}M`}
                    icon="💰"
                    color="#8b5cf6"
                    subtitle={`VND ${t('today')}`}
                    onClick={handleViewRevenue}
                />
                <StatCard
                    title={t('occupiedBeds')}
                    value={`${stats.occupiedBeds}/120`}
                    icon="🏥"
                    color="#ef4444"
                    subtitle={`${Math.round((stats.occupiedBeds / 120) * 100)}% ${t('bedsUsed')}`}
                    onClick={handleViewBeds}
                />
                <StatCard
                    title={t('serviceRate')}
                    value="94%"
                    icon="📈"
                    color="#06b6d4"
                    subtitle={t('thisMonth')}
                    onClick={() => alert('Xem báo cáo chất lượng dịch vụ')}
                />
            </div>

            {/* Biểu đồ */}
            <div className="charts-grid">
                <SimpleBarChart
                    data={appointmentData}
                    title={t('appointmentsByWeek')}
                />
                <SimplePieChart
                    data={departmentData}
                    title={t('patientDistribution')}
                />
            </div>

            {/* Thông tin nhanh với actions */}
            <div className="quick-info">
                <div className="info-card">
                    <div className="card-header">
                        <h3>{t('todayActivities')}</h3>
                        <button
                            className="btn-link"
                            onClick={() => alert('Xem tất cả hoạt động')}
                        >
                            Xem tất cả ›
                        </button>
                    </div>
                    <div className="info-list">
                        <div className="info-item">
                            <span className="info-label">{t('newAdmissions')}:</span>
                            <span className="info-value">18 {t('patients')}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">{t('testsProcessed')}:</span>
                            <span className="info-value">42 {t('samples')}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">{t('discharged')}:</span>
                            <span className="info-value">9 {t('patients')}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">{t('emergencyCases')}:</span>
                            <span
                                className="info-value emergency"
                                onClick={handleEmergencyAlert}
                            >
                                5 {t('cases')} 🚨
                            </span>
                        </div>
                    </div>
                </div>

                <div className="info-card">
                    <h3>{t('alerts')}</h3>
                    <div className="alert-list">
                        <div
                            className="alert-item warning"
                            onClick={() => alert('Xem danh sách bệnh nhân chờ')}
                        >
                            <span>⚠️ 2 {t('patientsWaiting')}</span>
                            <button className="alert-action">Xem</button>
                        </div>
                        <div
                            className="alert-item info"
                            onClick={() => alert('Lên lịch bảo trì')}
                        >
                            <span>ℹ️ {t('maintenanceRequired')}</span>
                            <button className="alert-action">Lên lịch</button>
                        </div>
                        <div className="alert-item success">
                            <span>✅ {t('allDepartments')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="quick-actions-panel">
                <h3>Hành động nhanh</h3>
                <div className="actions-grid">
                    <button className="action-btn" onClick={handleQuickRegistration}>
                        <span className="action-icon">📋</span>
                        <span>Đăng ký BN</span>
                    </button>
                    <button className="action-btn" onClick={() => alert('Tạo lịch hẹn mới')}>
                        <span className="action-icon">📅</span>
                        <span>Lịch hẹn</span>
                    </button>
                    <button className="action-btn" onClick={() => alert('Tra cứu bệnh nhân')}>
                        <span className="action-icon">🔍</span>
                        <span>Tra cứu</span>
                    </button>
                    <button className="action-btn" onClick={() => alert('Xuất báo cáo')}>
                        <span className="action-icon">📊</span>
                        <span>Báo cáo</span>
                    </button>
                </div>
            </div>
        </div>
    );
}