import GameObject from './GameObject.js';

export class GameEnvBackground extends GameObject {
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        this.image = new Image();
        if (data && data.src) {
            this.image.src = data.src;
        }
    }

    update() {
        this.draw();
    }

    draw() {
        if (!this.gameEnv || !this.gameEnv.ctx) return;
        
        const ctx = this.gameEnv.ctx;
        const width = this.gameEnv.innerWidth;
        const height = this.gameEnv.innerHeight;

        // Force the draw even if 'complete' hasn't flagged true yet
        if (this.image.src) {
            ctx.drawImage(this.image, 0, 0, width, height);
        }
    }

    resize() {
        this.draw();
    }

    destroy() {
        if (this.gameEnv && this.gameEnv.gameObjects) {
            const index = this.gameEnv.gameObjects.indexOf(this);
            if (index !== -1) {
                this.gameEnv.gameObjects.splice(index, 1);
            }
        }
    }
}

export default GameEnvBackground;