import { useEffect, useState } from 'react';

/**
 * LayerRail — the site's signature element.
 * A vertical strip fixed to the right edge of the viewport (desktop only)
 * that fills upward and reports a live "Z-height" as the visitor scrolls,
 * as if the page itself were being printed layer by layer.
 *
 * TOTAL_HEIGHT_MM / LAYER_HEIGHT_MM control the readout numbers.
 * Hide or restyle freely — it's fully self-contained.
 */
const TOTAL_HEIGHT_MM = 240;
const LAYER_HEIGHT_MM = 0.2;

export default function LayerRail() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const zHeight = (progress * TOTAL_HEIGHT_MM).toFixed(2);
  const layerCount = Math.round((progress * TOTAL_HEIGHT_MM) / LAYER_HEIGHT_MM);

  return (
    <div className="layer-rail" aria-hidden="true">
      <div className="layer-rail__track">
        <div className="layer-rail__fill" style={{ height: `${progress * 100}%` }} />
      </div>
      <div className="layer-rail__readout">
        <span className="layer-rail__z">Z {zHeight}</span>
        <span className="layer-rail__unit">mm</span>
        <span className="layer-rail__layer">L{layerCount.toString().padStart(4, '0')}</span>
      </div>

      <style>{`
        .layer-rail {
          position: fixed;
          right: 22px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          z-index: 40;
        }
        .layer-rail__track {
          width: 3px;
          height: 180px;
          background: var(--color-line);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }
        .layer-rail__fill {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: var(--color-yellow);
          transition: height 0.05s linear;
        }
        .layer-rail__readout {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-grey);
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1.5;
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        .layer-rail__z { color: var(--color-black); font-weight: 500; }
        .layer-rail__layer { color: var(--color-yellow-dim); }
        @media (max-width: 900px) {
          .layer-rail { display: none; }
        }
      `}</style>
    </div>
  );
}
