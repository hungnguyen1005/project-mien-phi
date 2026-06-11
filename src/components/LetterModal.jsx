import { useEffect, useRef, useState } from "react";
import { birthdayLetter } from "../data/letter";

export default function LetterModal({ open, onReplay, onClose }) {
  const [visibleParagraphs, setVisibleParagraphs] = useState(0);
  const audioRef = useRef(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    if (!open) {
      setVisibleParagraphs(0);
      setAudioPlaying(false);
      return;
    }

    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisibleParagraphs(i);
      if (i >= birthdayLetter.paragraphs.length) clearInterval(timer);
    }, 1200);

    return () => clearInterval(timer);
  }, [open]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioPlaying) {
      audio.pause();
      setAudioPlaying(false);
    } else {
      audio.play().catch(() => {});
      setAudioPlaying(true);
    }
  };

  if (!open) return null;

  return (
    <div className="letter-overlay" role="dialog" aria-modal="true">
      <div className="letter-modal pixel-panel">
        <h2 className="letter-title">{birthdayLetter.title}</h2>
        <div className="letter-body">
          {birthdayLetter.paragraphs.slice(0, visibleParagraphs).map((p, i) => (
            <p key={i} className="letter-paragraph">
              {p}
            </p>
          ))}
        </div>

        <div className="letter-actions">
          <button type="button" className="pixel-btn" onClick={toggleAudio}>
            {audioPlaying ? "⏸ Pause Audio" : "▶ Play Audio"}
          </button>
          <button type="button" className="pixel-btn pixel-btn-glow" onClick={onReplay}>
            {birthdayLetter.replayButton}
          </button>
          <button type="button" className="pixel-btn" onClick={onClose}>
            Đóng
          </button>
        </div>

        <audio
          ref={audioRef}
          src={birthdayLetter.audioSrc}
          onEnded={() => setAudioPlaying(false)}
        />
      </div>
    </div>
  );
}
