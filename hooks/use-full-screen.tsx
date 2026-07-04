import { useEffect, useRef, useState } from "react";

export function useFullscreen() {
  const [fullScreen, setFullScreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    if (fullScreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else if (!fullScreen && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [fullScreen]);

  return { fullScreen, setFullScreen };
}
