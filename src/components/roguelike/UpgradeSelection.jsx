import { useState } from "react";

const typeLabels = {
  weapon: "Weapon",
  armor: "Armor",
  artifact: "Artifact",
};

export default function UpgradeSelection({ choices, onChoose }) {
  const [replacementChoice, setReplacementChoice] = useState(null);

  const handleChoose = (choice) => {
    if (choice.needsReplacement) {
      setReplacementChoice(choice);
      return;
    }

    onChoose(choice.id);
  };

  return (
    <section className="flow-screen upgrade-screen">
      <div className="screen-heading">
        <p className="eyebrow">Level up</p>
        <h1>Chọn 1 nâng cấp</h1>
      </div>

      <div className="upgrade-grid">
        {choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className={`upgrade-card ${choice.type} rarity-${choice.rarity}`}
            onClick={() => handleChoose(choice)}
          >
            <span className="upgrade-type">
              {typeLabels[choice.type]} · {choice.rarityLabel}
            </span>
            <strong>{choice.name}</strong>
            <small>{choice.choiceLabel}</small>
            <p>{choice.stats}</p>
            <em>{choice.passive ?? choice.activeEffect}</em>
            <small>{choice.playstyle ?? choice.build}</small>
          </button>
        ))}
      </div>

      {replacementChoice && (
        <div className="pixel-panel replacement-panel">
          <p className="eyebrow">Artifact slot đầy</p>
          <h2>Thay artifact nào bằng {replacementChoice.name}?</h2>
          <div className="replacement-grid">
            {replacementChoice.replacementOptions.map((artifact) => (
              <button
                key={artifact.id}
                type="button"
                className={`upgrade-card artifact rarity-${artifact.rarity}`}
                onClick={() => onChoose(replacementChoice.id, artifact.id)}
              >
                <span className="upgrade-type">Đang trang bị</span>
                <strong>{artifact.name}</strong>
                <p>{artifact.stats}</p>
                <em>{artifact.passive}</em>
              </button>
            ))}
          </div>
          <button type="button" className="pixel-btn compact" onClick={() => setReplacementChoice(null)}>
            Quay lại
          </button>
        </div>
      )}
    </section>
  );
}
