// ====== CHANGE YOUR MUSIC FILE PATHS HERE ======
import backgroundFile from "/music.mp3"; // 1. background loop
import jumpFile from "/jumping.mp3"; // 2. runner jump
import evilLaughFile from "/laugh.mp3"; // 3. chaser catches runner
import gameOverFile from "/game-over.mp3"; // 4. game over screen
// ===============================================

// Volume for each sound (0.0 = silent, 1.0 = full)
const background = new Audio(backgroundFile);
background.loop = true; // keeps repeating
background.volume = 0.4;

const jump = new Audio(jumpFile);
jump.volume = 0.7;

const evilLaugh = new Audio(evilLaughFile);
evilLaugh.volume = 1;

const gameOver = new Audio(gameOverFile);
gameOver.volume = 0.8;

const play = (audio) => {
  audio.currentTime = 0;
  audio.play().catch(() => {}); // ignore browser autoplay errors
};

const stop = (audio) => {
  audio.pause();
  audio.currentTime = 0;
};

export const playBackground = () => play(background);
export const stopBackground = () => stop(background);

export const playJump = () => play(jump);

export const playEvilLaugh = () => play(evilLaugh);
export const stopEvilLaugh = () => stop(evilLaugh);

export const playGameOver = () => play(gameOver);
export const stopGameOver = () => stop(gameOver);

export const stopAllSounds = () => {
  stop(background);
  stop(jump);
  stop(evilLaugh);
  stop(gameOver);
};
