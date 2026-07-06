import { useState } from "react";
import { openingQuestion } from "../../data/questions";

export default function NpcQuestion({ onComplete }) {
  const [result, setResult] = useState(null);

  const handleAnswer = (option) => {
    if (result) return;

    setResult({
      answer: option,
      correct: option === openingQuestion.correctAnswer,
    });
  };

  const dialogue = result
    ? result.correct
      ? openingQuestion.correctDialogue
      : openingQuestion.wrongDialogue
    : ["NPC nhìn anh chằm chằm, tay giữ cổng hơi run run vì muốn trêu."];

  return (
    <section className="flow-screen npc-screen">
      <div className={`npc-avatar ${result ? (result.correct ? "friendly" : "mischief") : ""}`}>
        {result ? (result.correct ? "😊" : "😏") : "🧙"}
      </div>

      <div className="pixel-panel question-panel">
        <p className="eyebrow">Question 0</p>
        <h1>{openingQuestion.question}</h1>

        <div className="option-grid">
          {openingQuestion.options.map((option) => (
            <button
              key={option}
              type="button"
              className={`answer-option ${
                result?.answer === option ? (result.correct ? "correct" : "wrong") : ""
              }`}
              onClick={() => handleAnswer(option)}
              disabled={Boolean(result)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="dialogue-lines compact-lines">
          {dialogue.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        {result && (
          <button
            type="button"
            className="pixel-btn pixel-btn-glow"
            onClick={() => onComplete(result.correct)}
          >
            Vào Stage 1 {result.correct ? "Easy" : "Hard"}
          </button>
        )}
      </div>
    </section>
  );
}
