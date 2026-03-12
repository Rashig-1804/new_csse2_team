// level2.js - Red Riding Hood Level 2: The Chase
import GameEnvBackground from '../essentials/GameEnvBackground.js';
import Player from '../essentials/Player.js';
import Character from '../essentials/Character.js';

class Wolf extends Character {
  constructor(data, gameEnv) {
    super(data, gameEnv);

    this.position = data.INIT_POSITION || { x: -this.width, y: gameEnv.innerHeight * 0.5 };
    this.velocity = { x: data.SPEED || 2, y: 0 };
    this.wrap = data.WRAP || true;
  }

  update() {
    this.draw();
    this.collisionChecks();
    this.move();

    // Loop the wolf back to left side once it leaves right side
    if (this.position.x > this.gameEnv.innerWidth) {
      this.position.x = -this.width;
    }
    if (this.position.x + this.width < 0) {
      this.position.x = this.gameEnv.innerWidth;
    }
  }

  // Override to let the wolf move continuously rather than being stopped by edges
  move() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

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

    const sprite_data_wolf = {
      id: 'Wolf',
      src: path + "/images/gamify/ridinghood/wolfff.png",
      SCALE_FACTOR: 3.5, // Lowered scale because 632px is already very large
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 8,
      INIT_POSITION: { x: 400, y: height - (height / 3.0) }, 
      pixels: { height: 395, width: 632 }, // UPDATED TO MATCH YOUR LOGS
      orientation: { rows: 1, columns: 1 },
      direction: 'right',
      SPEED: 2,
      zIndex: 20
    };

    const list = [
      { class: GameEnvBackground, data: image_data_chase },
      { class: Player, data: sprite_data_red },
      { class: Wolf, data: sprite_data_wolf }
    ];

    this.classes = list;
    this.objects = list;
    this.gameObjectClasses = list;
    this.levels = list;

    this.background = new GameEnvBackground(image_data_chase, gameEnv);
    this.player = new Player(sprite_data_red, gameEnv);
    this.wolf = new Wolf(sprite_data_wolf, gameEnv);
  }

  update() {
    if (this.player) this.player.update();
    if (this.wolf) this.wolf.update();
  }

  draw() {
    if (this.background) this.background.draw();
    if (this.player) this.player.draw();
    if (this.wolf) this.wolf.draw();
  }

  resize() {
    if (this.background) this.background.resize();
    if (this.player) this.player.resize();
    if (this.wolf) this.wolf.resize();
  }

  destroy() {
    if (this.background) this.background.destroy();
    if (this.player) this.player.destroy();
    if (this.wolf) this.wolf.destroy();
    if (this.titleElement && this.titleElement.parentNode) this.titleElement.remove();
  }
}

export default GameLevelRedRidingHood2;