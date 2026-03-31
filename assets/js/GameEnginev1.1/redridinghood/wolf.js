import Character from '../essentials/Character.js';
import AiNpc from '../essentials/AiNpc.js';

class Wolf extends Character {
    constructor(data = null, gameEnv = null) {
        // 1. MATCH DATA TO YOUR LOG (632x395)
        if (data) {
            data.name = "wolf";
            data.pixels = { width: 632, height: 395 }; 
            // Tell the engine this is 1 big frame, not a 3x4 grid
            data.orientation = { rows: 1, columns: 1 }; 
            data.down = { row: 0, start: 0, columns: 1 };
            data.left = { row: 0, start: 0, columns: 1 };
            data.right = { row: 0, start: 0, columns: 1 };
            data.up = { row: 0, start: 0, columns: 1 };
        }
        
        super(data, gameEnv);
        this.gameEnv = gameEnv;
        this.spriteData = data;

        // 2. FORCE CANVAS TO THE CORRECT SIZE
        if (this.canvas) {
            this.canvas.width = 632;
            this.canvas.height = 395;
            // Scale it down visually so he's not taking up the whole screen
            this.canvas.style.width = "150px"; 
            this.canvas.style.height = "auto";
            this.canvas.style.zIndex = "9999"; 
            this.canvas.style.display = "block";
        }

        this.spriteData.chatHistory = [];
        this.spriteData.expertise = "the woods";
        this.isInteracting = false;
    }

    update() {
        this.draw();
        this.checkProximity();
    }

    checkProximity() {
        const player = this.gameEnv.gameObjects.find(obj => obj.canvas?.id === 'player');
        if (player) {
            const distance = Math.sqrt(
                Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2)
            );
            
            // Trigger AI interaction
            if (distance < 100 && !this.isInteracting) {
                this.isInteracting = true;
                if (AiNpc && typeof AiNpc.showInteraction === 'function') {
                    AiNpc.showInteraction(this);
                }
            } else if (distance >= 100) {
                this.isInteracting = false;
            }
        }
    }

    draw() {
        if (this.canvas) {
            this.canvas.style.zIndex = "9999";
        }
        super.draw();
    }
}

export default Wolf;