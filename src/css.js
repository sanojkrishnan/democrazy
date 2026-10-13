/**
 * RunningChaser - animated sprite built from ONE image, split into clipped layers
 * (back leg, front leg, body) and animated with CSS. Self-contained: no shared css file.
 *
 * Props
 *  size  CSS width, e.g. 120 or "100%" (height follows the aspect ratio)
 *  pose  "run" | "jump" | "idle"
 *  speed animation speed multiplier (1 = normal)
 *  src   override the image path
 */
export const ChaserCSS = `
.chs{position:relative;display:inline-block;aspect-ratio:994/1009;overflow:visible;transform-origin:50% 100%;
  --d:calc(.56s / var(--speed,1));transition:transform .08s}
.chs-bob,.chs-l{position:absolute;inset:0;overflow:visible}
.chs-l img{display:block;width:100%;height:100%;pointer-events:none;user-select:none;-webkit-user-drag:none}
.chs-l{will-change:transform}
.chs-back{clip-path:polygon(0.00% 68.38%,30.18% 64.92%,43.26% 63.43%,54.33% 63.43%,54.33% 72.35%,40.24% 72.84%,0.00% 100.00%);transform-origin:47.3% 64.4%}
.chs-front{clip-path:polygon(55.84% 69.38%,54.33% 55.50%,74.45% 54.01%,80.48% 59.46%,100.00% 84.24%,100.00% 100.00%,56.34% 100.00%);transform-origin:61.4% 61.4%}
.chs-body{clip-path:polygon(0.00% 0.00%,100.00% 0.00%,100.00% 56.49%,79.48% 56.49%,74.95% 56.89%,59.86% 64.02%,55.94% 69.38%,41.25% 70.96%,30.68% 65.81%,0.00% 65.41%)}
 
.chs[data-pose="run"] .chs-bob{animation:chs-bob calc(var(--d)/2) ease-in-out infinite}
.chs[data-pose="run"] .chs-back{animation:chs-back var(--d) ease-in-out infinite}
.chs[data-pose="run"] .chs-front{animation:chs-front var(--d) ease-in-out infinite}
 
.chs[data-pose="jump"] .chs-back{transform:rotate(8deg)}
.chs[data-pose="jump"] .chs-front{transform:rotate(-4deg)}
 
@keyframes chs-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.8%) rotate(-.8deg)}}
@keyframes chs-back{0%,100%{transform:rotate(6deg)}50%{transform:rotate(-12deg)}}
@keyframes chs-front{0%,100%{transform:rotate(10deg)}50%{transform:rotate(-8deg)}}
`;

/**
 * RunningSFI - animated sprite built from ONE image, split into clipped layers
 * (back leg, front leg, body, flag) and animated with CSS. Self-contained: no shared css file.
 *
 * Props
 *  size  CSS width, e.g. 120 or "100%" (height follows the aspect ratio)
 *  pose  "run" | "jump" | "duck" | "idle"
 *  speed animation speed multiplier (1 = normal)
 *  src   override the image path
 */
export const RunnerCSS =`
.sfi{position:relative;display:inline-block;aspect-ratio:912/1175;overflow:visible;transform-origin:50% 100%;
  --d:calc(.56s / var(--speed,1));transition:transform .08s}
.sfi[data-pose="duck"]{transform:scaleY(.62)}
.sfi-bob,.sfi-l{position:absolute;inset:0;overflow:visible}
.sfi-l img{display:block;width:100%;height:100%;pointer-events:none;user-select:none;-webkit-user-drag:none}
.sfi-l{will-change:transform}
.sfi-back{clip-path:polygon(6.58% 72.85%,32.89% 72.85%,51.54% 72.34%,52.63% 66.81%,63.05% 66.81%,64.14% 74.89%,64.14% 90.21%,6.58% 93.62%);transform-origin:61.4% 69.8%}
.sfi-front{clip-path:polygon(56.47% 66.81%,67.98% 66.81%,76.75% 72.34%,100.0% 81.7%,100.0% 100.0%,59.21% 100.0%,59.21% 81.7%,56.47% 76.6%);transform-origin:61.4% 69.8%}
.sfi-body{clip-path:polygon(69.08% 0.0%,100.0% 0.0%,100.0% 72.85%,0.0% 72.85%,0.0% 40.0%,6.03% 39.32%,12.06% 39.66%,32.89% 35.57%,57.02% 30.21%,79.39% 24.68%,78.73% 24.0%,69.52% 0.68%)}
.sfi-flag{clip-path:polygon(0.0% 12.77%,68.86% 0.0%,79.39% 24.51%,57.02% 30.21%,32.89% 35.57%,12.06% 39.66%,6.03% 38.72%,10.96% 33.19%,2.74% 20.43%);transform-origin:75.6% 12.8%}
 
.sfi[data-pose="run"] .sfi-bob{animation:sfi-bob calc(var(--d)/2) ease-in-out infinite}
.sfi[data-pose="run"] .sfi-back{animation:sfi-back var(--d) ease-in-out infinite}
.sfi[data-pose="run"] .sfi-front{animation:sfi-front var(--d) ease-in-out infinite}
.sfi[data-pose="run"] .sfi-flag,.sfi[data-pose="duck"] .sfi-flag{animation:sfi-flag var(--d) ease-in-out infinite}
.sfi[data-pose="duck"] .sfi-back{animation:sfi-back var(--d) ease-in-out infinite}
.sfi[data-pose="duck"] .sfi-front{animation:sfi-front var(--d) ease-in-out infinite}
.sfi[data-pose="jump"] .sfi-flag{animation:sfi-flag calc(var(--d)*1.6) ease-in-out infinite}
.sfi[data-pose="jump"] .sfi-back{transform:rotate(9deg)}
.sfi[data-pose="jump"] .sfi-front{transform:rotate(-6deg)}
 
@keyframes sfi-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.8%) rotate(-.8deg)}}
@keyframes sfi-back{0%,100%{transform:rotate(8deg)}50%{transform:rotate(-14deg)}}
@keyframes sfi-front{0%,100%{transform:rotate(12deg)}50%{transform:rotate(-8deg)}}
@keyframes sfi-flag{0%,100%{transform:skewY(-3deg) rotate(-1.5deg) scaleX(1.02)}50%{transform:skewY(3deg) rotate(1.5deg) scaleX(.97)}}
`;
