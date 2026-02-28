import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        // Clear error when user starts typing
        if (error) setError("");

        // Check password strength when password field changes
        if (e.target.name === "password") {
            checkPasswordStrength(e.target.value);
        }
    };

    const checkPasswordStrength = (password) => {
        if (!password) {
            setPasswordStrength("");
        } else if (password.length < 6) {
            setPasswordStrength("weak");
        } else if (password.length < 10) {
            setPasswordStrength("medium");
        } else {
            setPasswordStrength("strong");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        if (formData.password.length < 6) {
            return setError("Password must be at least 6 characters long");
        }

        setLoading(true);

        try {
            await API.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            // Show success message
            setError("success");
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (err) {
            setError(
                err.response?.data?.message || "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2>Create Account</h2>
                    <p className="subtitle">Join us to start your quiz journey</p>
                </div>

                {error === "success" ? (
                    <div className="success-message">
                        Registration Successful! Redirecting to login...
                    </div>
                ) : error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {formData.password && (
                            <div className={`password-strength ${passwordStrength}`}>
                                <div className="strength-bar"></div>
                                <div className="strength-bar"></div>
                                <div className="strength-bar"></div>
                                <span className="strength-text">
                                    {passwordStrength === "weak" && "Weak password"}
                                    {passwordStrength === "medium" && "Medium password"}
                                    {passwordStrength === "strong" && "Strong password"}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex="-1"
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div className="terms-checkbox">
                        <input
                            type="checkbox"
                            id="terms"
                            required
                        />
                        <label htmlFor="terms">
                            I agree to the Terms of Service and Privacy Policy
                        </label>
                    </div>

                    <button
                        type="submit"
                        className={`register-button ${loading ? "loading" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="login-section">
                    <p className="login-text">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/")}
                            className="login-link"
                        >
                            Sign In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;