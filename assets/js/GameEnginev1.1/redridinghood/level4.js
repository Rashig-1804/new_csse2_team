// level4.js - Red Riding Hood Level 4: Shooting Minigame
import GameEnvBackground from '../essentials/GameEnvBackground.js';
import ShooterPlayer from './ShooterPlayer.js';
import Enemy from './Enemy.js';
import HitMarker from './HitMarker.js';

class GameLevelRedRidingHood4 {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        let width = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path = gameEnv.path;

        // Background data
        const image_src_forest = path + "/images/gamify/lrrh-lvl3-bg-clipped.png";
        const image_data_forest = {
            name: 'forest',
            greeting: "Level 4: Shooting Minigame! Press Q to shoot!",
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
            src: path + "/images/gamify/lrrh-lvl3-rider-gun-sh.png",
            SCALE_FACTOR: 6,
            STEP_FACTOR: 800,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: width / 2 - 50, y: height - 100 },
            pixels: { height: 384, width: 512 },
            orientation: { rows: 3, columns: 4 },
            down: { row: 0, start: 0, columns: 3 },
            left: { row: 2, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 },
            shootCooldown: 300 // Faster shooting for minigame
        };

        // Create shooter player
        this.player = new ShooterPlayer(sprite_data_red, gameEnv);

        // Minigame state
        this.score = 0;
        this.timeLeft = 60; // 60 seconds
        this.gameOver = false;
        this.enemies = [];
        this.maxEnemies = 5;
        this.enemySpawnRate = 2000; // Spawn every 2 seconds
        this.lastSpawnTime = Date.now();

        // Set up classes array for GameLevel system
        this.classes = [
            { class: GameEnvBackground, data: image_data_forest },
            { class: ShooterPlayer, data: sprite_data_red }
        ];

        // Timer
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);

        // Instructions
        this.showInstructions();
    }

    update() {
        if (this.gameOver) return;

        // Get player from game objects (created by GameLevel system)
        const player = this.gameEnv.gameObjects.find(obj => obj instanceof ShooterPlayer);
        if (!player) return;

        // Spawn enemies randomly
        const currentTime = Date.now();
        if (currentTime - this.lastSpawnTime > this.enemySpawnRate && this.enemies.length < this.maxEnemies) {
            this.spawnEnemy();
            this.lastSpawnTime = currentTime;
        }

        // Update enemies (cardboard cutout behavior)
        this.enemies.forEach((enemy, index) => {
            enemy.update();
            // Remove enemy after 3 seconds if not shot
            if (currentTime - enemy.spawnTime > 3000) {
                enemy.destroy();
                this.enemies.splice(index, 1);
                this.score -= 5; // Penalty for missing
            }
        });

        // Check bullet collisions with enemies
        player.bullets.forEach(bullet => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (bullet.checkCollision(enemy)) {
                    // Create hit marker at enemy position
                    const hitMarker = new HitMarker(
                        enemy.x + enemy.width / 2, // Center of enemy
                        enemy.y, // Top of enemy
                        this.gameEnv
                    );
                    this.gameEnv.gameObjects.push(hitMarker);

                    // Enemy defeated!
                    bullet.destroy();
                    enemy.destroy();
                    this.enemies.splice(enemyIndex, 1);
                    this.score += 10;
                    console.log(`Score: ${this.score}`);
                }
            });
        });
    }

    spawnEnemy() {
        const width = this.gameEnv.innerWidth;
        const height = this.gameEnv.innerHeight;

        // Random position (avoid bottom area where player is)
        const x = Math.random() * (width - 100);
        const y = Math.random() * (height - 200); // Keep above player area

        const enemyData = {
            id: `Enemy-${Date.now()}`,
            greeting: "Target!",
            src: this.gameEnv.path + "/images/gamify/chillguy.png",
            SCALE_FACTOR: 6,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: x, y: y },
            pixels: { height: 384, width: 512 },
            orientation: { rows: 3, columns: 4 },
            down: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.8, heightPercentage: 0.8 }
        };

        const enemy = new Enemy(enemyData, this.gameEnv);
        enemy.spawnTime = Date.now();
        this.enemies.push(enemy);
    }

    endGame() {
        this.gameOver = true;
        clearInterval(this.timerInterval);
        console.log(`🎯 GAME OVER! Final Score: ${this.score}`);
        console.log(`Time's up! You defeated ${this.score / 10} enemies!`);
    }

    showInstructions() {
        console.log("=== LEVEL 4: SHOOTING MINIGAME ===");
        console.log("WASD - Move Red Riding Hood");
        console.log("Q - Shoot bullets");
        console.log("Targets appear randomly - shoot them before they disappear!");
        console.log("Score: +10 for hits, -5 for misses");
        console.log("Time: 60 seconds");
        console.log("================================");
    }

    resize() {
        // GameLevel system handles resizing of background and player
    }

    destroy() {
        clearInterval(this.timerInterval);
        this.enemies.forEach(enemy => enemy.destroy());
        // GameLevel system handles destroying background and player
    }
}

export default GameLevelRedRidingHood4;