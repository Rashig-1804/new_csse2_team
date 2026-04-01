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
            left: { row: 1, start: 0, columns: 3 },
            right: { row: 2, start: 0, columns: 3 },
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

//bonus lines of code for granny npc for nor now unused 

 update() {
        if (this.wolfDefeated) {
            // Check for interaction if Grandma exists
            if (this.grandmaSpawned && this.grandmaNPC) {
                this.handleGrandmaInteraction();
            }
            return;
        }

        const bullets = this.gameEnv.gameObjects.filter(obj => obj.constructor.name === 'Bullet');
        const enemies = this.gameEnv.gameObjects.filter(obj => obj instanceof Enemy);

        if (enemies.length === 0) return;

        // Access the first element (the wolf)
        const enemy = enemies;
        if (enemy.isDefeated) return;

        bullets.forEach(bullet => {
            if (bullet.checkCollision(enemy)) {
                const hit = new HitMarker(bullet.x, bullet.y, this.gameEnv);
                this.gameEnv.gameObjects.push(hit);
                
                enemy.takeDamage(1);
                bullet.destroy();

                if (enemy.hp <= 0 && !this.wolfDefeated) {
                    this.wolfDefeated = true;
                    
                    const explosion = new Explosion(
                        enemy.x + enemy.width / 2, 
                        enemy.y + enemy.height / 2, 
                        this.gameEnv
                    );
                    this.gameEnv.gameObjects.push(explosion);

                    setTimeout(() => {
                        enemy.destroy(); 
                        this.spawnGrandma();
                    }, 500);
                }
            }
        });
    }

    /**
     * Spawns Grandma as an NPC after the wolf is gone
     */
    spawnGrandma() {
        let path = this.gameEnv.path;
        const grandmaData = {
            id: 'Grandma',
            src: path + "/images/gamify/grandma.png", 
            SCALE_FACTOR: 10,
            pixels: { height: 256, width: 256 },
            INIT_POSITION: { x: this.gameEnv.innerWidth * 0.15, y: this.gameEnv.innerHeight * 0.75 },
            greeting: "Good job my girl! These old wolfies have gone rampant this season.",
            dialogues: [
                "Now you said you have some cookies?",
                "I've been waiting quite a while in that dark belly!",
                "Press E one more time to play again!"
            ]
        };

        this.grandmaNPC = new Npc(grandmaData, this.gameEnv);
        this.gameEnv.gameObjects.push(this.grandmaNPC);
        this.grandmaSpawned = true;
        
        console.log("Grandma has appeared! Go talk to her.");
    }

    /**
     * Handles the proximity and key press for Grandma
     */
    handleGrandmaInteraction() {
        // Distance check between player and grandma
        const dx = this.player.x - this.grandmaNPC.x;
        const dy = this.player.y - this.grandmaNPC.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If close enough and player presses E (keycode 69)
        if (distance < 150 && this.player.keys && (this.player.keys['e'] || this.player.keys['u'])) {
            // If grandma has a dialogue system, it handles the cycle
            if (typeof this.grandmaNPC.showReactionDialogue === 'function') {
                this.grandmaNPC.showReactionDialogue();
                
                // If we reach the end of the conversation or a specific flag
                // We show the final play again button
                if (this.grandmaNPC.dialogueIndex >= this.grandmaNPC.dialogues.length - 1) {
                    setTimeout(() => this.showPlayAgainUI(), 1000);
                }
            } else {
                // Fallback if the Npc class isn't the complex version
                this.showPlayAgainUI();
            }
            
            // Clear the key so it doesn't spam
            if (this.player.keys['e']) this.player.keys['e'] = false;
            if (this.player.keys['u']) this.player.keys['u'] = false;
        }
    }

    showInstructions() {
        console.log("=== LEVEL 3: FACE THE WOLF ===");
        console.log("WASD - Move Red Riding Hood");
        console.log("Q - Shoot bullets");
        console.log("Defeat the wolf, then find Grandma!");
        console.log("============================");
    }

    showPlayAgainUI() {
        if (document.getElementById('victory-popup')) return;

        const message = document.createElement('div');
        message.id = 'victory-popup';
        message.style.position = 'absolute';
        message.style.top = '40%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.background = 'rgba(255,255,255,0.95)';
        message.style.border = '4px solid #b00';
        message.style.padding = '32px';
        message.style.borderRadius = '16px';
        message.style.fontSize = '1.5em';
        message.style.textAlign = 'center';
        message.style.zIndex = 1000;
        message.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
        
        message.innerHTML = `
            <h2 style="color:#b00; margin-top:0;">Adventure Complete!</h2>
            <p>You and Grandma are safe.</p>
            <br>
            <button onclick="location.reload()" style="padding:12px 24px; font-size:18px; cursor:pointer; background:#b00; color:white; border:none; border-radius:8px; font-weight:bold;">Play Again</button>
        `;
        document.body.appendChild(message);
    }

    resize() {}

    destroy() {
        const popup = document.getElementById('victory-popup');
        if (popup) popup.remove();
        this.gameEnv.gameObjects = [];
    }

    draw() {}
}

export default GameLevelRedRidingHood3;

export default GameLevelRedRidingHood3;