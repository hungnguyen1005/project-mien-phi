import { useCallback, useState } from "react";
import { GAME_CONFIG } from "../data/gameConfig";

const KEY = GAME_CONFIG.localStorageKey;

function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { level: 0, completed: false };
  } catch {
    return { level: 0, completed: false };
  }
}

export function useGameProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const saveProgress = useCallback((value) => {
    setProgress((prev) => {
      const next =
        value === "completed"
          ? { ...prev, completed: true }
          : { ...prev, level: value, completed: false };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = { level: 0, completed: false };
    localStorage.setItem(KEY, JSON.stringify(fresh));
    setProgress(fresh);
  }, []);

  return { progress, saveProgress, resetProgress };
}
