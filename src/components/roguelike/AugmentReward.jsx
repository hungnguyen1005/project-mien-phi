export default function AugmentReward({
  augment,
  questionResult,
  nextDifficulty,
  isFinalStage,
  onContinue,
}) {
  return (
    <section className="flow-screen augment-screen">
      <div className="pixel-panel reward-panel">
        <p className="eyebrow">{questionResult.correct ? "Đúng rồi" : "Sai mất rồi"}</p>
        <h1>{questionResult.correct ? "Map sau dễ hơn" : "Map sau khó hơn"}</h1>
        <p className="reward-copy">
          {isFinalStage
            ? "Stage cuối đã xong. Sau augment này là final boss."
            : `Đường tiếp theo sẽ là ${nextDifficulty === "easy" ? "easy map" : "hard map"}.`}
        </p>

        <div className="augment-card">
          <span>Augment nhận được</span>
          <strong>{augment.name}</strong>
          <p>{augment.description}</p>
        </div>

        <button type="button" className="pixel-btn pixel-btn-glow" onClick={onContinue}>
          Nhận augment
        </button>
      </div>
    </section>
  );
}
