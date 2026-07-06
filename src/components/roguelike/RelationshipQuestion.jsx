export default function RelationshipQuestion({ question, onAnswer }) {
  return (
    <section className="flow-screen relationship-question-screen">
      <div className="pixel-panel question-panel">
        <p className="eyebrow">
          Relationship Question {question.order}
          {question.todo ? " · TODO" : ""}
        </p>
        <h1>{question.question}</h1>

        <div className="option-grid">
          {question.options.map((option) => (
            <button
              key={option}
              type="button"
              className="answer-option"
              onClick={() => onAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
