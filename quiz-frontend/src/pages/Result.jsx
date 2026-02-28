import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Result.css";

function Result() {
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [expandedQuestions, setExpandedQuestions] = useState([]);

    useEffect(() => {
        const storedData = localStorage.getItem("result");
        if (!storedData) {
            return;
        }

        const parsedData = JSON.parse(storedData);
        setResult(parsedData);

        // Auto-expand first question
        if (parsedData.questions?.length > 0) {
            setExpandedQuestions([parsedData.questions[0]._id]);
        }
    }, []);

    if (!result) {
        return (
            <div className="result-container">
                <div className="no-result">
                    <h2>No Result Found</h2>
                    <p>You haven't taken any quiz yet.</p>
                    <button
                        className="start-quiz-btn"
                        onClick={() => navigate("/quiz")}
                    >
                        Start a Quiz
                    </button>
                </div>
            </div>
        );
    }

    const { questions = [], answers = {}, autoSubmit = false, timeUp = false } = result;

    // Calculate statistics
    const stats = questions.reduce(
        (acc, q) => {
            const userAns = answers[q._id];
            const isCorrect = userAns === q.correctOption;

            if (!userAns) {
                acc.unanswered++;
            } else if (isCorrect) {
                acc.correct++;
            } else {
                acc.incorrect++;
            }

            return acc;
        },
        { correct: 0, incorrect: 0, unanswered: 0 }
    );

    const totalQuestions = questions.length;
    const score = stats.correct;
    const percentage = totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(1) : 0;

    const getGrade = () => {
        if (percentage >= 90) return { text: "Excellent!", class: "grade-excellent" };
        if (percentage >= 75) return { text: "Good Job!", class: "grade-good" };
        if (percentage >= 60) return { text: "Fair", class: "grade-fair" };
        if (percentage >= 40) return { text: "Needs Improvement", class: "grade-poor" };
        return { text: "Try Again", class: "grade-fail" };
    };

    const grade = getGrade();

    const toggleQuestion = (questionId) => {
        setExpandedQuestions(prev =>
            prev.includes(questionId)
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId]
        );
    };

    const handleRetry = () => {
        localStorage.removeItem("result");
        navigate("/quiz");
    };

    const handleReviewIncorrect = () => {
        const incorrectQuestions = questions.filter(q => answers[q._id] !== q.correctOption);
        // You can implement a review mode here
        console.log("Review incorrect questions:", incorrectQuestions);
    };

    return (
        <div className="result-container">
            <div className="result-header">
                <h1>Quiz Results</h1>
                <p className="result-subtitle">Here's how you performed</p>
            </div>

            {/* Score Card */}
            <div className="score-card">
                <div className="score-circle">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                        <path
                            className="circle-bg"
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                            className="circle"
                            strokeDasharray={`${percentage}, 100`}
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.35" className="percentage">{percentage}%</text>
                    </svg>
                </div>

                <div className="score-details">
                    <div className="grade-section">
                        <span className={`grade ${grade.class}`}>{grade.text}</span>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-value correct">{stats.correct}</span>
                            <span className="stat-label">Correct</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value incorrect">{stats.incorrect}</span>
                            <span className="stat-label">Incorrect</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value unanswered">{stats.unanswered}</span>
                            <span className="stat-label">Unanswered</span>
                        </div>
                    </div>

                    <div className="score-text">
                        You scored <strong>{score}</strong> out of <strong>{totalQuestions}</strong>
                    </div>

                    {(autoSubmit || timeUp) && (
                        <div className="submission-note">
                            {timeUp ? "⏰ Time's up!" : "📝 Auto-submitted"}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
                <button className="btn-primary" onClick={handleRetry}>
                    Take New Quiz
                </button>
                {stats.incorrect > 0 && (
                    <button className="btn-secondary" onClick={handleReviewIncorrect}>
                        Review Incorrect
                    </button>
                )}
                <button className="btn-outline" onClick={() => navigate("/")}>
                    Back to Home
                </button>
            </div>

            {/* Performance Summary */}
            <div className="performance-summary">
                <h2>Performance Summary</h2>

                <div className="summary-stats">
                    <div className="summary-stat">
                        <span className="stat-label">Total Questions</span>
                        <span className="stat-number">{totalQuestions}</span>
                    </div>
                    <div className="summary-stat">
                        <span className="stat-label">Time Spent</span>
                        <span className="stat-number">5:00</span>
                    </div>
                    <div className="summary-stat">
                        <span className="stat-label">Accuracy</span>
                        <span className="stat-number">
                            {totalQuestions > 0
                                ? ((stats.correct / (stats.correct + stats.incorrect)) * 100).toFixed(1)
                                : 0}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Detailed Question Analysis */}
            <div className="questions-analysis">
                <h2>Question Analysis</h2>

                {questions.map((q, index) => {
                    const userAns = answers[q._id];
                    const isCorrect = userAns === q.correctOption;
                    const isExpanded = expandedQuestions.includes(q._id);

                    return (
                        <div
                            key={q._id}
                            className={`question-card ${isCorrect ? 'correct' : 'incorrect'}`}
                        >
                            <div
                                className="question-header"
                                onClick={() => toggleQuestion(q._id)}
                            >
                                <div className="question-info">
                                    <span className="question-number">Q{index + 1}</span>
                                    <span className="question-preview">
                                        {q.questionText.length > 60
                                            ? `${q.questionText.substring(0, 60)}...`
                                            : q.questionText}
                                    </span>
                                </div>
                                <div className="question-status">
                                    {!userAns && <span className="status-badge unanswered">Unanswered</span>}
                                    {userAns && isCorrect && <span className="status-badge correct">Correct ✓</span>}
                                    {userAns && !isCorrect && <span className="status-badge incorrect">Incorrect ✗</span>}
                                    <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="question-details">
                                    <h3 className="question-text">{q.questionText}</h3>

                                    <div className="options-analysis">
                                        {q.options.map((opt, i) => {
                                            let optionClass = "option-item";
                                            if (opt === q.correctOption) {
                                                optionClass += " correct-option";
                                            }
                                            if (opt === userAns && opt !== q.correctOption) {
                                                optionClass += " wrong-option";
                                            }
                                            if (opt === userAns && opt === q.correctOption) {
                                                optionClass += " correct-option";
                                            }

                                            return (
                                                <div key={i} className={optionClass}>
                                                    <span className="option-marker">
                                                        {String.fromCharCode(65 + i)}
                                                    </span>
                                                    <span className="option-text">{opt}</span>
                                                    {opt === q.correctOption && (
                                                        <span className="correct-badge">Correct Answer</span>
                                                    )}
                                                    {opt === userAns && opt !== q.correctOption && (
                                                        <span className="wrong-badge">Your Answer</span>
                                                    )}
                                                    {opt === userAns && opt === q.correctOption && (
                                                        <span className="correct-badge">Your Answer ✓</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {!userAns && (
                                        <div className="unanswered-note">
                                            <span className="note-icon">ℹ️</span>
                                            You didn't answer this question
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Result;