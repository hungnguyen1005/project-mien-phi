import { INTRO_LINES } from "../data/gameConfig";

export default function IntroStory({ onContinue }) {
  return (
    <section className="intro-story">
      <div className="pixel-panel intro-panel">
        <h2 className="intro-title">Hành trình ký ức</h2>
        <div className="intro-lines">
          {INTRO_LINES.map((line, i) => (
            <p key={i} className="intro-line">
              {line}
            </p>
          ))}
        </div>
        <button type="button" className="pixel-btn pixel-btn-glow" onClick={onContinue}>
          Continue
        </button>
      </div>
    </section>
  );
}
