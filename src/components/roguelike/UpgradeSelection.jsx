const typeLabels = {
  weapon: "Weapon",
  armor: "Armor",
  artifact: "Artifact",
};

export default function UpgradeSelection({ choices, onChoose }) {
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
            className={`upgrade-card ${choice.type}`}
            onClick={() => onChoose(choice.id)}
          >
            <span className="upgrade-type">{typeLabels[choice.type]}</span>
            <strong>{choice.name}</strong>
            <small>{choice.choiceLabel}</small>
            <p>{choice.description}</p>
            <em>{choice.passive ?? choice.activeEffect}</em>
          </button>
        ))}
      </div>
    </section>
  );
}
