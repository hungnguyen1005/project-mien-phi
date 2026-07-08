import { characters } from "../../data/characters";

export default function CharacterSelection({ selectedCharacterId, onSelect, onBegin }) {
  return (
    <section className="flow-screen character-screen">
      <div className="screen-heading">
        <p className="eyebrow">Chọn class</p>
        <h1>Chọn lối chơi cho run này</h1>
      </div>

      <div className="character-grid">
        {characters.map((character) => {
          const selected = selectedCharacterId === character.id;

          return (
            <button
              key={character.id}
              type="button"
              className={`character-card ${selected ? "selected" : ""}`}
              onClick={() => onSelect(character.id)}
              style={{ "--accent": character.color }}
            >
              <span className="character-portrait">{character.image}</span>
              <strong>{character.name}</strong>
              <span>{character.style}</span>
              <small>{character.passive.name}</small>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="pixel-btn pixel-btn-glow"
        onClick={onBegin}
        disabled={!selectedCharacterId}
      >
        Bắt đầu
      </button>
    </section>
  );
}
