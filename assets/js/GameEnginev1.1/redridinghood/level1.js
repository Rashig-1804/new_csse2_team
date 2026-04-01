// level1.js - Red Riding Hood Level 1
import Wolf from './wolf.js'; 
import GameEnvBackground from '../essentials/GameEnvBackground.js';
import Player from '../essentials/Player.js';
import { Coin } from './Coin.js';
import Leaderboard from './Leaderboard.js';

/**
 * Level 1: The Revelation of Little Red Riding Hood
 * Goal: Use the smart Coin class to collect 5 cookies.
 */
class GameLevelRedRidingHood1 {
  constructor(gameEnv, game) {
    this.gameEnv = gameEnv;
    this.gameControl = game;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    this.leaderboard = new Leaderboard(this.gameControl, {
        gameName: 'RedRidingHood',
        initiallyHidden: false
    });

    this.continue = true;
    this.scoreSubmitted = false;

    // --- RESET THE BANK ---
    this.gameEnv.stats = { coinsCollected: 0 };

    // --- HTML TITLE OVERLAY ---
    this.titleElement = document.createElement('div');
    this.titleElement.style = "position:absolute; top:60px; width:100%; text-align:center; color:red; font-size:40px; font-weight:900; font-family:monospace; z-index:9999; text-shadow: 2px 2px black;";
    this.titleElement.innerHTML = "The Revelation of Little Red Riding Hood";
    document.body.appendChild(this.titleElement);

    // --- HTML SCORE OVERLAY ---
    this.scoreElement = document.createElement('div');
    this.scoreElement.style = "position:absolute; bottom:20px; left:20px; color:red; font-size:28px; font-weight:bold; font-family:monospace; z-index:9999; text-shadow: 1px 1px black;";
    this.scoreElement.innerHTML = "Cookies Collected: 0";
    document.body.appendChild(this.scoreElement);

    // --- CONGRATS OVERLAY ---
    this.successElement = document.createElement('div');
    this.successElement.style = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(0,0,0,0.95); padding:50px; border:4px solid red; border-radius:15px; text-align:center; display:none; z-index:999999;";
    this.successElement.innerHTML = `
        <h1 style="color: red; font-size: 60px; margin-bottom: 20px;">CONGRATS!</h1>
        <p style="color: white; font-size: 26px; margin-bottom: 30px;">You collected all 5 cookies!</p>
        <button id="nextLevelBtn" style="padding: 20px 40px; font-size: 24px; cursor: pointer; background: red; color: white; border: none; font-weight: bold; border-radius: 8px;">
            MOVE TO LEVEL 2 →
        </button>
    `;
    document.body.appendChild(this.successElement);

    // --- BUTTON LOGIC ---
    this.successElement.querySelector('#nextLevelBtn').addEventListener('click', () => {
        const engine = this.gameEnv.gameControl || this.gameEnv.game?.gameControl || this.gameControl;
        if (engine && typeof engine.transitionToLevel === 'function') {
            engine.currentLevelIndex = 1; // Transitions to Level 2
            engine.transitionToLevel();
        }
    });

    // --- BACKGROUND AND PLAYER ---
    const image_data_wood = { name: 'woods', src: path + "/images/gamify/ridinghood/woods.png", pixels: { height: 580, width: 1038 } };
   
    const sprite_data_red = {
      id: 'player',
      src: path + "/images/gamify/ridinghood/red.png",
      SCALE_FACTOR: 5, STEP_FACTOR: 1000, ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: height - (height / 5) },
      pixels: { height: 192, width: 144 },
      orientation: { rows: 4, columns: 3 },
      down: { row: 0, start: 0, columns: 3 },
      left: { row: 1, start: 0, columns: 3 },
      right: { row: 2, start: 0, columns: 3 },
      up: { row: 3, start: 0, columns: 3 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    // --- SPRITE DATA: WOLF ---
    const sprite_data_wolf = {
        name: 'wolf',
        id: 'The Big Bad Wolf',
        src: path + "/images/gamify/ridinghood/wolfff.png",
        SCALE_FACTOR: 5,
        INIT_POSITION: { x: 0.5, y: 0.7 }, 
        pixels: { height: 192, width: 144 },
        orientation: { rows: 4, columns: 3 },
        down: { row: 0, start: 0, columns: 3 },
        left: { row: 1, start: 0, columns: 3 },
        right: { row: 2, start: 0, columns: 3 },
        up: { row: 3, start: 0, columns: 3 },
        prompt: `You are the Big Bad Wolf. You are polite but sneaky. Use your lines: 'Good morning, Little Red Riding Hood', 'Where are you going so early?', and ask 'And what’s that in your basket?'.`
    };

    this.classes = [
      { class: GameEnvBackground, data: image_data_wood },
      { class: Player, data: sprite_data_red },
      { class: Wolf, data: sprite_data_wolf }
    ];

    // --- SPAWN SMART COOKIES ---
    this.cookies = [];
    const cookiePositions = [
        { x: 0.1, y: 0.8 },
        { x: 0.3, y: 0.75 },
        { x: 0.5, y: 0.8 },
        { x: 0.7, y: 0.75 },
        { x: 0.7, y: 0.4 }
    ];

    cookiePositions.forEach((pos, index) => {
        const cookie = new Coin({
            id: `cookie-${index}`,
            INIT_POSITION: pos,
            SCALE_FACTOR: 12,
            value: 1,
            zIndex: 10
        }, this.gameEnv);
       
        this.cookies.push(cookie);
        this.gameEnv.gameObjects.push(cookie);
    });
  }
 
  /**
   * Update checks the Global Bank (gameEnv.stats)
   */
  update() {
    const currentScore = this.gameEnv.stats?.coinsCollected || 0;
   
    const lbScoreHtml = document.getElementById('leaderboard-current-score');
    if (lbScoreHtml) {
      lbScoreHtml.textContent = `Cookies: ${currentScore}`;
    }
   
    if (this.scoreElement) {
        this.scoreElement.innerHTML = "Cookies Collected: " + currentScore;
    }

    if (currentScore >= 5 && !this.scoreSubmitted) {
        this.scoreSubmitted = true; 
        this.successElement.style.display = 'block';

        if (this.leaderboard) {
            this.leaderboard.submitScore("Red", currentScore, "RedRidingHood")
                .then(entry => console.log('Score saved successfully:', entry))
                .catch(err => console.error('Save failed (Expected if backend is down):', err));
        }
    }

  }

  draw() {}
  resize() {}

  /**
   * Cleanup
   */
  destroy() {
    if (this.titleElement && this.titleElement.parentNode) this.titleElement.remove();
    if (this.scoreElement && this.scoreElement.parentNode) this.scoreElement.remove();
    if (this.successElement && this.successElement.parentNode) this.successElement.remove();
   
    if (this.leaderboard && typeof this.leaderboard.destroy === 'function') {
        this.leaderboard.destroy();
    }
  }
}

export default GameLevelRedRidingHood1;