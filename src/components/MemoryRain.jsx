import { useEffect, useRef } from "react";
import { memoryPhotos } from "../data/memories";

export default function MemoryRain({ active = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const items = [];

    const spawn = () => {
      const photo = memoryPhotos[Math.floor(Math.random() * memoryPhotos.length)];
      const el = document.createElement("div");
      el.className = "memory-rain-item";
      el.style.left = `${Math.random() * 100}%`;
      el.style.animationDuration = `${8 + Math.random() * 8}s`;
      el.style.animationDelay = `${Math.random() * 2}s`;

      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.caption;
      img.loading = "lazy";

      const cap = document.createElement("span");
      cap.className = "memory-rain-caption";
      cap.textContent = photo.caption;

      el.appendChild(img);
      el.appendChild(cap);
      container.appendChild(el);
      items.push(el);

      el.addEventListener("animationend", () => {
        el.remove();
        const idx = items.indexOf(el);
        if (idx > -1) items.splice(idx, 1);
      });
    };

    const interval = setInterval(spawn, 900);
    for (let i = 0; i < 6; i++) spawn();

    return () => {
      clearInterval(interval);
      items.forEach((el) => el.remove());
    };
  }, [active]);

  return <div ref={containerRef} className="memory-rain" aria-hidden="true" />;
}
