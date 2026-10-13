import { memo, useEffect, useState } from "react";
import runnerSrc from "./assets/chaser-runner.png";
import { ChaserCSS } from "./css";


const cache = new Map();
function trim(src) {
  if (!cache.has(src)) {
    cache.set(src, new Promise((resolve, reject) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const w = img.naturalWidth, h = img.naturalHeight;
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        const cx = c.getContext("2d", { willReadFrequently: true });
        cx.drawImage(img, 0, 0);
        const d = cx.getImageData(0, 0, w, h).data;
        let x0 = w, y0 = h, x1 = -1, y1 = -1;
        for (let y = 0; y < h; y++)
          for (let x = 0; x < w; x++)
            if (d[(y * w + x) * 4 + 3] > 8) {
              if (x < x0) x0 = x; if (x > x1) x1 = x;
              if (y < y0) y0 = y; if (y > y1) y1 = y;
            }
        if (x1 < 0) { x0 = 0; y0 = 0; x1 = w - 1; y1 = h - 1; }
        const tw = x1 - x0 + 1, th = y1 - y0 + 1;
        const o = document.createElement("canvas");
        o.width = tw; o.height = th;
        o.getContext("2d").drawImage(c, x0, y0, tw, th, 0, 0, tw, th);
        resolve({ url: o.toDataURL("image/png"), w: tw, h: th });
      };
      img.src = src;
    }));
  }
  return cache.get(src);
}
function useTrimmed(src) {
  const [t, setT] = useState(null);
  useEffect(() => {
    let alive = true;
    trim(src).then((r) => alive && setT(r)).catch(() => {});
    return () => { alive = false; };
  }, [src]);
  return t;
}
 
function RunningChaser({ size = 120, pose = "run", speed = 1, src = runnerSrc, style, ...rest }) {
  const t = useTrimmed(src);
  const layer = (cls) => t && (
    <div className={`chs-l chs-${cls}`} aria-hidden="true">
      <img src={t.url} alt="" draggable={false} />
    </div>
  );
  return (
    <div
      className="chs"
      data-pose={pose}
      role="img"
      aria-label="Chaser running behind"
      style={{ width: size, "--speed": speed, aspectRatio: t ? `${t.w}/${t.h}` : undefined, ...style }}
      {...rest}
    >
      <style>{ChaserCSS}</style>
      <div className="chs-bob">
        {layer("back")}
        {layer("front")}
        {layer("body")}
      </div>
    </div>
  );
}
 
export default memo(RunningChaser);
 