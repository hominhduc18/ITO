import React, { useState, useEffect } from 'react';

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

export function AccountSettings() {
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="account-settings-container">
            <div className="settings-header">
                <div className="header-content">
                    <div className="header-title">
                        <h1>⚙️ Cấu Hình Tài Khoản</h1>
                        <p>Quản lý thông tin cá nhân và cài đặt hệ thống</p>
                    </div>
                </div>
            </div>

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

            <style>{`
                .account-settings-container {
                    min-height: 100vh;
                    background: var(--bg-color);
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    color: var(--text-color);
                }

                .settings-header {
                    background: var(--header-bg);
                    color: var(--header-text);
                    padding: 1.5rem 0;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }

                .header-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }

                .header-title h1 {
                    margin: 0 0 0.25rem 0;
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .header-title p {
                    margin: 0;
                    opacity: 0.9;
                    font-size: 0.9rem;
                }

                .settings-layout {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 2rem;
                }

                .settings-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .user-profile-card {
                    background: var(--card-bg);
                    border-radius: 12px;
                    padding: 1.5rem;
                    box-shadow: var(--shadow);
                    border: 1px solid var(--border-color);
                }

                .avatar-section {
                    text-align: center;
                    margin-bottom: 1rem;
                }

                .avatar-placeholder {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.2rem;
                    font-weight: bold;
                    margin: 0 auto 0.75rem;
                }

                .user-status {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    color: #059669;
                }

                .status-indicator {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #059669;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .user-details h3 {
                    margin: 0 0 0.25rem 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                    text-align: center;
                    color: var(--text-color);
                }

                .user-details p {
                    margin: 0 0 0.75rem 0;
                    color: var(--muted-color);
                    text-align: center;
                    font-size: 0.9rem;
                }

                .user-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    font-size: 0.8rem;
                    color: var(--muted-color);
                }

                .nav-menu {
                    background: var(--card-bg);
                    border-radius: 12px;
                    padding: 1rem;
                    box-shadow: var(--shadow);
                    border: 1px solid var(--border-color);
                }

                .nav-item {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border: none;
                    background: transparent;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-bottom: 0.5rem;
                    color: var(--text-color);
                    font-size: 0.9rem;
                }

                .nav-item:last-child {
                    margin-bottom: 0;
                }

                .nav-item:hover {
                    background: var(--sidebar-hover);
                }

                .nav-item.active {
                    background: var(--btn-primary-bg);
                    color: var(--btn-primary-text);
                }

                .nav-icon {
                    font-size: 1.1rem;
                }

                .nav-text {
                    flex: 1;
                    text-align: left;
                    font-weight: 500;
                }

                .settings-content {
                    min-height: 500px;
                }

                .content-card {
                    background: var(--card-bg);
                    border-radius: 12px;
                    box-shadow: var(--shadow);
                    border: 1px solid var(--border-color);
                    overflow: hidden;
                }

                .card-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .header-title h2 {
                    margin: 0 0 0.25rem 0;
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: var(--text-color);
                }

                .header-title p {
                    margin: 0;
                    color: var(--muted-color);
                    font-size: 0.9rem;
                }

                .card-body {
                    padding: 1.5rem;
                }

                .btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.85rem;
                }

                .btn-primary {
                    background: var(--btn-primary-bg);
                    color: var(--btn-primary-text);
                }

                .btn-primary:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }

                .btn-success {
                    background: #059669;
                    color: white;
                }

                .btn-success:hover {
                    background: #047857;
                }

                .btn-secondary {
                    background: var(--btn-bg);
                    color: var(--text-color);
                    border: 1px solid var(--btn-border);
                }

                .btn-secondary:hover {
                    background: var(--sidebar-hover);
                }

                .action-buttons {
                    display: flex;
                    gap: 0.5rem;
                }

                .form-section {
                    margin-bottom: 1.5rem;
                }

                .form-section:last-child {
                    margin-bottom: 0;
                }

                .form-section h3 {
                    margin: 0 0 0.75rem 0;
                    font-size: 1rem;
                    font-weight: 600;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid var(--border-color);
                    color: var(--text-color);
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-group label {
                    font-weight: 600;
                    font-size: 0.85rem;
                    color: var(--text-color);
                }

                .form-input {
                    padding: 0.5rem 0.75rem;
                    border: 1px solid var(--border-color);
                    border-radius: 6px;
                    font-size: 0.85rem;
                    transition: all 0.3s ease;
                    background: var(--bg-color);
                    color: var(--text-color);
                }

                .form-input:focus {
                    outline: none;
                    border-color: var(--btn-primary-bg);
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
                }

                .form-value {
                    padding: 0.5rem 0.75rem;
                    background: var(--bg-color);
                    border: 1px solid var(--border-color);
                    border-radius: 6px;
                    font-size: 0.85rem;
                    color: var(--text-color);
                }

                .form-select {
                    padding: 0.5rem 0.75rem;
                    border: 1px solid var(--border-color);
                    border-radius: 6px;
                    font-size: 0.85rem;
                    background: var(--bg-color);
                    color: var(--text-color);
                    cursor: pointer;
                }

                .form-select:focus {
                    outline: none;
                    border-color: var(--btn-primary-bg);
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
                }

                .role-badge {
                    padding: 0.25rem 0.5rem;
                    color: white;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    display: inline-block;
                }

                .status-badge.active {
                    color: #059669;
                    font-weight: 600;
                }

                .status-badge.inactive {
                    color: #dc2626;
                    font-weight: 600;
                }

                .settings-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1rem;
                }

                .setting-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .setting-group label {
                    font-weight: 600;
                    font-size: 0.85rem;
                    color: var(--text-color);
                }

                /* Responsive Design */
                @media (max-width: 1024px) {
                    .settings-layout {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                        padding: 1.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .settings-layout {
                        padding: 1rem;
                    }

                    .header-content {
                        padding: 0 1rem;
                    }

                    .header-title h1 {
                        font-size: 1.25rem;
                    }

                    .card-header {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: flex-start;
                    }

                    .action-buttons {
                        width: 100%;
                        justify-content: space-between;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }

                    .settings-grid {
                        grid-template-columns: 1fr;
                    }

                    .btn {
                        width: 100%;
                        justify-content: center;
                    }
                }

                @media (max-width: 480px) {
                    .settings-header {
                        padding: 1rem 0;
                    }

                    .header-title h1 {
                        font-size: 1.1rem;
                    }

                    .user-profile-card,
                    .nav-menu,
                    .content-card {
                        padding: 1rem;
                    }

                    .card-body {
                        padding: 1rem;
                    }

                    .avatar-placeholder {
                        width: 50px;
                        height: 50px;
                        font-size: 1rem;
                    }

                    .user-details h3 {
                        font-size: 1rem;
                    }

                    .nav-item {
                        padding: 0.5rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default AccountSettings;