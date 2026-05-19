function play(file: string) {
  const audio = new Audio(`/sounds/${file}`);
  audio.play().catch(() => {});
}

export const playMoveSound = () => play("Move.mp3");
export const playCaptureSound = () => play("Capture.mp3");
export const playCheckSound = () => play("Check.mp3");
export const playCheckmateSound = () => play("Checkmate.mp3");
export const playVictorySound = () => play("Victory.mp3");
export const playDefeatSound = () => play("Defeat.mp3");
export const playDrawSound = () => play("Draw.mp3");
export const playErrorSound = () => play("Error.mp3");
export const playNewChallengeSound = () => play("NewChallenge.mp3");