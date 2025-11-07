import React, { useState, useEffect } from 'react';
import './AccountSetting.css';

// Types
interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    avatar?: string;
    role: 'admin' | 'doctor' | 'staff' | 'cashier';
    isActive: boolean;
    createdAt: string;
    lastLogin: string;
}

interface SystemSettings {
    language: string;
    dateFormat: string;
    timeFormat: string;
    autoLogout: number;
}

interface AccountSettingsProps {
    onLogout?: () => void;
}

export function AccountSettings({ onLogout }: AccountSettingsProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'system'>('profile');
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Mock data
    const [userProfile, setUserProfile] = useState<UserProfile>({
        id: 'USR001',
        fullName: 'Nguyễn Văn Admin',
        email: 'admin@saigonito.com',
        phone: '0912345678',
        department: 'Quản trị hệ thống',
        position: 'Quản trị viên',
        role: 'admin',
        isActive: true,
        createdAt: '2024-01-15',
        lastLogin: '2024-11-05 14:30:25'
    });

    const [systemSettings, setSystemSettings] = useState<SystemSettings>({
        language: 'vi',
        dateFormat: 'dd/MM/yyyy',
        timeFormat: '24h',
        autoLogout: 60
    });

    const [isEditing, setIsEditing] = useState(false);
    const [tempProfile, setTempProfile] = useState<UserProfile>(userProfile);

    // Load theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const isDark = savedTheme === 'dark';
        setIsDarkMode(isDark);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        if (onLogout) {
            onLogout();
        } else {
            // Fallback: reload page or redirect
            window.location.href = '/login';
        }
    };

    const handleSaveProfile = () => {
        setUserProfile(tempProfile);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setTempProfile(userProfile);
        setIsEditing(false);
    };

    const getRoleBadge = (role: string) => {
        const roleConfig = {
            admin: { color: '#dc2626', text: 'Quản trị viên' },
            doctor: { color: '#059669', text: 'Bác sĩ' },
            staff: { color: '#d97706', text: 'Nhân viên' },
            cashier: { color: '#7c3aed', text: 'Thu ngân' }
        };

        const config = roleConfig[role as keyof typeof roleConfig] || { color: '#6b7280', text: role };
        return (
            <span className="role-badge" style={{ backgroundColor: config.color }}>
                {config.text}
            </span>
        );
    };

    return (
        <div className="account-settings-container">


            <div className="settings-layout">
                {/* Navigation Sidebar */}
                <div className="settings-nav">
                    <div className="user-profile-card">
                        <div className="avatar-section">
                            <div className="avatar">
                                {userProfile.avatar ? (
                                    <img src={userProfile.avatar} alt="Avatar" />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {userProfile.fullName.split(' ').map(n => n[0]).join('')}
                                    </div>
                                )}
                            </div>
                            <div className="user-status">
                                <div className="status-indicator"></div>
                                <span>Đang hoạt động</span>
                            </div>
                        </div>
                        <div className="user-details">
                            <h3>{userProfile.fullName}</h3>
                            <p>{userProfile.position}</p>
                            <div className="user-meta">
                                <span>📧 {userProfile.email}</span>
                                <span>📞 {userProfile.phone}</span>
                            </div>
                        </div>
                    </div>

                    <nav className="nav-menu">
                        <div className="nav-section">
                            <button
                                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <span className="nav-icon">👤</span>
                                <span className="nav-text">Thông tin cá nhân</span>
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'system' ? 'active' : ''}`}
                                onClick={() => setActiveTab('system')}
                            >
                                <span className="nav-icon">⚙️</span>
                                <span className="nav-text">Cài đặt hệ thống</span>
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="settings-content">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="content-card">
                            <div className="card-header">
                                <div className="header-title">
                                    <h2>👤 Thông Tin Cá Nhân</h2>
                                    <p>Quản lý thông tin cá nhân và hồ sơ của bạn</p>
                                </div>
                                <div className="header-actions">
                                    {!isEditing ? (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <span>✏️ Chỉnh sửa</span>
                                        </button>
                                    ) : (
                                        <div className="action-buttons">
                                            <button className="btn btn-success" onClick={handleSaveProfile}>
                                                <span>💾 Lưu thay đổi</span>
                                            </button>
                                            <button className="btn btn-secondary" onClick={handleCancelEdit}>
                                                <span>❌ Hủy bỏ</span>
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        className="btn btn-logout"
                                        onClick={handleLogout}
                                    >
                                        <span>🚪 Đăng xuất</span>
                                    </button>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="form-section">
                                    <h3>Thông tin cơ bản</h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Họ và tên</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={tempProfile.fullName}
                                                    onChange={(e) => setTempProfile(prev => ({
                                                        ...prev, fullName: e.target.value
                                                    }))}
                                                    className="form-input"
                                                />
                                            ) : (
                                                <div className="form-value">{userProfile.fullName}</div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    value={tempProfile.email}
                                                    onChange={(e) => setTempProfile(prev => ({
                                                        ...prev, email: e.target.value
                                                    }))}
                                                    className="form-input"
                                                />
                                            ) : (
                                                <div className="form-value">{userProfile.email}</div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label>Số điện thoại</label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    value={tempProfile.phone}
                                                    onChange={(e) => setTempProfile(prev => ({
                                                        ...prev, phone: e.target.value
                                                    }))}
                                                    className="form-input"
                                                />
                                            ) : (
                                                <div className="form-value">{userProfile.phone}</div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label>Phòng ban</label>
                                            <div className="form-value">{userProfile.department}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3>Thông tin công việc</h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Chức vụ</label>
                                            <div className="form-value">{userProfile.position}</div>
                                        </div>
                                        <div className="form-group">
                                            <label>Vai trò</label>
                                            <div className="form-value">{getRoleBadge(userProfile.role)}</div>
                                        </div>
                                        <div className="form-group">
                                            <label>Trạng thái</label>
                                            <div className="form-value">
                                                <span className={`status-badge ${userProfile.isActive ? 'active' : 'inactive'}`}>
                                                    {userProfile.isActive ? '🟢 Đang hoạt động' : '🔴 Ngưng hoạt động'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* System Tab */}
                    {activeTab === 'system' && (
                        <div className="content-card">
                            <div className="card-header">
                                <div className="header-title">
                                    <h2>⚙️ Cài Đặt Hệ Thống</h2>
                                    <p>Tùy chỉnh giao diện và hành vi hệ thống</p>
                                </div>
                                <button
                                    className="btn btn-logout"
                                    onClick={handleLogout}
                                >
                                    <span>🚪 Đăng xuất</span>
                                </button>
                            </div>

                            <div className="card-body">
                                <div className="settings-grid">
                                    <div className="setting-group">
                                        <label>Ngôn ngữ hiển thị</label>
                                        <select
                                            className="form-select"
                                            value={systemSettings.language}
                                            onChange={(e) => setSystemSettings(prev => ({...prev, language: e.target.value}))}
                                        >
                                            <option value="vi">🇻🇳 Tiếng Việt</option>
                                            <option value="en">🇺🇸 English</option>
                                        </select>
                                    </div>

                                    <div className="setting-group">
                                        <label>Định dạng ngày tháng</label>
                                        <select
                                            className="form-select"
                                            value={systemSettings.dateFormat}
                                            onChange={(e) => setSystemSettings(prev => ({...prev, dateFormat: e.target.value}))}
                                        >
                                            <option value="dd/MM/yyyy">dd/MM/yyyy (31/12/2024)</option>
                                            <option value="MM/dd/yyyy">MM/dd/yyyy (12/31/2024)</option>
                                        </select>
                                    </div>

                                    <div className="setting-group">
                                        <label>Định dạng giờ</label>
                                        <select
                                            className="form-select"
                                            value={systemSettings.timeFormat}
                                            onChange={(e) => setSystemSettings(prev => ({...prev, timeFormat: e.target.value}))}
                                        >
                                            <option value="24h">24 giờ (14:30)</option>
                                            <option value="12h">12 giờ (2:30 PM)</option>
                                        </select>
                                    </div>

                                    <div className="setting-group">
                                        <label>Tự động đăng xuất</label>
                                        <select
                                            className="form-select"
                                            value={systemSettings.autoLogout}
                                            onChange={(e) => setSystemSettings(prev => ({...prev, autoLogout: parseInt(e.target.value)}))}
                                        >
                                            <option value={30}>30 phút</option>
                                            <option value={60}>1 giờ</option>
                                            <option value={120}>2 giờ</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AccountSettings;