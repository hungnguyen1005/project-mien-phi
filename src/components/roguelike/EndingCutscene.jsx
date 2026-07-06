import { useState } from "react";
import { ENDINGS } from "../../game/roguelike/gameState";
import { getEndingCutscene } from "../../game/roguelike/cutsceneSystem";

export default function EndingCutscene({ endingType, player, onRestart }) {
  const [lineIndex, setLineIndex] = useState(0);
  const cutscene = getEndingCutscene(endingType);
  const line = cutscene.lines[lineIndex];
  const isLastLine = lineIndex >= cutscene.lines.length - 1;
  const isTrueEnding = endingType === ENDINGS.TRUE;

  return (
    <section className={`flow-screen ending-screen ${isTrueEnding ? "true" : "shutdown"}`}>
      <div className="ending-stage">
        <div className={`ending-visual ${isTrueEnding ? "true-road" : "shutdown-grid"}`}>
          {isTrueEnding ? (
            <>
              <div className="ending-road" />
              <div className="ending-character player-ending">{player.character.image}</div>
              <div className="ending-character lover-ending">💝</div>
            </>
          ) : (
            <div className="shutdown-text">SYSTEM OFFLINE</div>
          )}
        </div>

        <div className="pixel-panel cutscene-panel">
          <p className="eyebrow">{cutscene.title}</p>
          <h1>{isTrueEnding ? "Cuối đường có em" : "Shutdown Cutscene"}</h1>
          <p className="cutscene-line">
            <strong>{line.speaker}:</strong> {line.text}
          </p>

          {isLastLine ? (
            <button type="button" className="pixel-btn pixel-btn-glow" onClick={onRestart}>
              Chơi lại
            </button>
          ) : (
            <button
              type="button"
              className="pixel-btn pixel-btn-glow"
              onClick={() => setLineIndex((current) => current + 1)}
            >
              Tiếp tục
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
