import { introPopupLines } from "../../data/dialogues";

export default function IntroPopup({ onContinue }) {
  return (
    <section className="flow-screen intro-popup-screen">
      <div className="pixel-panel intro-popup">
        <p className="eyebrow">Mini game bắt đầu</p>
        <h1>Hành trình ký ức</h1>
        <div className="dialogue-lines">
          {introPopupLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <button type="button" className="pixel-btn pixel-btn-glow" onClick={onContinue}>
          Tiếp tục
        </button>
      </div>
    </section>
  );
}
