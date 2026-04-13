class Bullet {
    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.velocity = data.velocity || { x: 0, y: 0 };
        this.gameEnv = data.gameEnv;
        this.shooter = data.shooter;
        this.direction = data.direction || 'down'; // down, left, right, up
        this.width = 40;
        this.height = 40;
        this.lifetime = 10000; // 10 seconds
        this.creationTime = Date.now();
        this.destroyed = false;
        this.isVisible = true;
        this.frameIndex = 0;
        this.frameCounter = 0;
        this.animationRate = 3;
    }

    update() {
        // Move the bullet continuously in its direction
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Check lifetime (10 seconds)
        if (Date.now() - this.creationTime > this.lifetime) {
            this.destroy();
            return;
        }
    }

    draw() {
        if (this.destroyed) return;
        
        // Always show yellow cube
        this.gameEnv.ctx.fillStyle = 'yellow';
        this.gameEnv.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkCollision(target) {
        if (this.destroyed || !target) return false;

        return this.x < target.x + target.width &&
               this.x + this.width > target.x &&
               this.y < target.y + target.height &&
               this.y + this.height > target.y;
    }

    destroy() {
        if (!this.destroyed) {
            this.destroyed = true;
            // Don't remove from gameObjects - just mark as destroyed
            // This allows bullets to be cleaned up naturally by the game
        }
    }
}

export default Bullet;