// Enemy.js - Enemy character class for Red Riding Hood game
import Character from '../essentials/Character.js';

class Enemy extends Character {
    constructor(data, gameEnv) {
        super(data, gameEnv);
        this.isDefeated = false;
        this.hp = data.hp || 5; // Health points, takes 5 bullets to defeat
        // Collision properties
        this.collisionWidth = data.collisionWidth || this.width || 50;
        this.collisionHeight = data.collisionHeight || this.height || 50;
    }

    update() {
        if (this.isDefeated) return;
        super.update();
    }

    checkCollision(player) {
        if (!player || !player.position) return false;
        return (
            player.position.x < this.x + this.collisionWidth &&
            player.position.x + player.width > this.x &&
            player.position.y < this.y + this.collisionHeight &&
            player.position.y + player.height > this.y
        );
    }

    takeDamage(damage = 1) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.destroy();
        }
    }

    destroy() {
        this.isDefeated = true;
        super.destroy();
    }
}

export default Enemy;
