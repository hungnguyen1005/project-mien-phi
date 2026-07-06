import { useState } from "react";
import { isPasswordCorrect, passwordConfig } from "../../data/questions";

export default function PasswordScreen({ onComplete }) {
  const [value, setValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  const isFirstWrong = attempts === 1;
  const isVeryWrong = attempts >= 2;

  const reaction = unlocked
    ? {
        icon: "🥰",
        text: passwordConfig.successText,
        className: "cute",
      }
    : isVeryWrong
      ? {
          icon: "🤬",
          text: passwordConfig.repeatedWrongText,
          className: "furious",
        }
      : isFirstWrong
        ? {
            icon: "😒",
            text: passwordConfig.firstWrongText,
            className: "annoyed",
          }
        : {
            icon: "🔐",
            text: "Nhập password đi anh.",
            className: "idle",
          };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (unlocked) {
      onComplete();
      return;
    }

    if (isPasswordCorrect(value)) {
      setUnlocked(true);
      return;
    }

    setAttempts((current) => current + 1);
    setValue("");
  };

  return (
    <section className="flow-screen password-screen">
      <div className={`reaction-icon ${reaction.className}`}>{reaction.icon}</div>
      <div className="pixel-panel password-panel">
        <p className="eyebrow">Birthday gate</p>
        <h1>Chỉ anh Hoàng được vào</h1>
        <p className="hint">{isVeryWrong ? passwordConfig.finalHint : passwordConfig.initialHint}</p>

        <form className="password-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="vd: 14/2"
            disabled={unlocked}
            autoFocus
          />
          <button type="submit" className="pixel-btn pixel-btn-glow">
            {unlocked ? "Đi tiếp" : "Mở khóa"}
          </button>
        </form>

        <p className={`password-feedback ${reaction.className}`}>{reaction.text}</p>
      </div>
    </section>
  );
}
