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
    const [showPassword, setShowPassword] = useState(false); // Thêm state này

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
            // Đăng nhập thành công → hiển thị RegistrationPage
            setIsLoggedIn(true);
        } else {
            setError("Sai tên đăng nhập hoặc mật khẩu!");
        }
        setLoading(false);
    };

    // Nếu đã đăng nhập, hiển thị RegistrationPage
    if (isLoggedIn) {
        return <RegistrationPage makeUseCase={makeRegisterVisitUC} />;
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
                            type={showPassword ? "text" : "password"} // Thay đổi type
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        {/* Nút hiển thị/ẩn mật khẩu */}
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
                </form>

                <div className="footer">
                    <small>© {new Date().getFullYear()} Bệnh viện Sài Gòn -ITO</small>
                </div>
            </div>
        </div>
    );
}