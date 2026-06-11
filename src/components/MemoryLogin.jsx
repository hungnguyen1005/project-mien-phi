import { useState } from "react";
import { loginQuestions } from "../data/questions";
import { WRONG_ANSWER_TEASES } from "../data/gameConfig";

export default function MemoryLogin({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [sparkle, setSparkle] = useState(false);
  const [answered, setAnswered] = useState(false);

  const question = loginQuestions[index];
  const isLast = index >= loginQuestions.length - 1;

  const handleSelect = (option) => {
    if (answered) return;

    const correct = option === question.correctAnswer;
    setAnswered(true);

    if (correct) {
      setFeedback("Đúng rồi! 💛✨");
      setSparkle(true);
    } else {
      const tease = WRONG_ANSWER_TEASES[Math.floor(Math.random() * WRONG_ANSWER_TEASES.length)];
      setFeedback(tease);
      setSparkle(false);
    }
  };

  const handleNext = () => {
    if (isLast) {
      onComplete();
      return;
    }
    setIndex((i) => i + 1);
    setFeedback(null);
    setSparkle(false);
    setAnswered(false);
  };

  return (
    <section className="memory-login">
      <div className="pixel-panel login-panel">
        <p className="login-progress">
          Câu {index + 1} / {loginQuestions.length}
        </p>
        <h2 className="login-question">{question.question}</h2>

        <div className="login-options">
          {question.options.map((opt) => (
            <button
              key={opt}
              type="button"
              className="pixel-btn login-option"
              onClick={() => handleSelect(opt)}
              disabled={answered}
            >
              {opt}
            </button>
          ))}
        </div>

        {feedback && (
          <p className={`login-feedback ${sparkle ? "sparkle" : ""}`}>{feedback}</p>
        )}

        {answered && (
          <button type="button" className="pixel-btn pixel-btn-glow" onClick={handleNext}>
            {isLast ? "Vào hành trình" : "Tiếp tục"}
          </button>
        )}
      </div>
    </section>
  );
}
