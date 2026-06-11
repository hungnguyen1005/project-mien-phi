import { useEffect, useState, useCallback } from "react";

export default function DialogueBox({ lines = [], onComplete, visible }) {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (visible) setLineIndex(0);
  }, [visible, lines]);

  const advance = useCallback(() => {
    if (lineIndex < lines.length - 1) {
      setLineIndex((i) => i + 1);
    } else {
      onComplete?.();
    }
  }, [lineIndex, lines.length, onComplete]);

  useEffect(() => {
    if (!visible) return;

    const onKey = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, advance]);

  if (!visible || !lines.length) return null;

  return (
    <div className="dialogue-box">
      <div className="dialogue-inner pixel-panel">
        <p className="dialogue-speaker">em Tấn</p>
        <p className="dialogue-text">{lines[lineIndex]}</p>
        <div className="dialogue-footer">
          <span className="dialogue-hint">Enter hoặc Next</span>
          <button type="button" className="pixel-btn dialogue-next" onClick={advance}>
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
}
