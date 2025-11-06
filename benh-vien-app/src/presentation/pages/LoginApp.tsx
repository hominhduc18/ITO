import React, { useState, useEffect } from 'react';

// Mock RegistrationPage component (thay bằng import thực tế của bạn)
const RegistrationPage = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
    return (
        <div style={styles.dashboard}>
            <header style={styles.dashboardHeader}>
                <div style={styles.headerContent}>
                    <h1>Hệ Thống Đăng Ký Khám Bệnh</h1>
                    <div style={styles.userInfo}>
                        <span>Xin chào, <strong>{user.fullName}</strong> ({user.role})</span>
                        <button onClick={onLogout} style={styles.logoutButton}>
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>

            <main style={styles.dashboardMain}>
                <div style={styles.welcomeSection}>
                    <h2>Đăng Ký Khám Bệnh</h2>
                    <p>Chào mừng bạn đến với hệ thống đăng ký khám bệnh trực tuyến</p>

                    <div style={styles.registrationForm}>
                        <div style={styles.formSection}>
                            <h3>📋 Thông tin bệnh nhân</h3>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Họ và tên</label>
                                    <input type="text" style={styles.input} placeholder="Nhập họ tên bệnh nhân" />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Ngày sinh</label>
                                    <input type="date" style={styles.input} />
                                </div>
                            </div>

                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Giới tính</label>
                                    <select style={styles.input}>
                                        <option value="">Chọn giới tính</option>
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Số điện thoại</label>
                                    <input type="tel" style={styles.input} placeholder="Nhập số điện thoại" />
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Địa chỉ</label>
                                <input type="text" style={styles.input} placeholder="Nhập địa chỉ" />
                            </div>
                        </div>

                        <div style={styles.formSection}>
                            <h3>🩺 Thông tin khám bệnh</h3>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Ngày khám</label>
                                    <input type="date" style={styles.input} />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Giờ khám</label>
                                    <input type="time" style={styles.input} />
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Triệu chứng/Lý do khám</label>
                                <textarea
                                    style={{...styles.input, minHeight: '80px'}}
                                    placeholder="Mô tả triệu chứng hoặc lý do khám bệnh"
                                />
                            </div>
                        </div>

                        <div style={styles.formSection}>
                            <h3>🔬 Chỉ định cận lâm sàng (CLS)</h3>
                            <div style={styles.clsList}>
                                <div style={styles.clsItem}>
                                    <label style={styles.checkboxLabel}>
                                        <input type="checkbox" /> Xét nghiệm máu
                                    </label>
                                </div>
                                <div style={styles.clsItem}>
                                    <label style={styles.checkboxLabel}>
                                        <input type="checkbox" /> Xét nghiệm nước tiểu
                                    </label>
                                </div>
                                <div style={styles.clsItem}>
                                    <label style={styles.checkboxLabel}>
                                        <input type="checkbox" /> Chụp X-Quang
                                    </label>
                                </div>
                                <div style={styles.clsItem}>
                                    <label style={styles.checkboxLabel}>
                                        <input type="checkbox" /> Siêu âm
                                    </label>
                                </div>
                                <div style={styles.clsItem}>
                                    <label style={styles.checkboxLabel}>
                                        <input type="checkbox" /> Điện tim
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button style={styles.submitButton}>
                            ✅ Đăng Ký Khám
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

// LoginForm Component
const LoginForm = ({ onLogin }: { onLogin: (userData: any) => void }) => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (credentials.username === 'admin' && credentials.password === '123') {
            setTimeout(() => {
                const userData = {
                    id: 1,
                    username: 'admin',
                    fullName: 'Quản trị viên',
                    role: 'admin'
                };
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('token', 'fake-jwt-token-admin');
                onLogin(userData);
                setLoading(false);
            }, 1000);
        } else {
            setTimeout(() => {
                setError('Tên đăng nhập hoặc mật khẩu không đúng');
                setLoading(false);
            }, 1000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleDemoLogin = () => {
        setCredentials({
            username: 'admin',
            password: '123'
        });
    };

    return (
        <div style={styles.loginContainer}>
            <div style={styles.loginCard}>
                <div style={styles.loginHeader}>
                    <h1>Đăng Nhập Hệ Thống</h1>
                    <p>Hệ thống quản lý khám bệnh</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.loginForm}>
                    <div style={styles.formGroup}>
                        <label htmlFor="username" style={styles.label}>Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            placeholder="Nhập tên đăng nhập"
                            required
                            disabled={loading}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="password" style={styles.label}>Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            required
                            disabled={loading}
                            style={styles.input}
                        />
                    </div>

                    {error && (
                        <div style={styles.errorMessage}>
                            ❌ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{
                            ...styles.loginButton,
                            ...(loading ? styles.loginButtonDisabled : {})
                        }}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span style={styles.spinnerSmall}></span>
                                Đang đăng nhập...
                            </>
                        ) : (
                            'Đăng Nhập'
                        )}
                    </button>

                    <div style={styles.demoSection}>
                        <p style={styles.demoText}>Tài khoản demo:</p>
                        <button
                            type="button"
                            style={styles.demoButton}
                            onClick={handleDemoLogin}
                            disabled={loading}
                        >
                            admin / 123
                        </button>
                    </div>
                </form>

                <div style={styles.loginFooter}>
                    <p>© 2024 Hệ thống quản lý khám bệnh</p>
                </div>
            </div>
        </div>
    );
};

// Main App Component
const App = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData: any) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p>Đang tải...</p>
            </div>
        );
    }

    // Nếu đã đăng nhập, hiển thị RegistrationPage
    if (user) {
        return <RegistrationPage user={user} onLogout={handleLogout} />;
    }

    // Nếu chưa đăng nhập, hiển thị form đăng nhập
    return <LoginForm onLogin={handleLogin} />;
};

// Styles
const styles = {
    // Loading
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },

    // Login
    loginContainer: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
    },
    loginCard: {
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    loginHeader: {
        textAlign: 'center' as 'center',
        marginBottom: '30px',
    },
    loginForm: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '20px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column' as 'column',
    },
    label: {
        marginBottom: '8px',
        color: '#333',
        fontWeight: '500',
        fontSize: '14px',
    },
    input: {
        padding: '12px 16px',
        border: '2px solid #e1e5e9',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        backgroundColor: '#f8f9fa',
        fontFamily: 'inherit',
    },
    loginButton: {
        padding: '14px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: 'inherit',
    },
    loginButtonDisabled: {
        opacity: 0.7,
        cursor: 'not-allowed',
        transform: 'none',
    },
    spinnerSmall: {
        width: '16px',
        height: '16px',
        border: '2px solid transparent',
        borderTop: '2px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    errorMessage: {
        backgroundColor: '#fee',
        color: '#c33',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #fcc',
        fontSize: '14px',
        textAlign: 'center' as 'center',
    },
    demoSection: {
        textAlign: 'center' as 'center',
        paddingTop: '20px',
        borderTop: '1px solid #eee',
    },
    demoText: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '8px',
    },
    demoButton: {
        background: '#f8f9fa',
        border: '1px solid #ddd',
        color: '#666',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
    },
    loginFooter: {
        textAlign: 'center' as 'center',
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #eee',
    },

    // Dashboard/Registration Page
    dashboard: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    dashboardHeader: {
        background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '0 20px',
    },
    headerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px 0',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        color: '#666',
    },
    logoutButton: {
        background: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background 0.2s ease',
        fontFamily: 'inherit',
    },
    dashboardMain: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
    },
    welcomeSection: {
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    registrationForm: {
        marginTop: '30px',
    },
    formSection: {
        marginBottom: '40px',
        paddingBottom: '30px',
        borderBottom: '1px solid #eee',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px',
    },
    clsList: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '12px',
    },
    clsItem: {
        display: 'flex',
        alignItems: 'center',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
    },
    submitButton: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        border: 'none',
        padding: '16px 32px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'block',
        margin: '40px auto 0',
        minWidth: '200px',
        fontFamily: 'inherit',
    },
};

// Thêm CSS animations
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #667eea;
      background-color: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .submit-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
  }
`, styleSheet.cssRules.length);

export default App;