import React, { useState } from "react";
import { RegistrationPage } from './RegistrationPage';
import { makeRegisterVisitUC } from '@app/routes/makeRegisterUseCase';
import "./login.css";

export default function LoginApp() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("123456");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
            return;
        }

        setLoading(true);
        await new Promise((r) => setTimeout(r, 500)); // giả lập gọi API

        if (username === "admin" && password === "123456") {
            setIsLoggedIn(true);
        } else {
            setError("Sai tên đăng nhập hoặc mật khẩu!");
        }
        setLoading(false);
    };

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            setError("Vui lòng nhập đầy đủ tất cả các trường.");
            return;
        }

        if (oldPassword !== "123456") {
            setError("Mật khẩu cũ không chính xác!");
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
        await new Promise((r) => setTimeout(r, 500)); // giả lập gọi API

        // Thay đổi mật khẩu thành công
        setPassword(newPassword);
        setError("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        setShowForgotPassword(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setLoading(false);
    };

    const handleBackToLogin = () => {
        setShowForgotPassword(false);
        setError("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

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

                    <form onSubmit={handleForgotPasswordSubmit}>
                        <label>
                            <span>Mật khẩu cũ</span>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Nhập mật khẩu cũ"
                            />
                        </label>

                        <label>
                            <span>Mật khẩu mới</span>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                            />
                        </label>

                        <label>
                            <span>Xác nhận mật khẩu mới</span>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                            />
                        </label>

                        {error && <div className={`error ${error.includes("thành công") ? "success" : ""}`}>{error}</div>}

                        <div className="button-group">
                            <button type="button" className="btn-secondary" onClick={handleBackToLogin}>
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
                        />
                    </label>

                    <label style={{ position: 'relative' }}>
                        <span>Mật khẩu</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
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
                            onClick={() => setShowForgotPassword(true)}
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