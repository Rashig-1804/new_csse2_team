// level1.js - Red Riding Hood Level 1
import GameEnvBackground from '../essentials/GameEnvBackground.js';
import Player from '../essentials/Player.js';
import FloorItem from '../FloorItem.js';

class GameLevelRedRidingHood1 {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Score Tracking
    this.score = 0;

    // Data Definitions
    const image_data_wood = { name: 'woods', src: path + "/images/gamify/ridinghood/woods.png", pixels: { height: 580, width: 1038 } };
    const sprite_data_red = {
      id: 'Red Riding Hood',
      src: path + "/images/gamify/ridinghood/red.png",
      SCALE_FACTOR: 5, STEP_FACTOR: 1000, ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: height - (height / 5) },
      pixels: { height: 192, width: 144 },
      orientation: { rows: 4, columns: 3 },
      down: { row: 0, start: 0, columns: 3 },
      left: { row: 2, start: 0, columns: 3 },
      right: { row: 1, start: 0, columns: 3 },
      up: { row: 3, start: 0, columns: 3 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    // THE UNIVERSAL FIX: Providing every name the engine might be looking for
    const list = [
      { class: GameEnvBackground, data: image_data_wood },
      { class: Player, data: sprite_data_red }
    ];

    this.classes = list;
    this.objects = list;
    this.gameObjectClasses = list;
    this.levels = list;

    // Manual Init
    this.background = new GameEnvBackground(image_data_wood, gameEnv);
    this.player = new Player(sprite_data_red, gameEnv);

    // Cookies
    this.cookies = [];
    const cookieItem = { name: 'Cookie', image: path + '/images/gamify/ridinghood/cookie.png' };
    
    // 5 Cookies placed near the base
    this.cookies.push(new FloorItem(width * 0.1, height * 0.8, cookieItem));
    this.cookies.push(new FloorItem(width * 0.3, height * 0.75, cookieItem));
    this.cookies.push(new FloorItem(width * 0.5, height * 0.8, cookieItem));
    this.cookies.push(new FloorItem(width * 0.7, height * 0.75, cookieItem));
    this.cookies.push(new FloorItem(width * 0.9, height * 0.8, cookieItem));
  }

  update() {
    if (this.player) this.player.update();
    this.cookies.forEach((cookie, index) => {
      if (this.checkCollision(this.player, cookie)) {
        cookie.element.remove();
        this.cookies.splice(index, 1);
        this.score++; 
        console.log("Cookies Collected: " + this.score);
      }
    });
  }

  checkCollision(player, cookie) {
    if (!player || !cookie) return false;
    return !( (player.position.x + player.width) < cookie.x || 
               player.position.x > (cookie.x + 50) || 
              (player.position.y + player.height) < cookie.y || 
               player.position.y > (cookie.y + 50));
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
    this.cookies.forEach(c => { if(c.element) c.element.remove(); });
  }
}

export default GameLevelRedRidingHood1;