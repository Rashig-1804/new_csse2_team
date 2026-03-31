import Npc from '../essentials/Npc.js';
import Player from '../essentials/Player.js';

/**
 * Coin Class - Adapted for Little Red Riding Hood's Cookies
 * This version uses a real <img> element (FloorItem style) 
 * but connects to the GameEngine for scoring.
 */
class Coin extends Npc {
    constructor(data = null, gameEnv = null) {
        // 1. Setup the Engine Data
        const coinData = {
            id: data?.id || 'cookie',
            pixels: { width: 100, height: 100 }, 
            INIT_POSITION: data?.INIT_POSITION || { x: 0.5, y: 0.5 },
            SCALE_FACTOR: data?.SCALE_FACTOR || 10,
            ...data
        };
        super(coinData, gameEnv);

        this.value = Number(data?.value ?? 1);
        this.collected = false;

        // 2. CREATE THE IMAGE ELEMENT (FloorItem Style)
        this.element = document.createElement('img');
        this.element.src = this.gameEnv.path + '/images/gamify/ridinghood/cookie.png';
        this.element.style.position = 'absolute';
        this.element.style.width = '50px'; 
        this.element.style.height = '50px';
        this.element.style.zIndex = '1000';
        this.element.style.pointerEvents = 'none';

        // 3. Add to the game container
        const container = document.getElementById('gameContainer') || document.body;
        container.appendChild(this.element);

        // Initial placement
        this.updateElementPosition();
    }

    /**
     * Matches the Image position to the Engine position
     */
    updateElementPosition() {
        if (this.canvas && this.element) {
            this.element.style.left = this.canvas.offsetLeft + 'px';
            this.element.style.top = this.canvas.offsetTop + 'px';
            this.element.style.display = this.collected ? 'none' : 'block';
        }
    }

    /**
     * Engine loop
     */
    update() {
        if (this.collected) return;
        
        // Hide the invisible engine canvas
        if (this.canvas) this.canvas.style.opacity = '0';
        
        this.updateElementPosition();
        this.checkPlayerCollision();
    }

    /**
     * Collision Logic
     */
    checkPlayerCollision() {
        for (const gameObj of this.gameEnv.gameObjects) {
            const id = String(gameObj?.id ?? gameObj?.spriteData?.id ?? '').toLowerCase();
            if (id === 'player') {
                this.isCollision(gameObj);
                if (this.collisionData.hit) {
                    this.collect();
                }
            }
        }
    }

    /**
     * Scoring Logic (The "Smart" Part)
     */
    collect() {
        if (this.collected) return;
        this.collected = true;
        
        // Deposit point into the Global Bank
        if (this.gameEnv) {
            if (!this.gameEnv.stats) {
                this.gameEnv.stats = { coinsCollected: 0 };
            }
            this.gameEnv.stats.coinsCollected += this.value;
        }

        console.log("Cookie collected! Score:", this.gameEnv.stats.coinsCollected);
        this.destroy();
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        const index = this.gameEnv?.gameObjects?.indexOf(this);
        if (index > -1) {
            this.gameEnv.gameObjects.splice(index, 1);
        }
    }
}

export default Coin;
export { Coin };