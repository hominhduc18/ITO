import React, { useState } from "react";
import { RegistrationPage } from './RegistrationPage';
import { makeRegisterVisitUC } from '@app/routes/makeRegisterUseCase';
import "./login.css";

export default function LoginApp() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    /**
     * Call API login với đầy đủ các trường
     */
    const callLoginAPI = async (username: string, password: string) => {
        try {
            const requestBody = {
                userName: username,
                password: password,
                chiNhanh_Id: 0,
                clientIp: "127.0.0.1",
                computer_Name: "DESKTOP-LOCAL",
                account_Local: "local"
            };

            console.log('Sending login request:', requestBody);

            const response = await fetch('/api/LoginSession/LoginSession/CheckLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Login API response:', data);
            return data;
        } catch (error) {
            console.error('Login API error:', error);
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
            return;
        }

        setLoading(true);

        try {
            const result = await callLoginAPI(username, password);

            if (result.success) {
                setIsLoggedIn(true);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', result.data.toString());
                localStorage.setItem('username', username);
                setError(""); // Clear error on success
            } else {
                setError(result.message || "Đăng nhập thất bại!");
            }
        } catch (error: any) {
            console.error('Login error:', error);
            setError("Sai tên đăng nhập hoặc mật khẩu!");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Call API đổi mật khẩu
     */
    const callChangePasswordAPI = async (oldPassword: string, newPassword: string) => {
        try {
            const requestBody = {
                oldPassword: oldPassword,
                newPassword: newPassword,
                userName: username, // Sử dụng username từ state
                chiNhanh_Id: 0,
                clientIp: "127.0.0.1"
            };

            const response = await fetch('/api/LoginSession/LoginSession/ChangePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Change password API error:', error);
            throw error;
        }
    };

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Kiểm tra xem đã nhập username chưa
        if (!username.trim()) {
            setError("Vui lòng nhập tên đăng nhập trước khi đổi mật khẩu.");
            return;
        }

        if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            setError("Vui lòng nhập đầy đủ tất cả các trường.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }

        if (newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự!");
            return;
        }

        setLoading(true);

        try {
            const result = await callChangePasswordAPI(oldPassword, newPassword);

            if (result.success) {
                setError("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
                setShowForgotPassword(false);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setPassword(newPassword);
            } else {
                setError(result.message || "Đổi mật khẩu thất bại!");
            }
        } catch (error: any) {
            console.error('Change password error:', error);
            setError("Lỗi kết nối! Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        setShowForgotPassword(false);
        setError("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    // Kiểm tra trạng thái đăng nhập từ localStorage
    React.useEffect(() => {
        const savedLoginStatus = localStorage.getItem('isLoggedIn');
        if (savedLoginStatus === 'true') {
            setIsLoggedIn(true);
        }
    }, []);

    // Nếu đã đăng nhập, hiển thị RegistrationPage
    if (isLoggedIn) {
        return <RegistrationPage makeUseCase={makeRegisterVisitUC} />;
    }

    // Nếu đang ở chế độ quên mật khẩu
    if (showForgotPassword) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <img src="/image/otp.png" alt="SAIGON-ITO" className="logo" />
                        <h2>Đổi mật khẩu</h2>
                        <p>Hệ thống bệnh viện SAIGON-ITO</p>
                    </div>

                    <div className="current-user-info">
                        <p>Tài khoản: <strong>{username}</strong></p>
                    </div>

                    <form onSubmit={handleForgotPasswordSubmit}>
                        <label>
                            <span>Mật khẩu cũ</span>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Nhập mật khẩu cũ"
                                disabled={loading}
                            />
                        </label>

                        <label>
                            <span>Mật khẩu mới</span>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                                disabled={loading}
                            />
                        </label>

                        <label>
                            <span>Xác nhận mật khẩu mới</span>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                                disabled={loading}
                            />
                        </label>

                        {error && (
                            <div className={`error ${error.includes("thành công") ? "success" : ""}`}>
                                {error}
                            </div>
                        )}

                        <div className="button-group">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleBackToLogin}
                                disabled={loading}
                            >
                                Quay lại
                            </button>
                            <button className="btn-primary" disabled={loading}>
                                {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Nếu chưa đăng nhập, hiển thị form đăng nhập
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <img src="/image/otp.png" alt="SAIGON-ITO" className="logo" />
                    <h2>SAIGON-ITO</h2>
                    <p>Hệ thống bệnh viện SAIGON-ITO</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>
                        <span>Tên đăng nhập</span>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên đăng nhập"
                            disabled={loading}
                        />
                    </label>

                    <label style={{ position: 'relative' }}>
                        <span>Mật khẩu</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </label>

                    {error && <div className="error">{error}</div>}

                    <button className="btn-primary" disabled={loading}>
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>

                    <div className="forgot-password-link">
                        <button
                            type="button"
                            className="link-button"
                            onClick={() => {
                                if (!username.trim()) {
                                    setError("Vui lòng nhập tên đăng nhập trước khi đổi mật khẩu.");
                                    return;
                                }
                                setShowForgotPassword(true);
                            }}
                            disabled={loading}
                        >
                            Quên mật khẩu?
                        </button>
                    </div>
                </form>

                <div className="footer">
                    <small>© {new Date().getFullYear()} Bệnh viện Sài Gòn -ITO</small>
                </div>
            </div>
        </div>
    );
}