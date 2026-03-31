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
        this.isVisible = false;

        // Load sprite sheet if provided
        this.spriteSheet = null;
        this.spriteData = data.spriteData || {};
        if (this.spriteData.src) {
            this.spriteSheet = new Image();
            this.spriteSheet.onload = () => {
                this.isVisible = true;
                console.log('Bullet sprite loaded:', this.spriteData.src, 'Size:', this.spriteSheet.naturalWidth, 'x', this.spriteSheet.naturalHeight);
            };
            this.spriteSheet.onerror = () => {
                console.warn('Failed to load bullet sprite:', this.spriteData.src);
                this.isVisible = true; // Show fallback even if sprite fails
            };
            this.spriteSheet.src = this.spriteData.src;
        } else {
            this.isVisible = true;
        }
        this.frameIndex = 0;
        this.frameCounter = 0;
        this.animationRate = 3;
    }

    update() {
        // Move the bullet continuously in its direction
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Animation update
        this.frameCounter++;
        if (this.frameCounter >= this.animationRate) {
            this.frameIndex = (this.frameIndex + 1) % 3; // 3 frames per direction
            this.frameCounter = 0;
        }

        // Check lifetime (10 seconds)
        if (Date.now() - this.creationTime > this.lifetime) {
            this.destroy();
            return;
        }
    }

    draw() {
        if (this.destroyed) return;
        
        if (this.spriteSheet && this.spriteSheet.complete && this.spriteSheet.naturalWidth > 0) {
            this.drawSprite();
        } else {
            // Fallback: draw yellow cube if no sprite or sprite not loaded
            this.gameEnv.ctx.fillStyle = 'yellow';
            this.gameEnv.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    drawSprite() {
        if (!this.spriteSheet || !this.spriteSheet.complete) return;

        const ctx = this.gameEnv.ctx;
        const pixels = this.spriteData.pixels || { width: 120, height: 160 };
        const frameWidth = Math.round(pixels.width / 3);
        const frameHeight = Math.round(pixels.height / 4);

        // Map direction to row (down=0, left=1, right=2, up=3)
        const directionMap = { down: 0, left: 1, right: 2, up: 3 };
        const row = directionMap[this.direction] || 0;
        const sx = this.frameIndex * frameWidth;
        const sy = row * frameHeight;

        try {
            ctx.drawImage(
                this.spriteSheet,
                sx, sy, frameWidth, frameHeight,
                Math.round(this.x), Math.round(this.y), this.width, this.height
            );
        } catch (e) {
            console.warn('Error drawing bullet sprite:', e);
        }
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