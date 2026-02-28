import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error when user starts typing
        if (error) setError("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await API.post("/auth/login", formData);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/quiz");
        } catch (err) {
            setError(
                err.response?.data?.message || "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">


            <div className="login-right">
                <div className="login-card">
                    <div className="login-header">
                        <h2>Welcome Back! </h2>
                        <p className="subtitle">Please login to continue your quiz journey</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={error ? "error" : ""}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className={error ? "error" : ""}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-container">
                                <input type="checkbox" />
                                <span className="checkbox-text">Remember me</span>
                            </label>

                        </div>

                        <button
                            type="submit"
                            className={`login-button ${loading ? "loading" : ""}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>

                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    <div className="register-section">
                        <p className="register-text">
                            Don't have an account?{" "}
                            <span
                                onClick={() => navigate("/register")}
                                className="register-link"
                            >
                                Create Account
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;