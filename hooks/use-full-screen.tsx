import { useEffect, useRef } from "react";

export function useFullscreenOnInteraction(enabled: boolean = true) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const el = ref.current;

    const tryFullscreen = () => {
      document.documentElement.requestFullscreen?.().catch(() => {});
    };

    el.addEventListener("pointerdown", tryFullscreen, { once: true });
    return () => el.removeEventListener("pointerdown", tryFullscreen);
  }, [enabled]);

  useEffect(() => {
    if (enabled) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [enabled]);

  return ref;
}
