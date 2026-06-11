import MemoryRain from "./MemoryRain";
import { LANDING } from "../data/gameConfig";

export default function LandingPage({ onBegin }) {
  return (
    <section className="landing">
      <MemoryRain />
      <div className="landing-content pixel-panel">
        <p className="landing-eyebrow">✨ em Tấn → anh Hoàng ✨</p>
        <h1 className="landing-title">{LANDING.title}</h1>
        <p className="landing-subtitle">{LANDING.subtitle}</p>
        <button type="button" className="pixel-btn pixel-btn-glow" onClick={onBegin}>
          {LANDING.button}
        </button>
      </div>
    </section>
  );
}
