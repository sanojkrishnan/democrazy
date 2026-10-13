export default function GameOver({ score, highScore, onRestart }) {
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
        gap: 14,
        padding: 20,
        boxSizing: "border-box",
        background: "rgba(15, 15, 20, 0.88)",
        color: "#fff",
        textAlign: "center",
        fontFamily: "Georgia, serif",
        lineHeight: 1.4,
      }}
    >
      <div>
        <div>
          <img
            style={{ width: "100px", height: "100px", objectFit: "fill" }}
            alt="modiXhitler"
            src="src/assets/images.png"
          />
        </div>
        <h1
          style={{
            fontFamily: "Pixelify Sans, sans-serif",
            fontOpticalSizing: "auto",
            fontWeight: 600,
            fontStyle: "normal",
            margin: 0,
            color: "#ff9933",
            fontSize: "clamp(48px, 10vw, 82px)",
          }}
        >
          Game Over!
        </h1>
        <h1
          style={{
            margin: 0,
            color: "#ff9933",
            fontSize: "clamp(24px, 5vw, 42px)",
          }}
        >
          404 Democracy Not Found!
        </h1>
      </div>

      <p style={{ margin: 0, fontSize: 18 }}>The chaser caught you!</p>

      <div style={{ display: "flex", gap: 32, margin: "8px 0" }}>
        <div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>YOUR SCORE</div>
          <strong style={{ fontSize: 28 }}>{score}</strong>
        </div>

        <div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>BEST SCORE</div>
          <strong style={{ fontSize: 28 }}>{highScore}</strong>
        </div>
      </div>

      <button
        onClick={onRestart}
        style={{
          padding: "12px 26px",
          border: "none",
          borderRadius: 10,
          background: "#e8590c",
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
