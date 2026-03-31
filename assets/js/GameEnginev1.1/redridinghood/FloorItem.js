// FloorItem.js - Simple item that appears on the floor/ground
class FloorItem {
    constructor(x, y, itemData) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.itemData = itemData;

        // Create DOM element for the item
        this.element = document.createElement('img');
        this.element.src = itemData.image;
        this.element.style.position = 'absolute';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.element.style.zIndex = '1000';
        this.element.style.pointerEvents = 'none';

        // Add to game container
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(this.element);
        }
    }

    // Clean up the DOM element
    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

export default FloorItem;