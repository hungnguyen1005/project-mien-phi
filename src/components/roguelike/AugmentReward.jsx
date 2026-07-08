export default function AugmentReward({
  choices,
  questionResult,
  nextDifficulty,
  isFinalStage,
  onChoose,
}) {
  return (
    <section className="flow-screen augment-screen">
      <div className="pixel-panel reward-panel wide">
        <p className="eyebrow">{questionResult.correct ? "Đúng rồi" : "Sai mất rồi"}</p>
        <h1>{questionResult.correct ? "Map sau dễ hơn" : "Map sau khó hơn"}</h1>
        <p className="reward-copy">
          {isFinalStage
            ? "Stage cuối đã xong. Chọn augment cuối trước khi vào final boss."
            : `Đường tiếp theo sẽ là ${nextDifficulty === "easy" ? "easy map" : "hard map"}.`}
        </p>

        <div className="augment-choice-grid">
          {choices.map((augment) => (
            <button
              key={augment.id}
              type="button"
              className={`augment-card rarity-${augment.rarity}`}
              onClick={() => onChoose(augment.id)}
            >
              <span>Augment · {augment.rarityLabel}</span>
              <strong>{augment.name}</strong>
              <p>{augment.effectText}</p>
              <em>{augment.build}</em>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
