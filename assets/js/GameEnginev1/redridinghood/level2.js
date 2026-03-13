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
    this.velocity = { x: 0, y: 0 };
    this.speed = data.SPEED || 2;
    this.waypoints = null;
    this.waypointIndex = 0;
  }

  buildWaypoints() {
    const W = this.gameEnv.innerWidth;
    const H = this.gameEnv.innerHeight;
    return [
      { x: W * 0.10, y: H * 0.95 },  // Village bottom-left start
      { x: W * 0.20, y: H * 0.75 },  // winding up from village
      { x: W * 0.30, y: H * 0.55 },  // curve up toward wolf's lair
      { x: W * 0.38, y: H * 0.35 },  // up toward forest path top
      { x: W * 0.50, y: H * 0.25 },  // Forest Path center-top
      { x: W * 0.60, y: H * 0.35 },  // curving right
      { x: W * 0.65, y: H * 0.55 },  // winding down-right
      { x: W * 0.72, y: H * 0.70 },  // toward bridge
      { x: W * 0.78, y: H * 0.80 },  // crossing bridge
      { x: W * 0.85, y: H * 0.60 },  // up-right after bridge
      { x: W * 0.90, y: H * 0.35 },  // heading to cottage
      { x: W * 0.95, y: H * 0.10 },  // Grandma's Cottage top-right
    ];
  }

  update() {
    if (!this.waypoints) {
      this.waypoints = this.buildWaypoints();
      this.position.x = this.waypoints[0].x;
      this.position.y = this.waypoints[0].y;
      this.waypointIndex = 1;
    }

    if (this.waypointIndex >= this.waypoints.length) {
      this.waypointIndex = 0;
      this.position.x = this.waypoints[0].x;
      this.position.y = this.waypoints[0].y;
      this.waypointIndex = 1;
    }

    const target = this.waypoints[this.waypointIndex];
    const dx = target.x - this.position.x;
    const dy = target.y - this.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.speed + 1) {
      this.position.x = target.x;
      this.position.y = target.y;
      this.waypointIndex++;
    } else {
      this.velocity.x = (dx / dist) * this.speed;
      this.velocity.y = (dy / dist) * this.speed;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }

    this.draw();
  }
}

class GameLevelRedRidingHood2 {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
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

    this.redStartPosition = { x: 50, y: height * 0.75 };

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
      INIT_POSITION: { x: width * 0.10, y: height * 0.95 },
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

  checkPlayerWolfCollision(player, wolf) {
    if (!player?.position || !wolf?.position) return false;
    return (
      player.position.x < wolf.position.x + wolf.width &&
      player.position.x + player.width > wolf.position.x &&
      player.position.y < wolf.position.y + wolf.height &&
      player.position.y + player.height > wolf.position.y
    );
  }

  update() {
    if (!this.gameEnv || !this.gameEnv.gameObjects) return;

    let player = null;
    let wolf = null;

    this.gameEnv.gameObjects.forEach(obj => {
      if (obj instanceof Player) player = obj;
      if (obj instanceof Wolf) wolf = obj;
    });

    if (player && wolf && this.checkPlayerWolfCollision(player, wolf)) {
      player.position.x = this.redStartPosition.x;
      player.position.y = this.redStartPosition.y;
      player.velocity.x = 0;
      player.velocity.y = 0;
    }

    this.barriers.forEach(barrier => {
      this.gameEnv.gameObjects.forEach(obj => {
        if (obj instanceof Player && this.checkCollision(obj, barrier)) {
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