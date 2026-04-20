# Red Riding Hood Level 3: Comprehensive Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Level 3 Core Structure](#level-3-core-structure)
3. [ShooterPlayer System](#shooterplayer-system)
4. [Enemy System](#enemy-system)
5. [Combat & Collision Detection](#combat--collision-detection)
6. [Visual Feedback Systems](#visual-feedback-systems)
7. [NPC & Dialogue System](#npc--dialogue-system)
8. [Game Flow & Victory Condition](#game-flow--victory-condition)

---

## Architecture Overview

### Module Structure
Level 3 is built using **ES6 module imports** that combine multiple specialized classes:

```javascript
import GameEnvBackground from '../essentials/GameEnvBackground.js';  // Background rendering
import ShooterPlayer from './ShooterPlayer.js';                      // Player with shooting mechanics
import Enemy from './Enemy.js';                                      // Wolf enemy with health
import HitMarker from './HitMarker.js';                              // Visual feedback on hits
import Explosion from './Explosion.js';                              // Explosion animation
import Npc from './enpeecee.js';                                     // Grandma NPC with dialogue
```

**Why This Design Works:**
- Each module handles one specific responsibility (separation of concerns)
- Easy to reuse components across different levels (Level 4 reuses most of these)
- Simple to test and debug individual systems
- Code is modular and maintainable

---

## Level 3 Core Structure

### Constructor Initialization

#### 1. **GameEnv References (Lines 8-12)**
```javascript
this.gameEnv = gameEnv;
let width = gameEnv.innerWidth;
let height = gameEnv.innerHeight;
let path = gameEnv.path;
```

**Purpose:** Stores references to the game environment and extracts commonly-used properties:
- `this.gameEnv`: Main game instance with canvas, context, and game objects array
- `width/height`: Screen dimensions used for positioning sprites
- `path`: Base path for loading images (prevents hardcoding paths)

**Why:** Avoids passing these parameters repeatedly through function calls

---

### Background Setup (Lines 14-26)

#### 2. **Background Configuration**
```javascript
const image_src_forest = path + "/images/gamify/lrrh-lvl3-bg-clipped.png";
const image_data_forest = {
    name: 'forest',
    greeting: "Level 3: Dominate him Baka! Press Q to shoot your heavy metal!",
    src: image_src_forest,
    pixels: { height: 580, width: 1038 }
};

this.background = new GameEnvBackground(image_data_forest, gameEnv);
```

**What This Does:**
- Defines metadata for the background image
- `name`: Identifier for this background
- `greeting`: Text displayed when the level loads (shown to player)
- `src`: Full path to the background image file
- `pixels`: Original sprite sheet dimensions (used for proper scaling)
- Creates a `GameEnvBackground` instance that handles rendering

**Why This Architecture:**
- Separates configuration from rendering logic
- Makes it easy to change backgrounds without rewriting code
- The greeting string is handled by `GameEnvBackground` to display info to the player

---

### Player Setup (Lines 28-50) W

#### 3. **Player Sprite Data Configuration** 
```javascript
const sprite_data_red = {
    id: 'RedRidingHood',                                    // Unique identifier
    greeting: "Red Riding Hood - Press Q to shoot!",        // UI display text
    src: path + "/images/gamify/Finalred.png",              // Sprite sheet image
    SCALE_FACTOR: 6,                                        // How many times to enlarge the sprite
    STEP_FACTOR: 800,                                       // Movement speed pixels/second
    ANIMATION_RATE: 50,                                     // Milliseconds between animation frames
    INIT_POSITION: { x: width / 2 - 50, y: height - 100 }, // Starting position (center-bottom)
    pixels: { height: 144, width: 192 },                    // Original sprite sheet dimensions
    orientation: { rows: 3, columns: 4 },                   // Grid layout of sprite frames (3 directions × 4 frames each)
    down: { row: 0, start: 0, columns: 3 },                 // Frame indices for down animation
    left: { row: 1, start: 0, columns: 3 },                 // Frame indices for left animation
    right: { row: 2, start: 0, columns: 3 },                // Frame indices for right animation
    up: { row: 3, start: 0, columns: 3 },                   // Frame indices for up animation
    hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 }, // Collision box (45% width, 20% height)
    keypress: { up: 87, left: 65, down: 83, right: 68 },    // Key codes: W=87, A=65, S=83, D=68
    shootCooldown: 500                                      // Milliseconds between shots
};

this.player = new ShooterPlayer(sprite_data_red, gameEnv);
```

**Detailed Breakdown:**

- **Sprite Sheet Grid Layout**: The `Finalred.png` contains a 3×4 grid (3 rows for directions, 4 columns for animation frames)
  - Row 0: Down-facing animation
  - Row 1: Left-facing animation
  - Row 2: Right-facing animation
  - Row 3: Up-facing animation

- **Hitbox Configuration**: The collision detection area is 45% of sprite width and 20% of height, creating a realistic collision box that's narrower and shorter than the visual sprite (allows for better platforming feel)

- **Key Codes**: Uses raw key codes rather than key names for performance
  - W = 87 (up)
  - A = 65 (left)
  - S = 83 (down)
  - D = 68 (right)
  - Q = 81 (shoot) - handled separately in ShooterPlayer

- **shootCooldown: 500ms** means 0.5 seconds between shots (2 shots per second maximum)

**Why ShooterPlayer is Created:**
`ShooterPlayer` extends the base `Player` class and adds shooting mechanics. This is instantiated immediately because the GameLevel system will later render it via the `this.classes` array.

---

### Enemy (Wolf) Setup (Lines 52-72) W

#### 4. **Enemy Configuration**
```javascript
const wolfScale = 2;                                  // Scale factor for the wolf sprite
const wolfPixels = { height: 395, width: 632 };      // Original sprite dimensions

const enemyData = {
    id: 'Wolf',
    greeting: "The Wolf!",
    src: path + "/images/gamify/ridinghood/wolfff.png",
    SCALE_FACTOR: wolfScale,                          // Doubles the displayed size
    STEP_FACTOR: 1000,                                // Movement speed (though wolf is static)
    ANIMATION_RATE: 50,
    INIT_POSITION: { x: 150, y: 400 },               // Fixed position: bottom-left area
    pixels: wolfPixels,
    orientation: { rows: 1, columns: 1 },            // Single frame (no animation)
    down: { row: 0, start: 0, columns: 1 },
    collisionWidth: wolfPixels.width * wolfScale,    // Collision area = original width × 2
    collisionHeight: wolfPixels.height * wolfScale,  // Collision area = original height × 2
    hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 }, // Full sprite collision
    hp: 5                                             // Requires 5 bullets to defeat
};

this.enemy = new Enemy(enemyData, gameEnv);
this.enemyDefeated = false;                          // Flag to track game state
```

**Key Details:**

- **Static Position**: Wolf doesn't move; positioned at `(150, 400)` for player to find
- **Large Collision Box**: `widthPercentage: 1.0, heightPercentage: 1.0` means the entire sprite is a collision target (unlike the player's narrower hitbox)
- **Manual Collision Size**: By specifying `collisionWidth` and `collisionHeight` explicitly, we override the default calculation and ensure pixel-perfect collision detection
- **5 HP**: Takes 5 hits to defeat (game balance)
- **Static Sheet**: Only 1 frame (1 row, 1 column) because the wolf doesn't animate

**Why This Matters:**
The explicit collision dimensions ensure the wolf's large sprite accurately represents its hit zone, making combat feel fair to the player.

---

### Grandma NPC Setup (Lines 74-103)

#### 5. **Grandma Configuration with Dynamic Dialogue**
```javascript
const grandmaData = {
    id: 'Grandma',
    src: path + "/images/gamify/lrrh-lvl3-grandma.png",
    SCALE_FACTOR: 2,
    STEP_FACTOR: 1000,
    ANIMATION_RATE: 50,
    INIT_POSITION: { x: 50, y: 150 },                // Upper-left position
    pixels: { height: 1640, width: 2360 },           // Very large original sprite
    orientation: { rows: 1, columns: 1 },
    down: { row: 0, start: 0, columns: 1 },
    interactionRadius: 200,                          // Collision trigger distance
    dialogues: ["WHAT ARE YOU STANDING AROUND FOR? GO KILL that WOLF..."], // Initial dialogue
    reaction: function() {                           // Callback on collision
        if (!this.grandma) this.grandma = grandmaRef;
        if (this.grandma && this.grandma.showReactionDialogue) {
            // Dynamic dialogue update
            if (this.enemyDefeated) {
                // After wolf is defeated
                this.grandma.dialogueSystem.dialogues = ["Now, that's the girl I partially raised!!!"];
            } else {
                // Before wolf is defeated
                this.grandma.dialogueSystem.dialogues = ["WHAT ARE YOU STANDING AROUND FOR? GO KILL that WOLF..."];
            }
            this.grandma.showReactionDialogue(); // Display the dialogue
        }
    }.bind(this)
};

this.grandma = new Npc(grandmaData, gameEnv);
const grandmaRef = this.grandma;
```

**Important Concepts:**

- **reaction Function**: A callback that fires when the player collides with grandma's `interactionRadius`
- **Dynamic Dialogue**: The `reaction` function checks `this.enemyDefeated` and updates grandma's dialogue accordingly:
  - **Before defeat**: Urges Red to kill the wolf
  - **After defeat**: Praises Red for defeating the wolf

- **`.bind(this)`**: Ensures the `reaction` function executes with the correct `this` context (referring to the Level3 instance, not the NPC)

- **grandmaRef**: Stores a reference to `this.grandma` for use inside the `reaction` function (needed because the function's `this` is rebound)

**Why This Architecture:**
By updating `dialogueSystem.dialogues` dynamically, the NPC responds to game state changes without needing separate dialogue objects. This makes the dialogue system reactive and flexible.

---

### Classes Registration (Lines 105-111)

#### 6. **GameLevel System Integration**
```javascript
this.classes = [
    { class: GameEnvBackground, data: image_data_forest },
    { class: ShooterPlayer, data: sprite_data_red },
    { class: Enemy, data: enemyData },
    { class: Npc, data: grandmaData }
];
```

**Purpose:**
This array tells the GameLevel system which classes to instantiate and render. The GameLevel framework will:
1. Create instances of each class with the provided data
2. Add them to `gameEnv.gameObjects` array
3. Call `update()` on each every frame
4. Call `draw()` on each every frame

**Why This Matters:**
Decouples the level logic from the rendering system. The level doesn't need to know HOW to render; it just specifies WHAT to render.

---

## ShooterPlayer System

### Class Hierarchy & Initialization (Lines 1-12 of ShooterPlayer.js)

```javascript
import Player from '../essentials/Player.js';
import Bullet from './Bullet.js';

class ShooterPlayer extends Player {
    constructor(data, gameEnv) {
        super(data, gameEnv);                           // Calls parent Player constructor
        this.bullets = [];                              // Array to track active bullets
        this.shootCooldown = data.shootCooldown || 500; // Cooldown in milliseconds
        this.lastShotTime = 0;                          // Timestamp of last shot
        this.facing = 'up';                             // Current facing direction
    }
```

**Inheritance Model:**
- `ShooterPlayer` extends `Player` (the base character class)
- Reuses all movement, animation, and drawing code from `Player`
- Adds: bullet tracking, shooting mechanics, facing direction

**Constructor Variables:**
- `this.bullets = []`: Array of active `Bullet` objects. When `shoot()` creates a bullet, it's added here and to `gameEnv.gameObjects`
- `this.shootCooldown`: Prevents spam shooting (500ms = max 2 shots/second)
- `this.lastShotTime`: Tracks when the last shot was fired (compared against cooldown)
- `this.facing`: Determines bullet direction. Updated in `update()` based on movement keys

---

### Update Loop (Lines 14-31 of ShooterPlayer.js)

```javascript
update() {
    super.update();                                    // Calls Player's update (handles WASD movement)

    // Update facing direction based on movement
    if (this.velocity.x > 0) this.facing = 'right';   // Moving right → face right
    else if (this.velocity.x < 0) this.facing = 'left'; // Moving left → face left
    else if (this.velocity.y > 0) this.facing = 'down'; // Moving down → face down
    else if (this.velocity.y < 0) this.facing = 'up';  // Moving up → face up

    // Check for Q key press to shoot
    if (this.pressedKeys[81]) {                        // 81 = Q key code
        this.shoot();                                  // Fire a bullet
    }

    // Update bullets
    this.updateBullets();
}
```

**Key Logic:**

1. **`super.update()`**: Calls the parent `Player` class's update method, which handles:
   - Reading WASD keys from `this.pressedKeys`
   - Updating `this.velocity` based on movement
   - Moving the sprite (updating `this.position`)
   - Updating animation frame

2. **Facing Direction**: Updated EVERY frame based on current velocity. This ensures:
   - If holding RIGHT key, the sprite faces and shoots right
   - If holding UP key, the sprite faces and shoots up
   - Bullets always fire in the direction the player is moving

3. **Shoot Cooldown Check**: `if (this.pressedKeys[81])` checks if Q is pressed. The `shoot()` method internally checks cooldown to prevent rapid-fire

4. **Bullet Updates**: `updateBullets()` removes destroyed bullets from the tracking array

---

### Shooting Mechanics (Lines 33-60 of ShooterPlayer.js)

```javascript
shoot() {
    const currentTime = Date.now();
    if (currentTime - this.lastShotTime < this.shootCooldown) return;  // Cooldown check

    this.lastShotTime = currentTime;  // Update last shot time

    // Create bullet data based on facing direction
    let velocity = { x: 0, y: 0 };
    switch (this.facing) {
        case 'up': velocity.y = -6; break;      // Move up: -6 pixels/frame
        case 'down': velocity.y = 6; break;     // Move down: +6 pixels/frame
        case 'left': velocity.x = -6; break;    // Move left: -6 pixels/frame
        case 'right': velocity.x = 6; break;    // Move right: +6 pixels/frame
    }

    const bulletData = {
        x: this.position.x + this.width / 2 - 20,  // Start at player center
        y: this.position.y + this.height / 2 - 20,
        velocity: velocity,                         // Direction of bullet
        gameEnv: this.gameEnv,
        shooter: this,
        direction: this.facing
    };

    const bullet = new Bullet(bulletData);
    this.bullets.push(bullet);                      // Track locally
    this.gameEnv.gameObjects.push(bullet);          // Add to game rendering
    console.log('Bullet spawned at', this.position.x, this.position.y, 'facing', this.facing);
}
```

**Breakdown:**

1. **Cooldown Enforcement**: Compares current time to `lastShotTime`. If less than `shootCooldown` ms has passed, return early (don't shoot)

2. **Velocity Assignment**: Bullet moves at 6 pixels per game loop frame in the facing direction:
   - Up: `velocity.y = -6` (negative = upward)
   - Down: `velocity.y = +6` (positive = downward)
   - Left: `velocity.x = -6` (negative = leftward)
   - Right: `velocity.x = +6` (positive = rightward)

3. **Bullet Spawning Position**: 
   - `player.position.x + player.width / 2 - 20` → centers bullet horizontally, then offsets by -20 (bullet width is 40, so -20 centers it)
   - Same for Y axis
   - This ensures bullets appear from the player's center

4. **Dual Tracking**: 
   - Added to `this.bullets` for the ShooterPlayer to track
   - Added to `gameEnv.gameObjects` so the game loop renders and updates it

---

### Bullet Updates (Lines 62-70 of ShooterPlayer.js)

```javascript
updateBullets() {
    // Remove destroyed bullets
    this.bullets = this.bullets.filter(bullet => {
        return this.gameEnv.gameObjects.includes(bullet);
    });
}
```

**Purpose:** 
Keeps the `this.bullets` array in sync with `gameEnv.gameObjects`. When a bullet is destroyed (collision or lifetime expired), it's removed from `gameEnv.gameObjects`, and this filter removes it from the ShooterPlayer's tracking array too.

**Why Needed:**
Prevents memory leaks and keeps the bullets array clean of dead objects.

---

## Enemy System

### Enemy Class (Enemy.js Lines 1-34)

```javascript
import Character from '../essentials/Character.js';

class Enemy extends Character {
    constructor(data, gameEnv) {
        super(data, gameEnv);
        this.isDefeated = false;
        this.hp = data.hp || 5;                    // Default 5 health points
        this.collisionWidth = data.collisionWidth || this.width || 50;   // Custom collision size
        this.collisionHeight = data.collisionHeight || this.height || 50;
    }

    update() {
        if (this.isDefeated) return;               // Stop updating if defeated
        super.update();                            // Call parent update
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
```

**Key Methods:**

1. **`constructor`**: Sets up health and custom collision dimensions
   - `this.hp = data.hp || 5`: Defaults to 5 health if not specified
   - Custom `collisionWidth/Height` allows precise collision detection (separate from visual sprite size)

2. **`update()`**: Returns early if defeated (stops updating defeated enemies)

3. **`checkCollision(player)`**: AABB (Axis-Aligned Bounding Box) collision detection
   - Checks if the player's bounding box overlaps with the enemy's collision box
   - Used to determine if player is overlapping the enemy

4. **`takeDamage(damage = 1)`**: Reduces health
   - Default damage is 1 per shot
   - If HP drops to 0 or below, calls `destroy()`

5. **`destroy()`**: Sets `isDefeated = true` (prevents further updates) and removes from game objects

---

## Combat & Collision Detection

### Level 3 Update Loop (Lines 114-186 of level3.js)

#### 7. **Main Game Loop**

```javascript
update() {
    if (this.enemyDefeated) return;                    // Stop updating if wolf is dead

    const player = this.gameEnv.gameObjects.find(obj => obj instanceof ShooterPlayer);
    const enemy = this.gameEnv.gameObjects.find(obj => obj instanceof Enemy);

    if (!player || !enemy) return;                     // Safety check
```

**Purpose:**
- `if (this.enemyDefeated) return;` → Once the wolf is defeated, stop processing combat
- Retrieves the player and enemy from `gameEnv.gameObjects` using `instanceof` checks
- Safety check ensures both exist before proceeding

---

#### 8. **Player-Enemy Collision Detection (Lines 130-154)**

```javascript
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
```

**What This Does:**

1. **Creates Bounding Boxes**: Stores player and enemy positions/sizes
2. **AABB Collision Check**: Tests if boxes overlap using four conditions:
   - `playerBox.x < wolfBox.x + wolfBox.width` → player's left edge is left of wolf's right edge
   - `playerBox.x + playerBox.width > wolfBox.x` → player's right edge is right of wolf's left edge
   - Same for Y axis
   - All four must be true for collision

3. **Pushback Logic**: If colliding, reverses the player's movement to prevent walking through the wolf:
   - If moving right (`velocity.x > 0`), place player to the left of wolf
   - If moving left (`velocity.x < 0`), place player to the right of wolf
   - Same for vertical movement

**Why This Matters:**
This prevents clipping; the player can't walk into the wolf's sprite. Bullets can still hit from inside because they use different collision logic.

---

#### 9. **Bullet-Enemy Collision & Combat (Lines 156-207)**

```javascript
player.bullets.forEach(bullet => {
    if (bullet.checkCollision(enemy)) {            // If bullet hits enemy
        enemy.takeDamage(1);                       // Deal 1 damage
        bullet.destroy();                          // Bullet disappears

        // Show hit marker for 0.5s after every hit
        const hitMarker = new HitMarker(
            enemy.x + enemy.width / 2,             // Center X of enemy
            enemy.y,                                // Top Y of enemy
            this.gameEnv
        );
        this.gameEnv.gameObjects.push(hitMarker);

        // Check if enemy is defeated
        if (enemy.hp <= 0) {
            this.enemyDefeated = true;
            
            // Store enemy position before destroying
            const enemyX = enemy.x;
            const enemyY = enemy.y;
            const enemyWidth = enemy.width;
            const enemyHeight = enemy.height;
            
            // Show explosion for 1s
            const explosion = new Explosion(
                enemyX + enemyWidth / 2,
                enemyY + enemyHeight / 2,
                this.gameEnv
            );
            this.gameEnv.gameObjects.push(explosion);

            // After 1s, transform wolf into grandma and show message
            setTimeout(() => {
                // Add grandma sprite at stored wolf's position
                const grandma = new Image();
                grandma.src = this.gameEnv.path + '/images/gamify/lrrh-lvl3-grandma.png';
                const ctx = this.gameEnv.ctx;
                ctx.drawImage(
                    grandma,
                    enemyX,
                    enemyY,
                    enemyWidth,
                    enemyHeight
                );
                this.showGrandmaVictory();          // Show victory popup
            }, 1000);

            enemy.destroy();                        // Remove wolf from game
        }
    }
});
```

**Detailed Breakdown:**

1. **Collision Check**: `bullet.checkCollision(enemy)` uses AABB collision on the bullet and enemy's hitboxes

2. **Damage System**: 
   - `enemy.takeDamage(1)` reduces health by 1
   - `bullet.destroy()` removes the bullet
   - Hit marker created at enemy center (visual feedback to player)

3. **Defeat Condition**:
   - When `enemy.hp <= 0`, several things happen:
   - `this.enemyDefeated = true` → stops the update loop
   - Enemy position is stored (needed for animation later)

4. **Explosion Animation**:
   - Creates an `Explosion` object at the enemy's center
   - Added to `gameEnv.gameObjects` so it renders for 1 second
   - The `Explosion` class auto-removes itself after 1000ms (see below)

5. **Victory Sequence** (1-second delay):
   - `setTimeout(..., 1000)` waits 1 second for explosion to finish
   - Draws the grandma sprite at the wolf's location (visual transformation)
   - `showGrandmaVictory()` displays the victory popup

---

## Visual Feedback Systems

### HitMarker Class (HitMarker.js)

```javascript
class HitMarker {
    constructor(x, y, gameEnv) {
        this.x = x;
        this.y = y;
        this.gameEnv = gameEnv;
        this.sprite = new Image();
        this.sprite.src = gameEnv.path + "/images/gamify/lrrh-lvl3-hit-marker.png";
        this.width = 32;
        this.height = 32;
        this.creationTime = Date.now();
        this.duration = 500;                    // 0.5 second display time
        this.destroyed = false;
    }

    update() {
        if (Date.now() - this.creationTime > this.duration) {
            this.destroy();
        }
    }

    draw() {
        if (!this.destroyed && this.sprite.complete) {
            this.gameEnv.ctx.drawImage(
                this.sprite,
                this.x - this.width / 2,        // Center horizontally
                this.y - this.height,           // Above the enemy
                this.width,
                this.height
            );
        }
    }

    destroy() {
        if (!this.destroyed) {
            this.destroyed = true;
            const index = this.gameEnv.gameObjects.indexOf(this);
            if (index !== -1) {
                this.gameEnv.gameObjects.splice(index, 1);
            }
        }
    }
}
```

**How It Works:**

1. **Creation**: Positioned at enemy center, displays a hit marker image
2. **Duration**: Automatically destroys itself after 500ms (0.5 seconds)
3. **Update Check**: Each frame, checks if 500ms has elapsed; if so, calls `destroy()`
4. **Draw**: Renders the marker image centered horizontally and above the enemy (Y = enemy.y - height)
5. **Cleanup**: Removes itself from `gameEnv.gameObjects` when destroyed

**Purpose**: Provides visual feedback to the player that their shot hit the target

---

### Explosion Class (Explosion.js)

```javascript
class Explosion {
    constructor(x, y, gameEnv) {
        this.x = x;
        this.y = y;
        this.gameEnv = gameEnv;
        this.sprite = new Image();
        this.sprite.src = gameEnv.path + "/images/gamify/lrrh-lvl3-kaboom.png";
        this.width = 128;
        this.height = 128;
        this.creationTime = Date.now();
        this.duration = 1000;                   // 1 second display time
        this.destroyed = false;
    }

    update() {
        if (Date.now() - this.creationTime > this.duration) {
            this.destroy();
        }
    }

    draw() {
        if (!this.destroyed && this.sprite.complete) {
            this.gameEnv.ctx.drawImage(
                this.sprite,
                this.x - this.width / 2,        // Center both horizontally and vertically
                this.y - this.height / 2,
                this.width,
                this.height
            );
        }
    }

    destroy() {
        if (!this.destroyed) {
            this.destroyed = true;
            const index = this.gameEnv.gameObjects.indexOf(this);
            if (index !== -1) {
                this.gameEnv.gameObjects.splice(index, 1);
            }
        }
    }
}
```

**How It Differs From HitMarker:**

1. **Larger**: 128×128 pixels (vs. 32×32 for hit marker)
2. **Longer Duration**: 1000ms (1 second) vs. 500ms
3. **Centered**: Both horizontally AND vertically (hit marker is above the target)
4. **Purpose**: Dramatic visual effect for enemy defeat

**The Auto-Removal Pattern:**
Both `HitMarker` and `Explosion` use the same pattern:
- Track creation time
- In `update()`, check if duration elapsed
- If so, remove from `gameEnv.gameObjects`

This is a common game dev pattern for temporary visual effects.

---

## NPC & Dialogue System

### Npc Class (enpeecee.js)

#### 10. **Constructor & Initialization (Lines 1-50)**

```javascript
import Character from "../essentials/Character.js";
import DialogueSystem from "../essentials/DialogueSystem.js";

class Npc extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.currentQuestionIndex = 0;
        this.alertTimeout = null;
        this.isInteracting = false;

        // --- Patrol/Movement properties from data ---
        this.walkingArea = data?.walkingArea || null;
        this.speed = data?.speed || 1;
        this.moveDirection = data?.moveDirection || { x: 1, y: 1 };

        // IMPORTANT: Create a unique ID for each NPC to avoid conflicts
        const sanitizedId = (data?.id || "").replace(/\s+/g, "_");
        this.uniqueId = sanitizedId + "_" + Math.random().toString(36).substr(2, 9);

        // IMPORTANT: Create a local dialogue system for this NPC specifically
        if (data?.dialogues) {
            this.dialogueSystem = new DialogueSystem({
                dialogues: data.dialogues,
                id: this.uniqueId
            });
        } else {
            const greeting = data?.greeting || "Hello, traveler!";
            this.dialogueSystem = new DialogueSystem({
                dialogues: [
                    greeting,
                    "Nice weather we're having, isn't it?",
                    "I've been standing here for quite some time."
                ],
                id: this.uniqueId
            });
        }

        if (gameEnv && gameEnv.gameControl) {
            gameEnv.gameControl.registerInteractionHandler(this);
        }
    }
```

**Key Concepts:**

1. **Inheritance**: Extends `Character` for base sprite/animation handling

2. **Unique ID Generation**:
   - Takes `data.id` (e.g., "Grandma")
   - Replaces spaces with underscores: "Grandma_NPC" → "Grandma_NPC"
   - Appends random string: `"Grandma_NPC_a1b2c3d4e5"`
   - Ensures each NPC instance has a unique identifier (important if multiple NPCs exist)

3. **DialogueSystem Creation**:
   - If `data.dialogues` provided, uses those
   - Otherwise creates default dialogues
   - Passes the unique ID to prevent conflicts between NPCs

4. **Patrol Properties**:
   - `walkingArea`: If defined, NPC walks within this boundary
   - `speed`: Movement speed (1 = slow, 5 = fast)
   - `moveDirection`: Initial direction `{ x: 1, y: 1 }` means moving diagonally down-right

---

#### 11. **Update & Patrol (Lines 52-87 of enpeecee.js)**

```javascript
update() {
    super.update();

    // General patrol logic for any NPC with walkingArea
    if (this.walkingArea) {
        this.patrol();
    }
}

patrol() {
    if (!this.moveDirection) this.moveDirection = { x: 1, y: 1 };
    if (!this.speed) this.speed = 1;
    
    // Update position based on direction and speed
    this.position.x += this.moveDirection.x * this.speed;
    this.position.y += this.moveDirection.y * this.speed;

    // Bounce off left/right boundaries and update sprite direction
    if (this.position.x <= this.walkingArea.xMin) {
        this.position.x = this.walkingArea.xMin;
        this.moveDirection.x = 1;
        this.direction = 'right';
    }
    if (this.position.x + this.width >= this.walkingArea.xMax) {
        this.position.x = this.walkingArea.xMax - this.width;
        this.moveDirection.x = -1;
        this.direction = 'left';
    }

    // Bounce off top/bottom boundaries
    if (this.position.y <= this.walkingArea.yMin) {
        this.position.y = this.walkingArea.yMin;
        this.moveDirection.y = 1;
    }
    if (this.position.y + this.height >= this.walkingArea.yMax) {
        this.position.y = this.walkingArea.yMax - this.height;
        this.moveDirection.y = -1;
    }
}
```

**How Patrol Works:**

1. **Movement**: Each frame, moves by `moveDirection * speed`
2. **Boundary Bouncing**: When hitting a boundary:
   - Clamps position to boundary
   - Reverses the direction (e.g., `moveDirection.x = 1` becomes `-1`)
   - Updates sprite direction to face the new direction

**In Level 3:**
Grandma doesn't have a `walkingArea`, so she stays static at `(50, 150)`. The patrol method is only used if `walkingArea` is defined.

---

#### 12. **Dialogue Methods (Lines 89-127 of enpeecee.js)**

```javascript
showReactionDialogue() {
    if (!this.dialogueSystem) return;

    const npcName = this.spriteData?.id || "";
    const npcAvatar = this.spriteData?.src || null;

    // Shows first dialogue entry or falls back to greeting
    const dialogue = this.dialogueSystem?.dialogues?.[0] || 
                     this.spriteData?.dialogues?.[0] || 
                     this.spriteData?.greeting || 
                     "Hello!";

    if (this.spriteData?.greeting === false && !this.spriteData?.dialogues?.length) {
        console.log("Greeting set to false and no dialogue entries provided!")
        return;
    }

    this.dialogueSystem.showDialogue(dialogue, npcName, npcAvatar, this.spriteData);
}

showRandomDialogue() {
    if (!this.dialogueSystem) return;

    const npcName = this.spriteData?.id || "";
    const npcAvatar = this.spriteData?.src || null;

    this.dialogueSystem.showRandomDialogue(npcName, npcAvatar, this.spriteData);
}
```

**Two Dialogue Methods:**

1. **`showReactionDialogue()`**: Shows the FIRST dialogue in the array
   - Used for immediate responses (e.g., when player collides with NPC)
   - Has fallback logic: checks dialogueSystem → spriteData.dialogues → spriteData.greeting → "Hello!"
   - Used by Grandma's `reaction` callback in Level 3

2. **`showRandomDialogue()`**: Shows a RANDOM dialogue from the array
   - Used for varied interactions

**In Level 3:**
When the player collides with Grandma:
1. Grandma's `reaction` function fires
2. Updates `this.grandma.dialogueSystem.dialogues` based on game state
3. Calls `this.grandma.showReactionDialogue()`
4. Displays the first dialogue in the updated array

---

## Game Flow & Victory Condition

### Victory Display (Lines 210-243 of level3.js)

#### 13. **showGrandmaVictory Method**

```javascript
showGrandmaVictory() {
    const message = document.createElement('div');
    message.id = 'victory-popup';
    message.style.position = 'absolute';
    message.style.top = '40%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.background = 'rgba(255, 225, 159, 0.95)';
    message.style.border = '4px solid #b00';
    message.style.padding = '32px';
    message.style.borderRadius = '16px';
    message.style.fontSize = '1.5em';
    message.style.textAlign = 'center';
    message.style.zIndex = 1000;
    message.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
    
    message.innerHTML = `
        <h2 style="color:yellow; margin-top:0;">Victory!</h2>
        <p style="color:blue;">Good job my girl! These old wolfies have gone rampant this season. Now you said you have some cookies?<br><br></p>
        <button onclick="location.reload()" style="padding:12px 24px; font-size:18px; cursor:pointer; background:#b00; color:white; border:none; border-radius:8px; font-weight:bold;">Play Again</button>
    `;
    document.body.appendChild(message);
}
```

**DOM Manipulation Breakdown:**

1. **Creates Popup Element**: `document.createElement('div')` creates a new div
2. **Positioning**: 
   - `position: 'absolute'` → floats above canvas
   - `top: '40%', left: '50%'` → positions at center-upper part of screen
   - `transform: 'translate(-50%, -50%)'` → offsets by half width/height to truly center

3. **Styling**:
   - Beige background (`rgba(255, 225, 159, 0.95)`)
   - Red border (`#b00` = dark red)
   - Shadow for depth

4. **Content**: Sets inner HTML with:
   - Yellow heading "Victory!"
   - Blue congratulations text
   - Red "Play Again" button that reloads the page

5. **Appends to DOM**: `document.body.appendChild(message)` adds it to the page

**Why This Works:**
By appending directly to `document.body`, the popup appears above the canvas, not inside it. The `zIndex: 1000` ensures it's on top of other page elements.

---

### Game State Management

#### 14. **enemyDefeated Flag**

Throughout the level:
- **Initial**: `this.enemyDefeated = false` (line 80)
- **Combat**: Checked at start of `update()` (line 115): if true, stop processing
- **On Defeat**: Set to `true` (line 189) when `enemy.hp <= 0`
- **Effects**: 
  - Stops the collision detection loop (prevents updating dead enemies)
  - Allows grandma's dialogue to change (she checks this flag)

---

## Summary: Why It Works This Way

### Modular Architecture
- **Separation of Concerns**: Each class handles one responsibility
- **Reusability**: ShooterPlayer, Enemy, HitMarker used in Level 4 too
- **Maintainability**: Changes to one class don't affect others

### Collision Detection
- **Player-Enemy**: AABB collision prevents clipping
- **Bullet-Enemy**: Uses separate collision logic for precise hit detection
- **Hit Feedback**: Visual effects (HitMarker, Explosion) provide immediate feedback

### Dynamic Dialogue
- **State-Reactive**: Grandma's dialogue changes based on `enemyDefeated` flag
- **Runtime Updates**: Updating `dialogueSystem.dialogues` array dynamically changes NPC responses
- **Unique IDs**: Prevents dialogue conflicts between multiple NPCs

### Victory Sequence
- **Asynchronous**: Explosion plays for 1 second before victory popup
- **Visual Polish**: Grandma sprite drawn at wolf location (transformation effect)
- **Cleanup**: Popup has unique ID (`'victory-popup'`) for easy removal in next level

### Performance Considerations
- **Lazy Removal**: Bullets and effects auto-remove after duration
- **Instanced Objects**: Only active bullets/explosions tracked in arrays
- **Early Returns**: `if (this.enemyDefeated) return;` skips processing when not needed

---

## Conclusion

Level 3 demonstrates a well-architected game level using:
- **ES6 Modules** for clean code organization
- **Inheritance** to share common behavior between characters
- **State Management** with flags like `enemyDefeated`
- **Temporal Effects** with setTimeout for timed sequences
- **DOM Manipulation** for UI overlays
- **Collision Detection** for gameplay mechanics
- **Visual Feedback** through temporary sprite effects

Each component serves a specific purpose, and the system remains flexible enough for both combat (level 3) and waves of enemies (level 4).
