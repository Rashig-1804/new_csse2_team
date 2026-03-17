# Red Riding Hood Shooting Mechanics

This document explains the shooting mechanics added to levels 3 and 4 of the Red Riding Hood game.

## Overview

- **Level 3**: Face a single wolf enemy in the upper middle of the screen. Shoot it with Q to proceed.
- **Level 4**: Shooting minigame with random enemy spawns, scoring, and timer.

## Files Added

### Core Classes
- `ShooterPlayer.js` - Extends Player class with shooting capabilities
- `Bullet.js` - Handles bullet movement and collision
- `Enemy.js` - Basic enemy class for targets
- `HitMarker.js` - Visual feedback for successful hits

### Levels
- `level3.js` - Single enemy confrontation
- `level4.js` - Minigame with scoring and timer
- `level3.md` - Markdown page for level 3
- `level4.md` - Markdown page for level 4

## How to Access

1. Start the Jekyll server: `make serve`
2. Visit:
   - Level 3: `http://localhost:4599/new_csse2_team/gamify/redridinghood3`
   - Level 4: `http://localhost:4599/new_csse2_team/gamify/redridinghood4`

## Controls

- **WASD** - Move the player
- **Q** - Shoot bullets
- Bullets move in the direction the player is facing

## Adding Custom Sprites

To use your own sprites instead of the default colored rectangles:

### 1. Prepare Your Sprite Images
Place your sprite files in the `images/` directory, for example:
- `images/player_sprite.png`
- `images/enemy_sprite.png`
- `images/bullet_sprite.png`

### 2. Modify the Classes

#### For ShooterPlayer (player sprite):
```javascript
// In level3.js or level4.js, modify the player data:
const sprite_data_red = {
    // ... other properties
    src: path + "/images/player_sprite.png", // Your custom sprite
    // Remove SCALE_FACTOR and pixels if using custom image
    SCALE_FACTOR: 1, // Set to 1 for custom sizing
    pixels: { height: 64, width: 64 }, // Your sprite dimensions
};
```

#### For Enemies:
```javascript
const enemyData = {
    // ... other properties
    src: path + "/images/enemy_sprite.png", // Your enemy sprite
    SCALE_FACTOR: 1,
    pixels: { height: 64, width: 64 },
};
```

#### For Bullets (optional):
Modify `Bullet.js` to use an image instead of a colored rectangle:
```javascript
class Bullet {
    constructor(data) {
        // ... existing constructor
        this.sprite = new Image();
        this.sprite.src = data.gameEnv.path + "/images/bullet_sprite.png";
    }

    draw() {
        if (!this.destroyed) {
            this.gameEnv.ctx.drawImage(
                this.sprite,
                this.x, this.y,
                this.width, this.height
            );
        }
    }
}
```

### 3. Sprite Requirements

- **Format**: PNG recommended for transparency
- **Size**: Consistent dimensions (e.g., 64x64 pixels)
- **Orientation**: If using sprite sheets, ensure proper orientation setup

## Hit Markers

When a bullet successfully hits an enemy, a hit marker sprite appears:
- **Sprite**: `lrrh-lvl3-hit-marker.png`
- **Position**: Centered above the enemy
- **Duration**: 1 second
- **Effect**: Visual feedback for successful hits

The hit marker automatically disappears after 1 second and is cleaned up from the game objects.

## Game Mechanics

### Level 3
- Single enemy in upper middle
- Shoot to defeat and proceed to level 4

### Level 4 (Minigame)
- Random enemy spawns every 2 seconds
- Maximum 5 enemies on screen
- Enemies disappear after 3 seconds if not shot
- Scoring: +10 for hits, -5 for misses
- 60-second timer
- Goal: Get highest score possible

## Customization Options

### Shooting
- `shootCooldown`: Time between shots (milliseconds)
- Bullet speed and lifetime in `Bullet.js`

### Enemy Behavior
- Spawn rate in `level4.js`
- Enemy lifespan before disappearing
- Scoring penalties/rewards

### Visuals
- Background images
- Player/enemy sprites
- Bullet appearance

## Troubleshooting

### Black Screen Issues
- Ensure sprite paths are correct
- Check browser console for 404 errors
- Verify image files exist in the correct directory

### Shooting Not Working
- Check that Q key (keyCode 81) is being detected
- Verify ShooterPlayer is being used instead of regular Player
- Check browser console for errors

### Enemies Not Spawning
- Ensure level4.js is loading correctly
- Check spawn rate timing
- Verify enemy creation logic

## Future Enhancements

- Multiple bullet types
- Power-ups
- Different enemy types
- Sound effects
- Particle effects on hits