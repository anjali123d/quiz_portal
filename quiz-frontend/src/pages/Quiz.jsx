import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Quiz.css";

function Quiz() {
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [time, setTime] = useState(300); // 5 minutes
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    // Fetch Questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/");
                    return;
                }

                const res = await API.get("/quiz/questions", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setQuestions(res.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError("Failed to load questions. Please try again.");
                setLoading(false);

                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/");
                }
            }
        };

        fetchQuestions();
    }, [navigate]);

    // Timer
    useEffect(() => {
        if (time <= 0) {
            handleAutoSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTime((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [time]);

    const formatTime = () => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const getTimeStatus = () => {
        if (time <= 60) return "danger";
        if (time <= 120) return "warning";
        return "normal";
    };

    const handleAnswer = (qid, option) => {
        setAnswers((prev) => ({
            ...prev,
            [qid]: option,
        }));
    };

    const handleAutoSubmit = () => {
        localStorage.setItem(
            "result",
            JSON.stringify({ questions, answers, autoSubmit: true })
        );
        navigate("/result");
    };

    const handleSubmit = () => {
        setShowConfirmSubmit(true);
    };

    const confirmSubmit = () => {
        localStorage.setItem(
            "result",
            JSON.stringify({ questions, answers, autoSubmit: false })
        );
        navigate("/result");
    };

    const cancelSubmit = () => {
        setShowConfirmSubmit(false);
    };

    const goToQuestion = (index) => {
        setCurrentQuestionIndex(index);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const getProgressPercentage = () => {
        return (Object.keys(answers).length / questions.length) * 100;
    };

    if (loading) {
        return (
            <div className="quiz-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading your quiz questions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-container">
                <div className="error-state">
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <div className="quiz-info">
                    <h1>Knowledge Quiz</h1>
                    <div className="quiz-meta">
                        <span className="total-questions">
                            {questions.length} Questions
                        </span>
                        <span className="answered-count">
                            Answered: {Object.keys(answers).length}/{questions.length}
                        </span>
                    </div>
                </div>
                <div className={`timer ${getTimeStatus()}`}>
                    <svg className="timer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="timer-text">{formatTime()}</span>
                </div>
            </div>

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${getProgressPercentage()}%` }}
                ></div>
            </div>

            <div className="quiz-layout">
                {/* Question Navigator Sidebar */}

                {/* Main Quiz Area */}
                <div className="quiz-main">
                    {questions.length > 0 && (
                        <div className="question-card">
                            <div className="question-header">

                            </div>

                            <h2 className="question-text">
                                {questions[currentQuestionIndex].questionText}
                            </h2>

                            <div className="options-grid">
                                {questions[currentQuestionIndex].options.map((opt, i) => (
                                    <label
                                        key={i}
                                        className={`option-card ${answers[questions[currentQuestionIndex]._id] === opt
                                            ? "selected"
                                            : ""
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={questions[currentQuestionIndex]._id}
                                            value={opt}
                                            checked={answers[questions[currentQuestionIndex]._id] === opt}
                                            onChange={() =>
                                                handleAnswer(questions[currentQuestionIndex]._id, opt)
                                            }
                                            className="option-input"
                                        />
                                        <span className="option-letter">
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        <span className="option-text">{opt}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="question-navigation">
                                <button
                                    className={`nav-btn prev ${currentQuestionIndex === 0 ? "disabled" : ""}`}
                                    onClick={prevQuestion}
                                    disabled={currentQuestionIndex === 0}
                                >
                                    ← Previous
                                </button>
                                {currentQuestionIndex === questions.length - 1 ? (
                                    <button
                                        className="submit-btn"
                                        onClick={handleSubmit}
                                    >
                                        Submit Exam
                                    </button>
                                ) : (
                                    <button
                                        className="nav-btn next"
                                        onClick={nextQuestion}
                                    >
                                        Next →
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmSubmit && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Submit Exam?</h3>
                        <p>
                            You have answered {Object.keys(answers).length} out of {questions.length} questions.
                            {Object.keys(answers).length < questions.length && (
                                <span className="warning-text">
                                    {" "}You still have unanswered questions.
                                </span>
                            )}
                        </p>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={cancelSubmit}>
                                Review Answers
                            </button>
                            <button className="confirm-btn" onClick={confirmSubmit}>
                                Submit Anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Quiz;