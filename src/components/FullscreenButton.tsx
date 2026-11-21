import { useEffect, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface WebkitDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenEnabled?: boolean;
}

interface WebkitElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const syncState = () => {
      const doc = document as WebkitDocument;
      setIsFullscreen(Boolean(doc.fullscreenElement || doc.webkitFullscreenElement));
    };

    syncState();
    document.addEventListener('fullscreenchange', syncState);
    document.addEventListener('webkitfullscreenchange', syncState);
    return () => {
      document.removeEventListener('fullscreenchange', syncState);
      document.removeEventListener('webkitfullscreenchange', syncState);
    };
  }, []);

  const toggleFullscreen = async () => {
    const doc = document as WebkitDocument;
    const root = document.documentElement as WebkitElement;
    const active = Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);

    try {
      if (active) {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
      } else {
        if (root.requestFullscreen) {
          await root.requestFullscreen();
        } else if (root.webkitRequestFullscreen) {
          await root.webkitRequestFullscreen();
        }
      }
    } catch {
      // Ignore if fullscreen is blocked by browser or iframe permissions
    }
  };

  return (
    <button
      type="button"
      onClick={() => void toggleFullscreen()}
      className="min-h-[44px] px-4 py-2 border border-white/70 bg-black text-white font-mono-arcade text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-white hover:text-black active:bg-white active:text-black transition-colors cursor-pointer whitespace-nowrap"
    >
      {isFullscreen ? (
        <>
          <Minimize2 className="w-3.5 h-3.5" />
          <span>EXIT FULLSCREEN</span>
        </>
      ) : (
        <>
          <Maximize2 className="w-3.5 h-3.5" />
          <span>FULLSCREEN</span>
        </>
      )}
    </button>
  );
}
