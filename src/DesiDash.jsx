import { useEffect, useRef, useState } from "react";
import RunningSFI from "./RunningSFI";
import RunningChaser from "./RunningChaser";
import RotatePhone from "./RotatePhone";
import GameOver from "./GameOver";

const W = 800,
  H = 300,
  G = 250;
const GIRL_X = 330,
  GIRL_W = 76; // girl sprite: left edge / width (canvas px)
const CHASER_W = 90; // chaser sprite width (canvas px)
const GAP_START = 100,
  CATCH_SPEED = 3.2; // px per frame the chaser closes in after a hit
const TYPES = [{ e: "🚧", w: 46, h: 40, y: 0 }];
const pct = (v, of) => `${(v / of) * 100}%`;

const loadHi = () => {
  try {
    return +localStorage.getItem("dd_hi") || 0;
  } catch {
    return 0;
  }
};
const saveHi = (v) => {
  try {
    localStorage.setItem("dd_hi", String(v | 0));
  } catch {
    /* ignore */
  }
};

const initial = () => ({
  status: "ready", // ready | run | over
  score: 0,
  speed: 6,
  py: 0,
  vy: 0,
  obstacles: [],
  timer: 60,
  frame: 0,
  bgx: 0,
  hi: loadHi(),
  gap: GAP_START,
  hit: false,
  chaserY: 0,
});

const IDLE = {
  girl: { pose: "idle", speed: 1 },
  chaser: { pose: "idle", speed: 1 },
};

export default function DesiDash() {
  const canvasRef = useRef(null);
  const game = useRef(initial());
  const girlRef = useRef(null);
  const chaserRef = useRef(null);
  const viewRef = useRef(IDLE);
  const [view, setView] = useState(IDLE);
  const [gameStatus, setGameStatus] = useState("ready");

  const gameContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const pausedRef = useRef(false);
  const [portrait, setPortrait] = useState(false);

  const restartGame = () => {
    const hi = game.current.hi;

    Object.assign(game.current, initial(), {
      status: "run",
      hi,
    });

    setGameStatus("run");
  };

  const enterFullscreen = async () => {
    const container = gameContainerRef.current;

    try {
      if (!container) return;

      if (!document.fullscreenElement) {
        // Request fullscreen directly from the user's tap/key action.
        await container.requestFullscreen();
      }

      // Request landscape orientation where supported.
      try {
        await screen.orientation?.lock?.("landscape");
      } catch {
        // Orientation lock is not supported in every browser.
      }
    } catch (error) {
      console.warn("Could not enter fullscreen:", error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement === gameContainerRef.current) {
        await document.exitFullscreen();
      }

      screen.orientation?.unlock?.();
    } catch (error) {
      console.warn("Could not exit fullscreen:", error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === gameContainerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    // phone-sized touch screen held upright
    const mq = window.matchMedia(
      "(orientation: portrait) and (pointer: coarse) and (max-width: 900px)",
    );
    const on = () => {
      setPortrait(mq.matches);
      pausedRef.current = mq.matches;
    };
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const s = game.current;
    let raf;

    const start = () => {
      const hi = s.hi;
      Object.assign(s, initial(), { status: "run", hi });
      setGameStatus("run");
    };

    const finish = () => {
      s.status = "over";

      if (s.score > s.hi) {
        s.hi = s.score;
        saveHi(s.hi);
      }

      setGameStatus("over");
    };

    const jump = async () => {
      if (pausedRef.current) return;

      // First tap: enter fullscreen only.
      if (!document.fullscreenElement) {
        await enterFullscreen();
        return;
      }

      // Second tap: start or restart the game.
      if (s.status !== "run") {
        start();
        return;
      }

      // Subsequent taps: jump.
      if (s.py === 0) {
        s.vy = 14.5;
      }
    };

    const onKeyDown = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    const onPointerDown = () => jump();
    const onKeyUp = (e) => {
      if (e.code === "ArrowDown") s.duck = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", onPointerDown);

    const emoji = (t, x, y, size) => {
      ctx.font = `${size}px serif`;
      ctx.textBaseline = "bottom";
      ctx.fillText(t, x, y);
    };

    // chaser's right edge on screen (his front foot)
    const chaserRight = () => GIRL_X + 14 - s.gap;

    const update = () => {
      if (s.status !== "run" || pausedRef.current) return;
      s.frame++;
      s.score += s.speed / 40;
      s.speed = Math.min(15, 6 + s.score / 120);

      // after a hit the girl stumbles (half speed) and the chaser closes in
      const v = s.speed * (s.hit ? 0.5 : 1);
      s.bgx += v;
      if (s.hit) s.gap -= CATCH_SPEED;

      if (s.py > 0 || s.vy > 0) {
        s.py += s.vy;
        s.vy -= 0.85;
        if (s.py <= 0) {
          s.py = 0;
          s.vy = 0;
        }
      }

      if (--s.timer <= 0) {
        const t = TYPES[(Math.random() * TYPES.length) | 0];
        s.obstacles.push({ ...t, x: W + 20, hit: false });
        s.timer = Math.max(35, 70 + Math.random() * 60 - s.speed * 2) | 0;
      }
      s.obstacles.forEach((o) => (o.x -= v));
      s.obstacles = s.obstacles.filter((o) => o.x > -80);

      // one hit on a barrier and the chaser catches her
      if (!s.hit) {
        const p = { x: GIRL_X + 20, y: G - s.py - 80, w: 34, h: 80 };
        for (const o of s.obstacles) {
          const b = {
            x: o.x + 6,
            y: G - o.y - o.h + 4,
            w: o.w - 12,
            h: o.h - 8,
          };
          if (
            p.x < b.x + b.w &&
            p.x + p.w > b.x &&
            p.y < b.y + b.h &&
            p.y + p.h > b.y
          ) {
            o.hit = true;
            s.hit = true;
            break;
          }
        }
      }

      // chaser hops over obstacles automatically
      const cl = chaserRight() - CHASER_W;
      let h = 0;
      for (const o of s.obstacles) {
        const t = (o.x - (cl - 30)) / (CHASER_W + 60);
        if (t > 0 && t < 1) h = Math.max(h, 4 * t * (1 - t) * 75);
      }
      s.chaserY = h;

      if (s.gap <= 0) {
        s.gap = 0;
        finish();
      }
    };

    const draw = () => {
      const g = ctx.createLinearGradient(0, 0, 0, G);
      g.addColorStop(0, "#bce0fd");
      g.addColorStop(0.55, "#f7f8f9");
      g.addColorStop(1, "#ffffff");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "rgba(255,255,255,.55)";
      ctx.beginPath();
      ctx.arc(650, 70, 34, 0, 7);
      ctx.fill();

      ctx.globalAlpha = 0.55;
      for (let i = 0; i < 4; i++) {
        const px = ((((i * 260 - s.bgx * 0.25) % 1040) + 1040) % 1040) - 100;
        emoji(i % 2 ? "🌴" : "🛕", px, G - 4, i % 2 ? 64 : 80);
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = "#5c3a1e";
      ctx.fillRect(0, G, W, 50);
      ctx.fillStyle = "#138808";
      ctx.fillRect(0, G, W, 5);
      ctx.fillStyle = "#fff";
      for (let i = 0; i < 20; i++) {
        const px = ((((i * 70 - s.bgx) % 1400) + 1400) % 1400) - 60;
        ctx.fillRect(px, G + 22, 24, 3);
      }
      ctx.fillStyle = "#ff9933";
      for (let i = 0; i < 10; i++) {
        const px = ((((i * 150 - s.bgx * 1.2) % 1500) + 1500) % 1500) - 60;
        ctx.beginPath();
        ctx.arc(px, G + 38, 4, 0, 7);
        ctx.fill();
      }

      s.obstacles.forEach((o) => {
        ctx.globalAlpha = o.hit ? 0.35 : 1;
        emoji(o.e, o.x, G - o.y, o.w * 0.9 + 6);
      });
      ctx.globalAlpha = 1;

      if (s.hit) {
        ctx.fillStyle = "rgba(220, 38, 38, 0.86)";
        ctx.fillRect(0, 0, W, H);
      }

      // ---- DOM sprites layered over the canvas ----
      const gEl = girlRef.current,
        cEl = chaserRef.current;
      if (gEl) gEl.style.bottom = pct(H - G + s.py, H);
      if (cEl) {
        cEl.style.left = pct(chaserRight() - CHASER_W, W);
        cEl.style.bottom = pct(H - G + s.chaserY, H);
      }
      const running = s.status === "run";
      const girlPose = !running ? "idle" : s.py > 0 ? "jump" : "run";
      const girlSpeed =
        Math.round(((s.speed * (s.slow > 0 ? 0.5 : 1)) / 6) * 4) / 4;
      const chaserPose = !running ? "idle" : s.chaserY > 2 ? "jump" : "run";
      const chaserSpeed =
        Math.round(((s.speed * (s.hit ? 1.4 : 0.8)) / 6) * 4) / 4;
      const next = {
        girl: { pose: girlPose, speed: girlSpeed },
        chaser: { pose: chaserPose, speed: chaserSpeed },
      };
      const v = viewRef.current;
      if (
        v.girl.pose !== next.girl.pose ||
        v.girl.speed !== next.girl.speed ||
        v.chaser.pose !== next.chaser.pose ||
        v.chaser.speed !== next.chaser.speed
      ) {
        viewRef.current = next;
        setView(next);
      }

      // ---- HUD ----
      ctx.fillStyle = "#3b2410";
      ctx.font = "bold 20px Georgia";
      ctx.textBaseline = "top";
      ctx.textAlign = "right";
      ctx.fillText(
        `HI ${String(s.hi | 0).padStart(5, "0")}   ${String(s.score | 0).padStart(5, "0")}`,
        785,
        14,
      );

      ctx.textAlign = "left";
      ctx.font = "bold 14px Georgia";
      ctx.fillStyle = "#3b2410";
      // const ratio = Math.max(0, Math.min(1, s.gap / GAP_MAX));

      // ctx.fillStyle =
      //   ratio > 0.5 ? "#2f9e44" : ratio > 0.25 ? "#f08c00" : "#e03131";
      // ctx.fillRect(16, 34, 140 * ratio, 10);

      if (s.status === "ready") {
        ctx.fillStyle = "rgba(0,0,0,.65)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "bold 38px Georgia";
        ctx.fillText(
          s.status === "ready" ? "Escape..!" : "404 Democracy Not Fount",
          400,
          70,
        );
        ctx.font = "20px Georgia";
        ctx.fillText(
          s.status === "ready"
            ? "Jump over every barrier 🚧 — one hit and he catches you!"
            : `Score ${s.score | 0}`,
          400,
          125,
        );
        ctx.fillText(
          s.status === "ready"
            ? "Press Space or tap to start"
            : "Press Space or tap to restart",
          400,
          155,
        );
        ctx.textAlign = "left";
      }
    };

    const loop = () => {
      update();
      draw();
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const sprite = {
    position: "absolute",
    bottom: pct(H - G, H),
    pointerEvents: "none",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Georgia, serif",
        width: "100%",
      }}
    >
      {/* Rotate phone overlay */}
      {portrait && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "#000",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: 24,
            textAlign: "center",
            fontFamily: "Georgia, serif",
          }}
        >
          <div style={{ fontSize: 56 }}>
            <RotatePhone />
          </div>
          <h2 style={{ margin: 0 }}>Rotate your phone</h2>
          <p style={{ margin: 0 }}>This game only works in landscape mode.</p>
        </div>
      )}
      <h1 style={{ margin: "4px 0", color: "#e8590c" }}>
        Escape from the dictator
      </h1>
      <p style={{ margin: "4px 0 12px", textAlign: "center" }}>
        Space / ↑ / tap to jump | don't let the modiji catch you
      </p>

      {/* Game container */}

      <div
        ref={gameContainerRef}
        style={{
          position: "relative",
          width: isFullscreen ? "100vw" : "100%",
          height: isFullscreen ? "100dvh" : "auto",
          maxWidth: isFullscreen ? "none" : undefined,
          lineHeight: 0,
          border: isFullscreen ? "none" : "3px solid #e8590c",
          borderRadius: isFullscreen ? 0 : 12,
          overflow: "hidden",
          background: "#bce0fd",
          padding: "auto",
        }}
      >
        {/* Fullscreen controls */}
        {!isFullscreen && (
          <button
            onClick={enterFullscreen}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              padding: "8px 12px",
              border: "none",
              borderRadius: 8,
              background: "#e8590c",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              lineHeight: 1.2,
            }}
          >
            ⛶ Fullscreen
          </button>
        )}

        {isFullscreen && (
          <button
            onClick={exitFullscreen}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              padding: "8px 12px",
              border: "none",
              borderRadius: 8,
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              cursor: "pointer",
              lineHeight: 1.2,
            }}
          >
            ✕ Exit
          </button>
        )}

        {/* Game canvas */}
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{
            width: "100%",
            height: isFullscreen ? "100%" : "auto",
            aspectRatio: isFullscreen ? undefined : "8 / 3",
            touchAction: "none",
            display: "block",
          }}
        />

        {/* Chaser (behind) */}
        <div
          ref={chaserRef}
          style={{
            ...sprite,
            left: pct(GIRL_X + 14 - GAP_START - CHASER_W, W),
            width: pct(CHASER_W, W),
          }}
        >
          <RunningChaser
            size="100%"
            pose={view.chaser.pose}
            speed={view.chaser.speed}
          />
        </div>

        {/* Girl (front) */}
        <div
          ref={girlRef}
          style={{
            ...sprite,
            left: pct(GIRL_X, W),
            width: pct(GIRL_W, W),
          }}
        >
          <RunningSFI
            size="100%"
            pose={view.girl.pose}
            speed={view.girl.speed}
          />
        </div>

        {/* Game Over overlay */}
        {gameStatus === "over" && (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GameOver
              onRestart={restartGame}
              score={Math.floor(game.current.score)}
              highScore={game.current.hi}
            />
          </div>
        )}
      </div>
    </div>
  );
}
