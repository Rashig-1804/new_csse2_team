// level1.js - Red Riding Hood Level 1: Collect cookies in the woods
import GameEnvBackground from '../essentials/GameEnvBackground.js';
import Player from '../essentials/Player.js';
import FloorItem from '../FloorItem.js';

class GameLevelRedRidingHood1 {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data: wood.png as the woods background
    const image_src_wood = path + "/images/gamify/wood.png"; // Adjust path if wood.png is elsewhere
    const image_data_wood = {
      name: 'woods',
      greeting: "Welcome to the woods! Collect all the cookies to proceed!",
      src: image_src_wood,
      pixels: { height: 580, width: 1038 } // Adjust based on actual image size
    };

    // Player data for Red Riding Hood
    const sprite_src_redridinghood = path + "/images/gamify/redridinghood.png"; // Replace with actual sprite path
    const REDRIDINGHOOD_SCALE_FACTOR = 5;
    const sprite_data_redridinghood = {
      id: 'Red Riding Hood',
      greeting: "Hi, I'm Red Riding Hood! I need to collect cookies for Grandma!",
      src: sprite_src_redridinghood,
      SCALE_FACTOR: REDRIDINGHOOD_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: height - (height / REDRIDINGHOOD_SCALE_FACTOR) },
      pixels: { height: 384, width: 512 }, // Adjust based on sprite
      orientation: { rows: 3, columns: 4 },
      down: { row: 0, start: 0, columns: 3 },
      downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
      downLeft: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
      left: { row: 2, start: 0, columns: 3 },
      right: { row: 1, start: 0, columns: 3 },
      up: { row: 3, start: 0, columns: 3 },
      upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
      upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    };

    // Create background
    this.background = new GameEnvBackground(image_data_wood);

    // Create player
    this.player = new Player(sprite_data_redridinghood, gameEnv);

    // Create cookies as collectible FloorItems
    this.cookies = [];
    const cookieItem = { name: 'Cookie', emoji: '🍪' }; // Define cookie item
    // Add some cookies at random positions (adjust positions as needed)
    this.cookies.push(new FloorItem(width * 0.2, height * 0.3, cookieItem));
    this.cookies.push(new FloorItem(width * 0.5, height * 0.4, cookieItem));
    this.cookies.push(new FloorItem(width * 0.8, height * 0.2, cookieItem));
    // Add more as needed

    // Track collected cookies
    this.collectedCookies = 0;
    this.totalCookies = this.cookies.length;
  }

  // Update method called in game loop
  update() {
    // Update player
    this.player.update();

    // Check for cookie collection (simple collision detection)
    this.cookies.forEach((cookie, index) => {
      if (this.checkCollision(this.player, cookie)) {
        // Collect the cookie
        this.collectedCookies++;
        console.log(`Collected a cookie! ${this.collectedCookies}/${this.totalCookies}`);
        // Remove the cookie from the game
        cookie.element.remove();
        this.cookies.splice(index, 1);

        // Check if all cookies are collected
        if (this.collectedCookies >= this.totalCookies) {
          console.log("All cookies collected! Level complete.");
          // Transition to level 2 or show win message
        }
      }
    });
  }

  // Simple collision detection between player and cookie
  checkCollision(player, cookie) {
    const playerLeft = player.position.x;
    const playerRight = player.position.x + player.width;
    const playerTop = player.position.y;
    const playerBottom = player.position.y + player.height;

    const cookieLeft = cookie.x;
    const cookieRight = cookie.x + 50; // Approximate cookie size
    const cookieTop = cookie.y;
    const cookieBottom = cookie.y + 50;

    return !(playerRight < cookieLeft || playerLeft > cookieRight || playerBottom < cookieTop || playerTop > cookieBottom);
  }

  // Draw method
  draw() {
    this.background.draw();
    this.player.draw();
    // Cookies draw themselves via FloorItem
  }

  // Resize method
  resize() {
    this.background.resize();
    this.player.resize();
  }

  // Destroy method
  destroy() {
    this.background.destroy();
    this.player.destroy();
    this.cookies.forEach(cookie => cookie.element.remove());
  }
}

export default GameLevelRedRidingHood1;