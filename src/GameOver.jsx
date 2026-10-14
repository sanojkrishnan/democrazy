import { useEffect } from "react";
import moiXHitler from "./assets/images.png";
import { playGameOver, stopGameOver } from "./sounds";

export default function GameOver({ score, highScore, onRestart }) {
  useEffect(() => {
    playGameOver(); // 4. game over music

    return () => stopGameOver(); // stops when Play Again is pressed
  }, []);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        boxSizing: "border-box",
        background: "rgba(15, 15, 20, 0.88)",
        color: "#fff",
        textAlign: "center",
        fontFamily: "Georgia, serif",
        lineHeight: 1.2,
      }}
    >
      <div>
        <div>
          <img
            style={{ width: "50px", height: "50px", objectFit: "fill" }}
            alt="modiXhitler"
            src={moiXHitler}
          />
        </div>
        <h1
          style={{
            fontFamily: "Pixelify Sans, sans-serif",
            fontOpticalSizing: "auto",
            fontWeight: 600,
            fontStyle: "normal",
            margin: 0,
            color: "#ff0404",
            fontSize: "clamp(38px, 8vw, 72px)",
          }}
        >
          Game Over!
        </h1>
        <h1
          style={{
            margin: 0,
            color: "#ff0101",
            fontSize: "clamp(24px, 5vw, 42px)",
          }}
        >
          404 Democracy Not Found!
        </h1>
      </div>

      <p style={{ margin: 0, fontSize: 18 }}>The fascist caught you!</p>

      <div style={{ display: "flex", gap: 32, margin: "8px 0" }}>
        <div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>YOUR SCORE</div>
          <strong style={{ fontSize: 28 }}>{Math.floor(score)}</strong>
        </div>

        <div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>BEST SCORE</div>
          <strong style={{ fontSize: 28 }}>{Math.floor(highScore)}</strong>
        </div>
      </div>

      <button
        onClick={onRestart}
        style={{
          padding: "12px 26px",
          border: "none",
          borderRadius: 10,
          background: "#ff0000",
          color: "#fff",
          fontSize: 16,
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Play Again
      </button>
    </div>
  );
}
