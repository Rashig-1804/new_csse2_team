// level2.js - Red Riding Hood Level 2: The Chase
import GameEnvBackground from '../essentials/GameEnvBackground.js';
import Player from '../essentials/Player.js';

class GameLevelRedRidingHood2 {
  constructor(gameEnv, game) {
    this.gameEnv = gameEnv;
    this.gameControl = game;
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    this.continue = true;

    // --- HTML TITLE OVERLAY ---
    this.titleElement = document.createElement('div');
    this.titleElement.style.position = 'absolute';
    this.titleElement.style.top = '60px';
    this.titleElement.style.width = '100%';
    this.titleElement.style.textAlign = 'center';
    this.titleElement.style.color = 'red';
    this.titleElement.style.fontSize = '40px';
    this.titleElement.style.fontWeight = '900';
    this.titleElement.style.fontFamily = '"Courier New", Courier, monospace';
    this.titleElement.style.textShadow = '2px 2px 4px black, 0 0 10px #ff0000';
    this.titleElement.style.zIndex = '9999';
    this.titleElement.innerHTML = "LEVEL 2: THE CHASE";
    document.body.appendChild(this.titleElement);

    // --- BACKGROUND: chase.png ---
    const image_data_chase = {
      name: 'chase',
      src: path + "/images/gamify/ridinghood/chase.png",
      pixels: { height: 580, width: 1038 }
    };

    // --- PLAYER: same red riding hood sprite ---
    const sprite_data_red = {
      id: 'Red Riding Hood',
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

    const list = [
      { class: GameEnvBackground, data: image_data_chase },
      { class: Player, data: sprite_data_red }
    ];

    this.classes = list;
    this.objects = list;
    this.gameObjectClasses = list;
    this.levels = list;

    this.background = new GameEnvBackground(image_data_chase, gameEnv);
    this.player = new Player(sprite_data_red, gameEnv);
  }

  update() {
    if (this.player) this.player.update();
  }

  draw() {
    if (this.background) this.background.draw();
    if (this.player) this.player.draw();
  }

  resize() {
    if (this.background) this.background.resize();
    if (this.player) this.player.resize();
  }

  destroy() {
    if (this.background) this.background.destroy();
    if (this.player) this.player.destroy();
    if (this.titleElement && this.titleElement.parentNode) this.titleElement.remove();
  }
}

export default GameLevelRedRidingHood2;