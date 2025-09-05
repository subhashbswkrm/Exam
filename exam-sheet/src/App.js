
import React, { useState, useEffect } from 'react';
import './App.css';

import { questions } from './questions';


  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [seen, setSeen] = useState(Array(questions.length).fill(false));
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [submitted, setSubmitted] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    setSeen((prev) => {
      const updated = [...prev];
      updated[current] = true;
      return updated;
    });
  }, [current]);

  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleAnswer = (idx) => {
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const attempted = answers.filter((a) => a !== null).length;
  const notAttempted = answers.filter((a, i) => a === null && seen[i]).length;
  const notSeen = seen.filter((s) => !s).length;

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="exam-container">
      <div className="exam-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div className="timer">Time Left: {formatTime(timeLeft)}</div>
          <div>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={{ fontSize: '1rem', padding: '8px', borderRadius: '8px', border: '1px solid #8ec5fc', background: '#fff', color: '#222', fontWeight: 'bold' }}>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>
        </div>
        <div className="question-panel">
          <div className="question-count">Question {current + 1} of {questions.length}</div>
          <div className="question-text">{questions[current].question[language]}</div>
          <div className="options">
            {questions[current].options[language].map((opt, idx) => (
              <button
                key={idx}
                className={answers[current] === idx ? 'selected' : ''}
                onClick={() => handleAnswer(idx)}
                disabled={submitted}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="nav-btns">
            <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>Previous</button>
            <button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))} disabled={current === questions.length - 1}>Next</button>
            <button onClick={handleSubmit} disabled={submitted}>Submit</button>
          </div>
        </div>
      </div>
      <div className="exam-status">
        <h3>Status Board</h3>
        <div className="status-summary">
          <span className="status-icon attempted">✔️</span>Attempted: {attempted}
          <span className="status-icon not-attempted">❓</span>Not Attempted: {notAttempted}
          <span className="status-icon not-seen">🚫</span>Not Seen: {notSeen}
        </div>
        <div className="question-status-list">
          {questions.map((q, i) => (
            <div
              key={i}
              className={`status-dot ${answers[i] !== null ? 'attempted' : seen[i] ? 'not-attempted' : 'not-seen'}${current === i ? ' current' : ''}`}
              onClick={() => setCurrent(i)}
              title={answers[i] !== null ? 'Attempted' : seen[i] ? 'Not Attempted' : 'Not Seen'}
            >{i + 1}</div>
          ))}
        </div>
      </div>
      {submitted && (
        <div className="result-panel">
          <h2>Exam Submitted!</h2>
          <div>Score: {answers.filter((a, i) => a === questions[i].answer).length} / {questions.length}</div>
        </div>
      )}
  </div>

export default App;