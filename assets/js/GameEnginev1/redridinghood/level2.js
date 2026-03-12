// level2.js - Red Riding Hood Level 2: The Chase
import GameEnvBackground from '../essentials/GameEnvBackground.js';
import Player from '../essentials/Player.js';
import Character from '../essentials/Character.js';

class PathBarrier {
    constructor(x, y, w, h, gameEnv) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.ctx = gameEnv.ctx;
    }

    draw(debug = false) {
        if (debug) {
            this.ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; 
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

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

    if (this.position.x > this.gameEnv.innerWidth) {
      this.position.x = -this.width;
    }
    if (this.position.x + this.width < 0) {
      this.position.x = this.gameEnv.innerWidth;
    }
  }

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
    this.debugMode = false; 

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

    this.barriers = [
        new PathBarrier(0, 0, width * 0.35, height * 0.45, gameEnv),        
        new PathBarrier(width * 0.45, height * 0.25, width * 0.15, height * 0.4, gameEnv), 
        new PathBarrier(width * 0.75, height * 0.5, width * 0.25, height * 0.5, gameEnv)   
    ];

    const image_data_chase = {
      name: 'chase',
      src: path + "/images/gamify/ridinghood/chase.png",
      pixels: { height: 580, width: 1038 }
    };

    const sprite_data_red = {
      id: 'Red Riding Hood',
      src: path + "/images/gamify/ridinghood/red.png",
      SCALE_FACTOR: 5, STEP_FACTOR: 1000, ANIMATION_RATE: 50,
      INIT_POSITION: { x: 50, y: height * 0.75 },
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
      SCALE_FACTOR: 3.5,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 8,
      INIT_POSITION: { x: 400, y: height * 0.5 }, 
      pixels: { height: 395, width: 632 },
      orientation: { rows: 1, columns: 1 },
      direction: 'right',
      SPEED: 2,
      zIndex: 20
    };

    this.classes = [
      { class: GameEnvBackground, data: image_data_chase },
      { class: Player, data: sprite_data_red },
      { class: Wolf, data: sprite_data_wolf }
    ];
  }

  checkCollision(rect1, rect2) {
    if (!rect1 || !rect1.position) return false;
    return (
      rect1.position.x < rect2.x + rect2.width &&
      rect1.position.x + (rect1.width / 2) > rect2.x &&
      rect1.position.y < rect2.y + rect2.height &&
      rect1.position.y + (rect1.height / 2) > rect2.y
    );
  }

  update() {
    if (!this.gameControl || !this.gameControl.gameObjects) return;
    this.barriers.forEach(barrier => {
        this.gameControl.gameObjects.forEach(obj => {
            if ((obj instanceof Player || obj instanceof Wolf) && this.checkCollision(obj, barrier)) {
                obj.position.x -= obj.velocity.x;
                obj.position.y -= obj.velocity.y;
            }
        });
    });
  }

  draw() {
    this.barriers.forEach(barrier => barrier.draw(this.debugMode));
  }

  resize() {}

  destroy() {
    if (this.titleElement && this.titleElement.parentNode) this.titleElement.remove();
  }
}

export default GameLevelRedRidingHood2;