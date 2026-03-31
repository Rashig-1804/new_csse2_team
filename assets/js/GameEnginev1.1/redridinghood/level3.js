// level3.js - Red Riding Hood Level 3: The Confrontation
import GameEnvBackground from '../essentials/GameEnvBackground.js';
import ShooterPlayer from './ShooterPlayer.js';
import Enemy from './Enemy.js';
import HitMarker from './HitMarker.js';
import Explosion from './Explosion.js';

class GameLevelRedRidingHood3 {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        let width = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path = gameEnv.path;

        // Background data
        const image_src_forest = path + "/images/gamify/lrrh-lvl3-bg-clipped.png"; // Using clipped background
        const image_data_forest = {
            name: 'forest',
            greeting: "Level 3: Dominate him Baka! Press Q to shoot your heavy metal!",
            src: image_src_forest,
            pixels: { height: 580, width: 1038 }
        };

        // Create background
        this.background = new GameEnvBackground(image_data_forest, gameEnv);

        // Player data - using ShooterPlayer
        const sprite_src_red = path + "/images/gamify/Finalred.png";
        const sprite_data_red = {
            id: 'RedRidingHood',
            greeting: "Red Riding Hood - Press Q to shoot!",
            src: path + "/images/gamify/Finalred.png",
            SCALE_FACTOR: 6,
            STEP_FACTOR: 800,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: width / 2 - 50, y: height - 100 },
            pixels: { height: 144, width: 192 },
            orientation: { rows: 3, columns: 4 },
            down: { row: 0, start: 0, columns: 3 },
            left: { row: 2, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 },
            shootCooldown: 500
        };

        // Create shooter player
        this.player = new ShooterPlayer(sprite_data_red, gameEnv);

        // Create single enemy in upper middle
        const enemyData = {
            id: 'Wolf',
            greeting: "The Wolf!",
            src: path + "/images/gamify/lrrh-lvl3-bigbadwolf.png",
            SCALE_FACTOR: 2,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: width / 2 - 300, y: 50 }, // Upper middle
            pixels: { height: 1640, width: 2360 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.8, heightPercentage: 0.8 }
        };

        this.enemy = new Enemy(enemyData, gameEnv);
        this.enemyDefeated = false;

        // Set up classes array for GameLevel system
        this.classes = [
            { class: GameEnvBackground, data: image_data_forest },
            { class: ShooterPlayer, data: sprite_data_red },
            { class: Enemy, data: enemyData }
        ];

        // Instructions
        this.showInstructions();
    }

    update() {
        if (this.enemyDefeated) return;

        // Get player and enemy from game objects (created by GameLevel system)
        const player = this.gameEnv.gameObjects.find(obj => obj instanceof ShooterPlayer);
        const enemy = this.gameEnv.gameObjects.find(obj => obj instanceof Enemy);

        if (!player || !enemy) return;

        // Block player movement if overlapping wolf's sprite area
        const playerBox = {
            x: player.position.x,
            y: player.position.y,
            width: player.width,
            height: player.height
        };
        const wolfBox = {
            x: enemy.x,
            y: enemy.y,
            width: enemy.width,
            height: enemy.height
        };
        if (
            playerBox.x < wolfBox.x + wolfBox.width &&
            playerBox.x + playerBox.width > wolfBox.x &&
            playerBox.y < wolfBox.y + wolfBox.height &&
            playerBox.y + playerBox.height > wolfBox.y
        ) {
            // Push player back out of wolf's sprite area
            if (player.velocity.x > 0) player.position.x = wolfBox.x - playerBox.width;
            else if (player.velocity.x < 0) player.position.x = wolfBox.x + wolfBox.width;
            if (player.velocity.y > 0) player.position.y = wolfBox.y - playerBox.height;
            else if (player.velocity.y < 0) player.position.y = wolfBox.y + wolfBox.height;
        }

        // Check bullet collisions with enemy
        player.bullets.forEach(bullet => {
            if (bullet.checkCollision(enemy)) {
                // Damage the enemy
                enemy.takeDamage(1);
                bullet.destroy(); // Bullet vanishes on hit

                // Show hit marker for 0.5s after every hit
                const hitMarker = new HitMarker(
                    enemy.x + enemy.width / 2, // Center of enemy
                    enemy.y, // Top of enemy
                    this.gameEnv
                );
                this.gameEnv.gameObjects.push(hitMarker);

                // Check if enemy is defeated
                if (enemy.hp <= 0) {
                    this.enemyDefeated = true;
                    // Show explosion for 1s
                    const explosion = new Explosion(
                        enemy.x + enemy.width / 2,
                        enemy.y + enemy.height / 2,
                        this.gameEnv
                    );
                    this.gameEnv.gameObjects.push(explosion);

                    // After 1s, transform wolf into grandma and show message
                    setTimeout(() => {
                        // Add grandma sprite at wolf's position
                        const grandma = new Image();
                        grandma.src = this.gameEnv.path + '/images/gamify/lrrh-lvl3-grandma.png';
                        const ctx = this.gameEnv.ctx;
                        ctx.drawImage(
                            grandma,
                            enemy.x,
                            enemy.y,
                            enemy.width,
                            enemy.height
                        );
                        // Show message and link
                        this.showGrandmaVictory();
                    }, 1000);

                    enemy.destroy(); // Remove wolf sprite
                }
            }
        });
    }

    showInstructions() {
        console.log("=== LEVEL 3: FACE THE WOLF ===");
        console.log("WASD - Move Red Riding Hood");
        console.log("Q - Shoot bullets");
        console.log("Defeat the wolf in the upper middle!");
        console.log("============================");
    }


    showGrandmaVictory() {
        // Display message and link to next level
        const message = document.createElement('div');
        message.style.position = 'absolute';
        message.style.top = '30%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.background = 'rgba(255,255,255,0.95)';
        message.style.padding = '32px';
        message.style.borderRadius = '16px';
        message.style.fontSize = '1.5em';
        message.style.textAlign = 'center';
        message.style.zIndex = 1000;
        message.innerHTML = `Good job my girl! These old wolfies have gone rampant this season.<br>Now you said you have some cookies?<br><br><a href='level4.html' style='font-size:1.2em;color:#b00;'>Go to Next Level</a>`;
        document.body.appendChild(message);
    }

    resize() {
        // GameLevel system handles resizing of background, player, and enemy
    }

    destroy() {
        // GameLevel system handles destroying background, player, and enemy
    }
}

export default GameLevelRedRidingHood3;