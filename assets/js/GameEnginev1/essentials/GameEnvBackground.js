import GameObject from './GameObject.js';

/** Background class for primary background
 * */
export class GameEnvBackground extends GameObject {
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        if (data && data.src) {
            this.image = new Image();
            this.image.src = data.src;
            // Optional zoom/crop controls (useful for resizing backgrounds)
            // - zoom: number > 1 to zoom in (cropping from center)
            // - crop: { x, y, width, height } to manually select a portion of the image
            this.zoom = data.zoom || 1;
            this.crop = data.crop || null;
            // NEW: Force a redraw as soon as the image physically loads
            this.image.onload = () => {
                this.draw();
            };
        } else {
            this.image = null;
        }
    }

    update() {
        this.draw();
    }

    draw() {
        // Safety check to ensure gameEnv and ctx exist
        if (!this.gameEnv || !this.gameEnv.ctx) return;
        
        const ctx = this.gameEnv.ctx;
        const width = this.gameEnv.innerWidth;
        const height = this.gameEnv.innerHeight;

        if (this.image && this.image.complete && this.image.naturalWidth > 0) {
            // Draw the background image scaled to the canvas size
            // Optional zoom/crop lets us "zoom in" or display a subsection of the source image
            let sx = 0;
            let sy = 0;
            let sw = this.image.naturalWidth;
            let sh = this.image.naturalHeight;

            if (this.crop) {
                sx = this.crop.x || 0;
                sy = this.crop.y || 0;
                sw = this.crop.width || sw;
                sh = this.crop.height || sh;
            } else if (this.zoom && this.zoom > 1) {
                sw = Math.floor(this.image.naturalWidth / this.zoom);
                sh = Math.floor(this.image.naturalHeight / this.zoom);
                sx = Math.floor((this.image.naturalWidth - sw) / 2);
                sy = Math.floor((this.image.naturalHeight - sh) / 2);
            }

            ctx.drawImage(this.image, sx, sy, sw, sh, 0, 0, width, height);
        } else {
            // Fill the canvas with fillstyle color if no image is provided or still loading
            ctx.fillStyle = '#063970'; 
            ctx.fillRect(0, 0, width, height);
        }
    }

    /** For primary background, resize is the same as draw
     *
     */
    resize() {
        this.draw();
    }

    /** Destroy Game Object
     * remove object from this.gameEnv.gameObjects array
     */
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