// components/Dashboard.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from "i18next";

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

    React.useEffect(() => {
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
        ]);
    }, [t]); // Thêm t vào dependency

    const StatCard = ({ title, value, icon, color, subtitle }) => (
        <div className="stat-card">
            <div className="stat-icon" style={{ background: color }}>
                {icon}
            </div>
            <div className="stat-content">
                <div className="stat-value">{value}</div>
                <div className="stat-title">{title}</div>
                {subtitle && <div className="stat-subtitle">{subtitle}</div>}
            </div>
        </div>
    );

    // Biểu đồ đơn giản - cột
    const SimpleBarChart = ({ data, title }) => {
        const maxValue = Math.max(...data.map(item => item.appointments));
        const chartHeight = 200;

        return (
            <div className="chart-card">
                <h3>{title}</h3>
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
                            const barHeight = (item.appointments / maxValue) * chartHeight;
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

        return (
            <div className="chart-card">
                <h3>{title}</h3>
                <div className="pie-chart">
                    <div className="pie-chart-visual">
                        {data.map((item, index) => {
                            const percentage = (item.patients / total) * 100;
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
                            <div key={index} className="legend-item">
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

    return (
        <div className="dashboard">
            {/* Header đơn giản */}
            <div className="dashboard-header">
                <h1>{t('hospitalName')} - {t('dashboardTitle')}</h1>
                <div className="dashboard-date">
                    {new Date().toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            {/* Thống kê chính */}
            <div className="stats-grid">
                <StatCard
                    title={t('totalPatients')}
                    value={stats.totalPatients.toLocaleString()}
                    icon="👥"
                    color="#3b82f6"
                    subtitle={t('accumulated')}
                />
                <StatCard
                    title={t('todayAppointments')}
                    value={stats.todayAppointments}
                    icon="🕒"
                    color="#f59e0b"
                    subtitle={`${stats.waitingPatients} ${t('patientsWaiting')}`}
                />
                <StatCard
                    title={t('availableDoctors')}
                    value={stats.availableDoctors}
                    icon="👨‍⚕️"
                    color="#10b981"
                    subtitle={t('onDuty')}
                />
                <StatCard
                    title={t('revenue')}
                    value={`${(stats.revenueToday / 1000000).toFixed(1)}M`}
                    icon="💰"
                    color="#8b5cf6"
                    subtitle={`VND ${t('today')}`}
                />
                <StatCard
                    title={t('occupiedBeds')}
                    value={`${stats.occupiedBeds}/120`}
                    icon="🏥"
                    color="#ef4444"
                    subtitle={`${Math.round((stats.occupiedBeds / 120) * 100)}% ${t('bedsUsed')}`}
                />
                <StatCard
                    title={t('serviceRate')}
                    value="94%"
                    icon="📈"
                    color="#06b6d4"
                    subtitle={t('thisMonth')}
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

            {/* Thông tin nhanh */}
            <div className="quick-info">
                <div className="info-card">
                    <h3>{t('todayActivities')}</h3>
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
                            <span className="info-value">5 {t('cases')}</span>
                        </div>
                    </div>
                </div>

                <div className="info-card">
                    <h3>{t('alerts')}</h3>
                    <div className="alert-list">
                        <div className="alert-item warning">
                            <span>⚠️ 2 {t('patientsWaiting')}</span>
                        </div>
                        <div className="alert-item info">
                            <span>ℹ️ {t('maintenanceRequired')}</span>
                        </div>
                        <div className="alert-item success">
                            <span>✅ {t('allDepartments')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// CSS cho Dashboard
const dashboardStyles = `
.dashboard {
    padding: 20px;
    height: 100%;
    overflow-y: auto;
    background: var(--bg-color);
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
}

.dashboard-header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: var(--text-color);
}

.dashboard-date {
    color: var(--muted-color);
    font-size: 14px;
    font-weight: 500;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
}

.stat-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: var(--btn-primary-bg);
}

.stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}

.stat-content {
    flex: 1;
}

.stat-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-color);
    line-height: 1;
    margin-bottom: 4px;
}

.stat-title {
    font-size: 14px;
    color: var(--muted-color);
    margin-bottom: 2px;
    font-weight: 500;
}

.stat-subtitle {
    font-size: 12px;
    color: var(--muted-color);
    opacity: 0.8;
}

/* Charts Grid */
.charts-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    margin-bottom: 32px;
}

.chart-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 20px;
}

.chart-card h3 {
    margin: 0 0 20px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
    text-align: center;
}

/* Bar Chart Styles */
.chart-container {
    display: flex;
    align-items: end;
    gap: 16px;
    position: relative;
}

.chart-bars {
    display: flex;
    justify-content: space-between;
    align-items: end;
    flex: 1;
    gap: 12px;
    height: 220px;
    padding-left: 40px;
}

.bar-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    gap: 8px;
}

.bar-wrapper {
    height: 200px;
    display: flex;
    align-items: end;
    position: relative;
}

.bar {
    width: 100%;
    min-width: 30px;
    border-radius: 4px 4px 0 0;
    position: relative;
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    align-items: end;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bar:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    opacity: 0.9;
}

.bar-value {
    position: absolute;
    top: -25px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-color);
    background: var(--card-bg);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    white-space: nowrap;
}

.bar-label {
    font-size: 12px;
    color: var(--muted-color);
    font-weight: 500;
    text-align: center;
}

/* Y-axis */
.y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 200px;
    position: absolute;
    left: 0;
    top: 0;
    padding-right: 8px;
}

.y-label {
    font-size: 10px;
    color: var(--muted-color);
    text-align: right;
}

/* Pie Chart Styles */
.pie-chart {
    display: flex;
    gap: 20px;
    align-items: center;
}

.pie-chart-visual {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: var(--border-color);
    position: relative;
    overflow: hidden;
}

.pie-segment {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transform-origin: center;
}

.pie-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: var(--card-bg);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--border-color);
}

.pie-total {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-color);
    line-height: 1;
}

.pie-label {
    font-size: 10px;
    color: var(--muted-color);
}

.pie-legend {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    flex-shrink: 0;
}

.legend-name {
    font-size: 12px;
    color: var(--text-color);
    flex: 1;
}

.legend-value {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-color);
}

/* Quick Info */
.quick-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
}

.info-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 20px;
}

.info-card h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
}

.info-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-color);
}

.info-item:last-child {
    border-bottom: none;
}

.info-label {
    font-size: 14px;
    color: var(--muted-color);
}

.info-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color);
}

.alert-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.alert-item {
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
}

.alert-item.warning {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #f59e0b;
}

.alert-item.info {
    background: #dbeafe;
    color: #1e40af;
    border: 1px solid #3b82f6;
}

.alert-item.success {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #10b981;
}

/* Responsive */
@media (max-width: 1024px) {
    .charts-grid {
        grid-template-columns: 1fr;
    }
    
    .quick-info {
        grid-template-columns: 1fr;
    }
    
    .pie-chart {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .dashboard {
        padding: 16px;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .pie-chart {
        flex-direction: column;
        text-align: center;
    }
    
    .chart-bars {
        gap: 8px;
        padding-left: 30px;
    }
    
    .bar {
        min-width: 25px;
    }
    
    .bar-value {
        font-size: 10px;
    }
}

/* Dark theme adjustments */
[data-theme="dark"] .bar {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .bar:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}
`;

// Inject styles
const style = document.createElement('style');
if (!document.head.querySelector('#dashboard-styles')) {
    style.id = 'dashboard-styles';
    style.innerHTML = dashboardStyles;
    document.head.appendChild(style);
}

